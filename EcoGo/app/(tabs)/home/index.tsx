import { SafeAreaView, ScrollView, View, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  Activities,
  GoodDeals,
  Welcome,
} from "../../../components";
import styles from "../../../components/common/whitebackground/whitebackground.style";
import { COLORS } from "@/constants";




export default function Home() {
  return (
    
    <View style={{backgroundColor:COLORS.blueGreen}}>
      <ScrollView showsVerticalScrollIndicator={false} style={{height: hp(100) }}>
          <Welcome/>
          <View style = {styles.whiteBackground}>
          <Activities />
          <GoodDeals />
          </View>
      </ScrollView>
    </View>
  );
};
