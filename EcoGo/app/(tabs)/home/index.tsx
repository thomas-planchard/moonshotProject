import { SafeAreaView, ScrollView, View, Image } from "react-native";

import {
  Activities,
  GoodDeals,
  Welcome,
} from "../../../components";
import styles from "../../../components/common/whitebackground/whitebackground.style";




export default function Home() {
  return (
    
    <View>
      <ScrollView showsVerticalScrollIndicator={false} style = {styles.container}>
          <Welcome/>
          <View style = {styles.whiteBackground}>
          <Activities />
          <GoodDeals />
          </View>
      </ScrollView>
    </View>
  );
};
