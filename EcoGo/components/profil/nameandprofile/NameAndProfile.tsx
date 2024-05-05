import {
  View,
  Text,
  Image,
} from "react-native";

import { fetchingUserNameAndProfileImage } from "@/fetchingData/fetchingUserNameAndProfileImage";
import styles from "./nameandprofile.style"



export default function NameAndProfile()  {
  const {username, profileImage} = fetchingUserNameAndProfileImage();

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {username ? <Text style={styles.userName}>{username}!</Text> : <Text>Chargement...</Text>}
            {profileImage ? <Image source={{uri: profileImage}} style={styles.profileImage} /> : <Text>Chargement...</Text>}
        </View>
    </View>
  );
};


