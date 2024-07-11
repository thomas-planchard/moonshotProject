import { SafeAreaView, ScrollView, View, Image } from "react-native";

import {
  PopularCategories,
  Sales,
  Spotlight,
} from "../../components";

import { COLORS } from "@/constants";





export default function Store(){
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%", backgroundColor: COLORS.greenWhite}} showsVerticalScrollIndicator={false}>
        <PopularCategories />
        <Sales />
        <Spotlight />
      </ScrollView>
    </SafeAreaView>
  );
};
