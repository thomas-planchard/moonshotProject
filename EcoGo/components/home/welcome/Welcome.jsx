import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";

const jobTypes = ["Full-time", "Part-time", "Contractor"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState("Full-time");

  return (
    <View style={styles.container}>
      <Image  source={require('../../../assets/images/bg.png')} style={styles.imageBackground}></Image>
      <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Hello,</Text>
        <Text style={styles.userName}>Planchard Thomas</Text>
      </View>
      <View style={styles.containerStepCarbon}>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>2568</Text>
          <Text style={styles.userInformationSecondary}><Image source={icons.steps} resizeMode='contain' style={styles.stepImage}/>Steps</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.userInformationMain}>952 LBS</Text>
          <Text style={styles.userInformationSecondary}><Image source={icons.carbon} resizeMode='contain' style={styles.carbonImage}/>Carbon Footprint</Text>
        </View>
        </View>
        <View style={styles.infoContainerLarge}>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>12.19</Text>
          <Text style={styles.userInformationSecondary2}>Coins</Text>
          </View>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>2.4 KM</Text>
          <Text style={styles.userInformationSecondary2}>Distance</Text>
          </View>
          <View style= {styles.column}>
          <Text style={styles.userInformationMain2}>169</Text>
          <Text style={styles.userInformationSecondary2}><Image source={icons.calories} resizeMode='contain' style={styles.caloriesImage}/>Calories</Text>
          </View>
        </View>
      </View>
    
  );
};

export default Welcome;
