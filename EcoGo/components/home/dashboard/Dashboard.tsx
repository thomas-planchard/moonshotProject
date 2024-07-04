import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Pedometer } from "expo-sensors";
import styles from "./dashboard.style";
import { icons } from "../../../constants";
import { doc, onSnapshot} from  'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import { useRouter } from "expo-router";
import { ProfilImage } from "@/components/common/ProfilImage";
import { useAuth } from "@/context/authContext";

const Dashboard = () => {
  const routing = useRouter();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPedometerAvailable, setPedometerAvailability] = useState(false);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [stepCount, setStepCount] = useState(0);


  // Assuming an average stride length (in meters). Consider allowing the user to input their stride length.
  const strideLength = 0.78; // meters
  const userWeight = 70; // kg, consider allowing the user to input their weight
  
  // Distance covered in kilometers
  const distanceCovered = ((stepCount * strideLength) / 1000).toFixed(2);
  
  // MET value for walking
  const metValue = 3.5;
  
  // Duration in hours (assuming a constant step rate)
  const durationInHours = stepCount / (5000); // assuming 5000 steps/hour
  
  // Calories burnt calculation
  const caloriesBurnt = ((metValue * userWeight * durationInHours)).toFixed(2);

  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      try {
        const result = await Pedometer.isAvailableAsync();
        setPedometerAvailability(result);
        if (result) {
          subscription = Pedometer.watchStepCount((result) => {
            setStepCount(result.steps);
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
    const fetchCarbonFootprint = async () => {
      try {
        if (user && user.userId) {
          const userDataRef = doc(db, "userData", user.userId);
          unsubscribe = onSnapshot(userDataRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setCarbonFootprint(userData.carbonFootprint || 0);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching carbon footprint:", error);
      }
    };

    fetchCarbonFootprint();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);
  
  const goToInfoUser = () => {
    routing.navigate("screens/infoUser");
  };

  



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeMessage}>Hello,</Text>
          {user?.username ? (
            <Text style={styles.userName}>{user?.username}!</Text>
          ) : (
            <Text>Chargement...</Text>
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
          <Text style={styles.userInformationSecondary}>
            <Image source={icons.steps} resizeMode="contain" style={styles.stepImage} />
            Steps
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>{carbonFootprint}</Text>
          <Text style={styles.userInformationSecondary}>
            <Image source={icons.carbon} resizeMode="contain" style={styles.carbonImage} />
            Carbon Footprint
          </Text>
        </View>
      </View>
      <View style={styles.infoContainerLarge}>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>12.19</Text>
          <Text style={styles.userInformationSecondary2}>Coins</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>{distanceCovered} KM</Text>
          <Text style={styles.userInformationSecondary2}>Distance</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.userInformationMain2}>{caloriesBurnt}</Text>
          <Text style={styles.userInformationSecondary2}>
            <Image source={icons.calories} resizeMode="contain" style={styles.caloriesImage} />
            Calories
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;