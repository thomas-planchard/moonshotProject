import { SafeAreaView, ScrollView, View, Image } from "react-native";

import {
  NameAndProfile,
  TotalData,
  FriendsNumber,
  Graphique,
} from "../../components";





export default function Profile() {
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%"}} showsVerticalScrollIndicator={false}>
      <NameAndProfile />
      <FriendsNumber />
      <TotalData />
      <Graphique />
      </ScrollView>
    </SafeAreaView>
  );
};

