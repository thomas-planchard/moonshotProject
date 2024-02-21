import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import styles from "./nameandprofile.style"


const NameAndProfile = () => {

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            <Text style={styles.userName}>Planchard Thomas</Text>
            <Image  source={require('../../../assets/images/avatar.png')} style={styles.profileImage}></Image>
        </View>
    </View>
  );
};

export default NameAndProfile;
