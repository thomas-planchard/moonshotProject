import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './dashboard.style';
import { ICONS } from '@/constants';
import { doc, onSnapshot, updateDoc, Unsubscribe } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useRouter } from 'expo-router';
import { ProfilImage } from '@/components/common/ProfilImage';
import { useAuth } from '@/context/AuthContext';

interface DashboardProps {
  onStepCountChange?: (stepCount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStepCountChange }) => {
  const routing = useRouter();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPedometerAvailable, setPedometerAvailability] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  // Create refs to store previous values
  const prevStepCount = useRef(stepCount);
  const prevCalories = useRef(calories);
  const prevDistance = useRef(distance);

  // Define constants
  const strideLength = 0.78; // meters per step
  const userWeight = 70; // kg
  const metValue = 3.5; // MET value for walking

  // Calculate distance in kilometers
  const calculateDistance = (steps: number) => ((steps * strideLength) / 1000).toFixed(2);

  // Calculate calories burned
  const calculateCalories = (steps: number) => {
    const durationInHours = steps / 5000; // assuming 5000 steps/hour
    return (metValue * userWeight * durationInHours).toFixed(2);
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const fetchData = async () => {
      try {
        if (user && user.userId) {
          const userDataRef = doc(db, 'userData', user.userId);
          unsubscribe = onSnapshot(userDataRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setCarbonFootprint(userData.carbonFootprint || 0);
              setCalories(userData.calories || 0);
              setDistance(userData.distance || 0);
              setStepCount(userData.steps || 0);
              if (onStepCountChange) onStepCountChange(userData.steps || 0);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, onStepCountChange]);

  useEffect(() => {
    let pedometerSubscription: any;

    const initializePedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setPedometerAvailability(isAvailable);
        if (isAvailable) {
          pedometerSubscription = Pedometer.watchStepCount((result) => {
            const newSteps = result.steps;
            const totalSteps = stepCount + newSteps;

            console.log('New steps:', totalSteps);
            setStepCount((prevSteps) => prevSteps + newSteps); // Update steps locally
            setDistance(parseFloat(calculateDistance(totalSteps))); // Update distance locally
            setCalories(parseFloat(calculateCalories(totalSteps))); // Update calories locally

            if (onStepCountChange) onStepCountChange(totalSteps); // Notify parent component
          });
        } else {
          Alert.alert('Pedometer not available', 'Your device does not support the Pedometer sensor.');
        }
      } catch (error) {
        console.error('Pedometer availability check failed:', error);
        setPedometerAvailability(false);
      }
    };

    initializePedometer();

    return () => {
      if (pedometerSubscription) pedometerSubscription.remove();
    };
  }, [stepCount, onStepCountChange]);

  useEffect(() => {
    if (user && user.userId) {
      const intervalId = setInterval(async () => {
        // Only update Firestore if the values have changed
        if (
          stepCount !== prevStepCount.current ||
          calories !== prevCalories.current ||
          distance !== prevDistance.current
        ) {
          console.log('Updating user data...', distance, calories, stepCount);

          const userDataRef = doc(db, 'userData', user.userId);
          await updateDoc(userDataRef, {
            steps: stepCount,
            calories: calories,
            distance: distance,
          });

          // Update the refs with the current values
          prevStepCount.current = stepCount;
          prevCalories.current = calories;
          prevDistance.current = distance;
        }
      }, 60000); // Update every 60 seconds

      return () => clearInterval(intervalId);
    }
  }, [stepCount, calories, distance, user]);

  const goToInfoUser = () => {
    routing.navigate('screens/InfoUser');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeMessage}>Hello,</Text>
          {user?.username ? (
            <Text style={styles.userName}>{user?.username}!</Text>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
        <TouchableOpacity onPress={goToInfoUser}>
          <ProfilImage
            imageState={imageLoaded}
            source={user?.profileImageUrl}
            style={styles.profil}
            setImageState={setImageLoaded}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.containerStepCarbon}>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>{stepCount}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.userInformationSecondary, { width: wp(10) }]}>Steps</Text>
            <Image source={ICONS.steps} resizeMode="contain" style={styles.stepImage} />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.userInformationMain}>{carbonFootprint} kg</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={ICONS.carbon} resizeMode="contain" style={styles.carbonImage} />
            <Text style={[styles.userInformationSecondary, { width: wp(25) }]}>Carbon Footprint</Text>
          </View>
        </View>
      </View>
      <View style={styles.infoContainerLarge}>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>12.19</Text>
          <Text style={styles.userInformationSecondary2}>Coins</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>{distance} KM</Text>
          <Text style={styles.userInformationSecondary2}>Distance</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>{calories}</Text>
          <Text style={styles.userInformationSecondary2}>Calories</Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
