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

import styles from "./friendsnumber.style"

import { COLORS, SIZES } from "../../../constants";
import ActivitiesCard from "../../common/cards/activitiescard/ActivitiesCard";
import useFetch from "../../../hook/useFetch";

const FriendsNumber = () => {

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.follower}>21</Text>
          <Text style={styles.followerText}>Followers</Text>
        </View>
        <View style={styles.column}>
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

export default FriendsNumber;
