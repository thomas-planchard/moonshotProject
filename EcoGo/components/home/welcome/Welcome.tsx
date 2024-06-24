import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Pedometer } from "expo-sensors";
import styles from "./welcome.style";
import { icons } from "../../../constants";
import { useRouter } from "expo-router";
import { ProfilImage } from "@/components/common/profilImage/profilImage";
import { useAuth } from "@/context/authContext";

const Welcome = () => {
  const routing = useRouter();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPedometerAvailable, setPedometerAvailability] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const distanceCovered = (stepCount / 1400).toFixed(2);
  const caloriesBurnt = (stepCount / 25).toFixed(2);

  useEffect(() => {
    let subscription: { remove: any; };
    const subscribe = async () => {
      subscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });
      try {
        const result = await Pedometer.isAvailableAsync();
        setPedometerAvailability(result);
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
          <Text style={styles.userInformationMain}>952 LBS</Text>
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

export default Welcome;