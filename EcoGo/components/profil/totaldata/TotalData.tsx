import {
  View,
  Text
} from "react-native";
import styles from "./totaldata.style"



export default function TotalData () {

  return (
    <View style={styles.mainContainer}>
    <View style={styles.container}>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>2.33M</Text>
        <Text style={styles.userInformationSecondary}>Steps</Text>
      </View>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>222LBS</Text>
        <Text style={styles.userInformationSecondary}>Carbon Footprint</Text>
      </View>
      <View style= {styles.column}>
        <Text style={styles.userInformationMain}>1.9K</Text>
        <Text style={styles.userInformationSecondary}>Coins</Text>
      </View>
    </View>
    </View>
  );
};

