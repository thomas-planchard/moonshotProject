import {
  View,
  Text
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { doc, onSnapshot} from  'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import styles from "./totaldata.style"



export default function TotalData () {

  const {user} = useAuth();
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [steps, setSteps] = useState(0);


  useEffect(() => {
    let unsubscribe;
    const fetchData = async () => {
      try {
        if (user && user.userId) {
          const userDataRef = doc(db, "userData", user.userId);
          unsubscribe = onSnapshot(userDataRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setCarbonFootprint((userData.carbonFootprint || 0).toFixed(2));
              setSteps(userData.steps || 0);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching carbon footprint:", error);
      }
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <View style={styles.mainContainer}>
    <View style={styles.container}>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>{steps}</Text>
        <Text style={styles.userInformationSecondary}>Steps</Text>
      </View>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>{carbonFootprint} kg</Text>
        <Text style={styles.userInformationSecondary}>Carbon Footprint</Text>
      </View>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>0</Text>
        <Text style={styles.userInformationSecondary}>Coins</Text>
      </View>
    </View>
    </View>
  );
};

