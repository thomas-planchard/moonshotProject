import { ScrollView, View } from "react-native";

import {
  Activities,
  GoodDeals,
  Welcome,
  whitebackground,
} from "../../components/home/index";




const HomePage = () => {
  return (
    
    <View>
      <ScrollView showsVerticalScrollIndicator={false} style = {whitebackground.container}>
          <Welcome/>
          <View style = {whitebackground.whiteBackground}>
          <Activities />
          <GoodDeals />
          </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;