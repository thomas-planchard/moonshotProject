import { SafeAreaView, ScrollView, View, Image } from "react-native";

import {
  PopularCategories,
  Sales,
  Spotlight,
  Footer,
} from "../../components";





const Store = () => {
  return (
    
    <SafeAreaView>
      <ScrollView style={{height: "100%"}} showsVerticalScrollIndicator={false}>
        <PopularCategories />
        <Sales />
        <Spotlight />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default Store;