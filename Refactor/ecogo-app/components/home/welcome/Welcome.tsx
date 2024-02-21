import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
} from "react-native";
import {Pedometer} from 'expo-sensors';
import styles from "./welcome.style";
import { icons } from "../../../constant/index";





const Welcome = () => {

  const [PedomaterAvailability, SetPedomaterAvailability] = useState("");

  const [StepCount, SetStepCount] = useState(0);
  var Dist = StepCount / 1400;
  var DistanceCovered = Dist.toFixed(2);
  var cal = StepCount / 25;
  var caloriesBurnt = cal.toFixed(2);
 
  useEffect(() => {
    subscribe();
  }, []);
 
  const subscribe = () => {
    const subscription = Pedometer.watchStepCount((result) => {
      SetStepCount(result.steps);
    });
    Pedometer.isAvailableAsync().then(
      (result) => {
        SetPedomaterAvailability(String(result));
      },
      (error) => {
       SetPedomaterAvailability(error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Image  source={require('../../../assets/images/bg.png')} style={styles.imageBackground}></Image>
      <View>
        <Text style={styles.welcomeMessage}>Hello,</Text>
        <Text style={styles.userName}>Planchard Thomas</Text>
      </View>
      <View style={styles.containerStepCarbon}>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>{StepCount}</Text>
          <Text style={styles.userInformationSecondary}><Image source={icons.steps} resizeMode='contain' style={styles.stepImage}/>Steps</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>952 LBS</Text>
          <Text style={styles.userInformationSecondary}><Image style={styles.carbonImage} source={icons.carbon} resizeMode='contain'/>Carbon Footprint</Text>
        </View>
        </View>
        <View style={styles.infoContainerLarge}>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>12.19</Text>
          <Text style={styles.userInformationSecondary2}>Coins</Text>
          </View>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>{DistanceCovered} KM</Text>
          <Text style={styles.userInformationSecondary2}>Distance</Text>
          </View>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>{caloriesBurnt}</Text>
          <Text style={styles.userInformationSecondary2}><Image source={icons.calories} resizeMode='contain' style={styles.caloriesImage}/>Calories</Text>
          </View>
        </View>
      </View>
    
  );
};

export default Welcome;
