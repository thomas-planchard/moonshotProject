import { SafeAreaView, ScrollView, View, Image } from "react-native";
import { Stack, useRouter } from "expo-router";

import {
  NameAndProfile,
  Footer,
  TotalData,
  FriendsNumber,
  Graphique,
} from "../../components";





const Profile = () => {
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%"}} showsVerticalScrollIndicator={false}>
      <NameAndProfile />
      <FriendsNumber />
      <TotalData />
      <Graphique />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default Profile;