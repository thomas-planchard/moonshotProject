import { SafeAreaView, ScrollView, View, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  Activities,
  Recommendation,
  Dashboard,
} from "../../../components";
import styles from "@/components/home/whitebackground/whitebackground.style"
import { COLORS } from "@/constants";




export default function Home() {
  return (
    
    <View style={{backgroundColor:COLORS.blueGreen}}>
      <ScrollView showsVerticalScrollIndicator={false} style={{height: hp(100) }}>
          <Dashboard/>
          <View style = {styles.whiteBackground}>
          <Activities />
          <Recommendation />
          </View>
      </ScrollView>
    </View>
  );
};
