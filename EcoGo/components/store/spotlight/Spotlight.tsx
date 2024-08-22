import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import styles from "./spotlight.style"


export default function Spotlight() {

  return (
    <View style={styles.container}>
    <View>
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


