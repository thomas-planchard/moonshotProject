import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Pedometer } from "expo-sensors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import styles from "./dashboard.style";
import { ICONS } from "@/constants";
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useRouter } from "expo-router";
import { ProfilImage } from "@/components/common/ProfilImage";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const routing = useRouter();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPedometerAvailable, setPedometerAvailability] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  // Define constants
  const strideLength = 0.78; // meters per step
  const userWeight = 70; // kg
  const metValue = 3.5; // MET value for walking

  // Calculate distance in kilometers
  const calculateDistance = (steps) => ((steps * strideLength) / 1000).toFixed(2);

  // Calculate calories burned
  const calculateCalories = (steps) => {
    const durationInHours = steps / 5000; // assuming 5000 steps/hour
    return (metValue * userWeight * durationInHours).toFixed(2);
  };

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      try {
        const result = await Pedometer.isAvailableAsync();
        setPedometerAvailability(result);
        if (result) {
          subscription = Pedometer.watchStepCount((result) => {
            const newSteps = result.steps;
            setStepCount((prevSteps) => prevSteps + newSteps); // Update steps locally
            setDistance(calculateDistance(newSteps)); // Update distance locally
            setCalories(calculateCalories(newSteps)); // Update calories locally
          });
        } else {
          Alert.alert("Pedometer not available", "Your device does not support the Pedometer sensor.");
        }
      } catch (error) {
        setPedometerAvailability(false);
        console.error("Pedometer availability check failed:", error);
      }
    };

    subscribe();

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    const fetchData = async () => {
      try {
        if (user && user.userId) {
          const userDataRef = doc(db, "userData", user.userId);
          unsubscribe = onSnapshot(userDataRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setCarbonFootprint(userData.carbonFootprint || 0);
              setCalories(userData.calories || 0);
              setDistance(userData.distance || 0);
              setStepCount(userData.steps || 0);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    if (user && user.userId) {
      const intervalId = setInterval(async () => {
        try {
          const userDataRef = doc(db, "userData", user.userId);
          await updateDoc(userDataRef, {
            steps: stepCount,
            calories: parseFloat(calories),
            distance: parseFloat(distance),
          });
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }, 60000); // Update every 60 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [stepCount, calories, distance, user]);

  const goToInfoUser = () => {
    routing.navigate("screens/InfoUser");
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
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.userInformationSecondary,{width: wp(10),}]}>Steps</Text>
            <Image source={ICONS.steps} resizeMode="contain" style={styles.stepImage} />
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.userInformationMain}>{carbonFootprint} kg</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Image source={ICONS.carbon} resizeMode="contain" style={styles.carbonImage} />
            <Text style={[styles.userInformationSecondary,{width: wp(25)}]}>Carbon Footprint</Text>
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
          <Text style={styles.userInformationSecondary2}>
            Calories
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;