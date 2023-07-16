import{ useState} from 'react';
import { View, ScrollView, SafeAreaView  } from 'react-native';
import {Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from "../constants";
import { Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome} from "../components";


const Home= () => {
    const router = useRouter();
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
            <Stack.Screen
            options={{
                hearderStyle: {backgroundColor: COLORS.lightWhite},
                hearderShadowVisible: false,
                headerLeft: ({onPress}) => (
                    <ScreenHeaderBtn iconUrl = {icons.menu} dimension="60%"/>
                    ),
                headerRight: ({onPress}) => (
                    <ScreenHeaderBtn iconUrl = {images.profile} dimension="60%"/>
                    ),
                headerTitle: "Home",
    }}/>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <ScrollView style={{
                flex: 1, 
                padding: SIZES.medium}}>
                <Welcome  />
                <Popularjobs/>
                <Nearbyjobs/>
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
    );
};

export default Home;