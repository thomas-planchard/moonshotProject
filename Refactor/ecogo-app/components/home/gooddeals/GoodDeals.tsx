import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";

import styles from "./gooddeals.style";




const GoodDeals = () => {

  function handleNavigate(website) {
    Linking.openURL(website);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good deals in your area</Text>
      </View>

      <View style={styles.cardsContainer}>
          <TouchableOpacity
            onPress={() => handleNavigate("https://blablacardaily.com/")}>
            <Image source={require('../../../assets/images/blablacar.png')} style={styles.imageDeals}></Image></TouchableOpacity>
            <TouchableOpacity
            onPress={() => handleNavigate("https://www.sncf-connect.com/")}>
            <Image source={require('../../../assets/images/sncflogo.png')} style={styles.imageDeals}></Image>
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoodDeals;