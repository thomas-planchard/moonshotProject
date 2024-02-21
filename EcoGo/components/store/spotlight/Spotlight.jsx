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

import styles from "./spotlight.style"


const Spotlight = () => {

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>In The Spotlight</Text>
  </View>
    <ScrollView showsHorizontalScrollIndicator={false}   horizontal style={styles.cardsContainer}>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/spotlight1.jpeg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/spotlight2.png')}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/spotlight3.jpeg')}></Image>
      </TouchableOpacity>
    </ScrollView>
  </View>
  );
};

export default Spotlight;
