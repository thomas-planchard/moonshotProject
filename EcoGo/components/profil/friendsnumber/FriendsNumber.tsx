import {
  View,
  Text,
  Image,
  TouchableOpacity,

} from "react-native";

import styles from "./friendsnumber.style"

export default function FriendsNumber () {

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.follower}>21</Text>
          <Text style={styles.followerText}>Followers</Text>
        </View>
        <View>
          <Text style={styles.follower}>456</Text>
          <Text style={styles.followerText}>Following</Text>
        </View>
        <TouchableOpacity  style={styles.row2}>
        <Image source={require('../../../assets/icons/ic_edit.png')} style={styles.editImage}></Image>
        <Text style={styles.edit}>Edit Profile</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};


