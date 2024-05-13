import {
  View,
  Text,
  Image,
} from "react-native";
import { useAuth } from "@/context/authContext";

import styles from "./nameandprofile.style"



export default function NameAndProfile()  {
  const {user} = useAuth();

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {user?.username ? <Text style={styles.userName}>{user?.username}!</Text> : <Text>Chargement...</Text>}
            {user?.profileImageUrl ? <Image source={{uri: user?.profileImageUrl}} style={styles.profileImage} /> : <Text>Chargement...</Text>}
        </View>
    </View>
  );
};


