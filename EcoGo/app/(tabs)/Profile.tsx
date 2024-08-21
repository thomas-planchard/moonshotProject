import { SafeAreaView, ScrollView } from "react-native";
import {
  NameAndProfile,
  TotalData,
  Graphique,
} from "../../components";
import React from "react";





export default function Profile() {
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%"}} showsVerticalScrollIndicator={false}>
      <NameAndProfile />
      <TotalData />
      <Graphique />
      </ScrollView>
    </SafeAreaView>
  );
};

