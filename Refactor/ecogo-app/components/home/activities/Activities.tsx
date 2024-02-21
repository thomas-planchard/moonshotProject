import {
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";

import styles from "./activities.style";


const Activities = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activities</Text>
    </View>
      <ScrollView showsHorizontalScrollIndicator={true} horizontal style={styles.cardsContainer}>
        <View style={styles.card}>
           <Image style={styles.icons} source={require('../../../assets/icons/car.png')}></Image>
           <Text style={styles.activityTime}>34 min</Text>
           <Text style={styles.activityName}>Car</Text> 
        </View>
        <View style={styles.card}>
           <Image style={styles.icons} source={require('../../../assets/icons/front-bus.png')}></Image>
           <Text style={styles.activityTime}>30 min</Text>
           <Text style={styles.activityName}>Bus</Text> 
        </View>
        <View style={styles.card}>
            <Image style={styles.icons} source={require('../../../assets/icons/black-plane.png')}></Image>
           <Text style={styles.activityTime}>240 min</Text>
           <Text style={styles.activityName}>Plane</Text> 
        </View>
        <View style={styles.card}>
            <Image style={styles.icons} source={require('../../../assets/icons/man-cycling.png')}></Image>
           <Text style={styles.activityTime}>12 min</Text>
           <Text style={styles.activityName}>Cycling</Text>  
        </View>
      </ScrollView>
    </View>
  );
};

export default Activities;
