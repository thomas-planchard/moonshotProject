import {
  View,
  Text,
  Image,
} from "react-native";

import styles from "./nameandprofile.style"


export default function NameAndProfile()  {

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


