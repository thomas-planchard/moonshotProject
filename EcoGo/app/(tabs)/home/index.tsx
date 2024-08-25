import React from "react";
import { ScrollView, View, AppState, Alert } from "react-native";
import {
  Activities,
  Recommendation,
  Dashboard,
} from "../../../components";
import { useMovementDetector, MovementType } from '@/utils/MovementDetection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredActivities } from "@/utils/AsyncStorage";
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import {useAuth} from '@/context/AuthContext';
import styles from "@/components/home/whitebackground/whitebackground.style";
import fetchUserData from "@/utils/fetchUserData";
import { COLORS } from "@/constants";


export default function Home() {

  const [movement, setMovement] = useState<MovementType>('Uncertain');
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMovementDetectionActive, setIsMovementDetectionActive] = useState(false);

  // Get the user object from the AuthContext
  const { user } = useAuth();

  // Variables to hold user data
  const [userData, setUserData] = useState<{ consumption?: number; carType?: string; carbonFootprint?:number; }>({});


    // Effect to fetch user data from the database
    useEffect(() => {
      if (user?.userId) {
        const fetchData = async () => {
          const data = await fetchUserData(user.userId, ['consumption', 'carType', 'carbonFootprint']);
          setUserData(data || {});
        };
    
        fetchData();
      }
    }, [user]);
  

  // Always call the useMovementDetector hook
  useMovementDetector({
    onMovementChange: setMovement,
    isActive: isMovementDetectionActive, // Pass the isActive state to the hook
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

    const checkForActivities = async () => {
      const activities = await getStoredActivities();
      if (activities.length > 0) {
        const lastActivity = activities[activities.length - 1];
        Alert.alert(
          'Activity Detected',
          `You were ${lastActivity.movement}`,
          [{ text: 'OK', onPress: () => AsyncStorage.removeItem('activities') }]
        );
      }
    };

    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        const permissionGranted = await requestLocationPermission();
        if (permissionGranted) {
          checkForActivities();
        }
      }

      // Enable movement detection only when the app is in background or inactive state
      if (nextAppState.match(/inactive|background/)) {
        setIsMovementDetectionActive(true);
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
    
    <View style={{backgroundColor:COLORS.blueGreen}}>
      <ScrollView showsVerticalScrollIndicator={false}>
          <Dashboard/>
          <View style = {styles.whiteBackground}>
          <Activities data={userData}/>
          <Recommendation />
          </View>
      </ScrollView>
    </View>
  );
};
