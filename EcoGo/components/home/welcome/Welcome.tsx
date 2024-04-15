import { useState, useEffect, SetStateAction } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import {Pedometer} from 'expo-sensors';

import styles from "./welcome.style";
import { icons } from "../../../constants";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";





const Welcome = () => {

  const routing = useRouter();

  const goToinfoUser = () => {
    routing.navigate("screens/infoUser");
  }

  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, 'users', user.uid); // Users collection
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().username); // Get the username from the user document
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const [PedomaterAvailability, SetPedomaterAvailability] = useState("");

  const [StepCount, SetStepCount] = useState(0);
  var Dist = StepCount / 1400;
  var DistanceCovered = Dist.toFixed(2);
  var cal = StepCount / 25;
  var caloriesBurnt = cal.toFixed(2);
 
  useEffect(() => {
    subscribe();
  }, []);
 
  const subscribe = () => {
    const subscription = Pedometer.watchStepCount((result) => {
      SetStepCount(result.steps);
    });
    Pedometer.isAvailableAsync().then(
      (result: any) => {
        SetPedomaterAvailability(String(result));
      },
      (error: SetStateAction<string>) => {
       SetPedomaterAvailability(error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeMessage}>Hello,</Text>
          {username ? <Text style={styles.userName}>{username}!</Text> : <Text>Chargement...</Text>}
        </View>
        <TouchableOpacity onPress={goToinfoUser}>
          <Image source={require("../../../assets/images/avatar.png")} resizeMode='cover' style={styles.profil} />
        </TouchableOpacity>
    </View>
      <View style={styles.containerStepCarbon}>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>{StepCount}</Text>
          <Text style={styles.userInformationSecondary}><Image source={icons.steps} resizeMode='contain' style={styles.stepImage}/>Steps</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>952 LBS</Text>
          <Text style={styles.userInformationSecondary}><Image source={icons.carbon} resizeMode='contain' style={styles.carbonImage}/>Carbon Footprint</Text>
        </View>
        </View>
        <View style={styles.infoContainerLarge}>
          <View style= {styles.column}>
            <Text style={styles.userInformationMain2}>12.19</Text>
            <Text style={styles.userInformationSecondary2}>Coins</Text>
          </View>
          <View style= {styles.column}>
            <Text style={styles.userInformationMain2}>{DistanceCovered} KM</Text>
            <Text style={styles.userInformationSecondary2}>Distance</Text>
          </View>
          <View style= {styles.column}>
            <Text style={styles.userInformationMain2}>{caloriesBurnt}</Text>
            <Text style={styles.userInformationSecondary2}><Image source={icons.calories} resizeMode='contain' style={styles.caloriesImage}/>Calories</Text>
          </View>
        </View>
      </View>
    
  );
};

export default Welcome;
