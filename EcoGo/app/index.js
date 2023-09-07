import { useState } from "react";
import { SafeAreaView, ScrollView, View, Image } from "react-native";
import { Stack, useRouter } from "expo-router";

import { COLORS, icons, images, SIZES } from "../constants";
import {
  Activities,
  GoodDeals,
  ScreenHeaderBtn,
  Welcome,
} from "../components";
import styles from "../components/common/whitebackground/whitebackground.style";




const Home = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
          <Welcome/>
          <View style = {styles.whiteBackground}>
          <Activities />
          <GoodDeals />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;