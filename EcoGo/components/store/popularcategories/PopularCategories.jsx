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

import styles from "./popularcategories.style"


const PopularCategories = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Categories</Text>
        
    </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card}>
           <Image style={styles.card} source={require('../../../assets/images/restaurant.jpeg')}></Image>
           <Text style={styles.categoryName}>Restaurant</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
           <Image style={styles.card} source={require('../../../assets/images/clothe.jpeg')}></Image>
           <Text style={styles.categoryName}>Clothes</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
           <Image style={styles.card} source={require('../../../assets/images/travel.jpeg')}></Image>
           <Text style={styles.categoryName}>Trip</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
           <Image style={styles.card} source={require('../../../assets/images/beauty.jpeg')}></Image>
           <Text style={styles.categoryName}>Beauty</Text> 
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PopularCategories;
