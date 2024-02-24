import { SafeAreaView, ScrollView, View, Image } from "react-native";

import {
  PopularCategories,
  Sales,
  Spotlight,
} from "../../components";





export default function Store(){
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%"}} showsVerticalScrollIndicator={false}>
        <PopularCategories />
        <Sales />
        <Spotlight />
      </ScrollView>
    </SafeAreaView>
  );
};
