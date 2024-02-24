import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import styles from "./sales.style"


export default function Sales(){

  return (
    <View style={styles.container}>
    <View>
      <Text style={styles.headerTitle}>Super Coin Savers</Text>
  </View>
    <ScrollView showsHorizontalScrollIndicator={false}   horizontal style={styles.cardsContainer}>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/sale1.jpg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/sale2.jpg')}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
         <Image style={styles.card} source={require('../../../assets/images/sale3.jpg')}></Image>
      </TouchableOpacity>
    </ScrollView>
  </View>
  );
};


