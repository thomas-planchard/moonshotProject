import React, { useState, useEffect } from "react";
import { ScrollView, View, AppState, ActivityIndicator } from "react-native";
import { Activities, Recommendation, Dashboard } from "../../../components";
import { useMovementDetector, MovementType } from '@/utils/MovementDetection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import styles from "@/components/home/whitebackground/whitebackground.style";
import fetchUserData from "@/utils/FetchUserData";
import { COLORS } from "@/constants";
import { getDistance } from 'geolib';

export default function Home() {

  const [movement, setMovement] = useState<MovementType>('Uncertain');
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMovementDetectionActive, setIsMovementDetectionActive] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activityData, setActivityData] = useState<{ activity?: string; distance?: string; time?: string; }>({});

  const { user } = useAuth();
  const [userData, setUserData] = useState<{ consumption?: number; carType?: string; carbonFootprint?: string; }>({});

  useEffect(() => {
    if (user?.userId) {
      const fetchData = async () => {
        const data = await fetchUserData(user.userId, ['consumption', 'carType', 'carbonFootprint']);
        setUserData(data || {});
      };
  
      fetchData();
    }
  }, [user]);

  useMovementDetector({
    onMovementChange: async (newMovement) => {
      setMovement(newMovement);
      let storedMovements = await AsyncStorage.getItem('movements');
      let movements = storedMovements ? JSON.parse(storedMovements) : [];
      movements.push(newMovement);
      await AsyncStorage.setItem('movements', JSON.stringify(movements));
    },
    isActive: isMovementDetectionActive,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return false;
      }
      return true;
    };

    const calculateDistanceAndPrepareActivity = async () => {
      setIsCalculating(true);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure the spinner appears

      let initialLocation = await AsyncStorage.getItem('initialLocation');
      if (!initialLocation) {
        setIsCalculating(false);
        return;
      }

      let startLocation = JSON.parse(initialLocation);
      let endLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      let distance = getDistance(
        startLocation,
        { latitude: endLocation.coords.latitude, longitude: endLocation.coords.longitude }
      );

      let storedMovements = await AsyncStorage.getItem('movements');
      let movements = storedMovements ? JSON.parse(storedMovements) : [];

      let movementFrequency = movements.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});

      let mostFrequentMovement = Object.keys(movementFrequency).reduce((a, b) => 
        movementFrequency[a] > movementFrequency[b] ? a : b
      , 'Uncertain');

      // Prepare data for activity
      setActivityData({
        activity: mostFrequentMovement,
        distance: distance.toFixed(2),
        time: "100",
      });

      await AsyncStorage.removeItem('initialLocation');
      await AsyncStorage.removeItem('movements');
      setIsCalculating(false);
    };

    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        const permissionGranted = await requestLocationPermission();
        if (permissionGranted) {
          calculateDistanceAndPrepareActivity();
        }
      }

      if (nextAppState.match(/inactive|background/)) {
        setIsMovementDetectionActive(true);

        let location = await Location.getCurrentPositionAsync({});
        await AsyncStorage.setItem('initialLocation', JSON.stringify(location.coords));
      } else {
        setIsMovementDetectionActive(false);
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <View style={{ backgroundColor: COLORS.blueGreen }}>
      {isCalculating && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Dashboard />
        <View style={styles.whiteBackground}>
          <Activities data={userData} autoActivity={{ activity: activityData.activity || '', distance: activityData.distance || '', time: activityData.time || '' }} />
          <Recommendation />
        </View>
      </ScrollView>
    </View>
  );
};