import React, { useState, useEffect } from "react";
import { ScrollView, View, AppState, Alert } from "react-native";
import {
  Activities,
  Recommendation,
  Dashboard,
} from "../../../components";
import { useMovementDetector, MovementType } from '@/utils/MovementDetection';
import { getStoredActivities, storeActivity } from "@/utils/AsyncStorage";
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import styles from "@/components/home/whitebackground/whitebackground.style";
import { COLORS } from "@/constants";

export default function Home() {
  const [movement, setMovement] = useState<MovementType>('Uncertain');
  const [appState, setAppState] = useState(AppState.currentState);
  const [isMovementDetectionActive, setIsMovementDetectionActive] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<{activity?: string; distance?: string; }>({});

 



  // Always call the useMovementDetector hook
  useMovementDetector({
    onMovementChange: setMovement,
    isActive: isMovementDetectionActive,
  });

  useEffect(() => {
    let locationSubscription;

    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return false;
      }
      return true;
    };

    const startTracking = async () => {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setTotalDistance((prevDistance) => prevDistance + location.coords.speed * (10 / 3600)); // Distance in km
        }
      );
    };

    const stopTracking = () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };

    const checkForActivities = async () => {
      const activities = await getStoredActivities();
      console.log(activities)
      if (activities.length > 0) {
        const activityCounts = activities.reduce((acc, activity) => {
          acc[activity.movement] = (acc[activity.movement] || 0) + 1;
          return acc;
        }, {});
        const mostFrequentMovement = Object.keys(activityCounts).reduce((a, b) => activityCounts[a] > activityCounts[b] ? a : b);

        setActivityData({
          activity : mostFrequentMovement,
          distance: totalDistance.toFixed(2)
        })
        console.log(activityData)
  
      }
    };

    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkForActivities();
        stopTracking();
      }

      if (nextAppState.match(/inactive|background/)) {
        setIsMovementDetectionActive(true);
        startTracking();
      } else {
        setIsMovementDetectionActive(false);
        stopTracking();
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      stopTracking();
    };
  }, [appState]);

  return (
    <View style={{ backgroundColor: COLORS.blueGreen }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Dashboard />
        <View style={styles.whiteBackground}>
          <Activities activityData={activityData} />
          <Recommendation />
        </View>
      </ScrollView>
    </View>
  );
};