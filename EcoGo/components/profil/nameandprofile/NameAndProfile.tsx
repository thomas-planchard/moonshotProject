import {
  View,
  Text,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

import styles from "./nameandprofile.style"



export default function NameAndProfile()  {

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

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {username ? <Text style={styles.userName}>{username}!</Text> : <Text>Chargement...</Text>}
            <Image  source={require('../../../assets/images/avatar.png')} style={styles.profileImage}></Image>
        </View>
    </View>
  );
};


