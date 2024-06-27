import { SafeAreaView, ScrollView, View, ActivityIndicator, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Stack, useRouter } from "expo-router";
import { MapScreen } from "../../components";






export default function Gps(){
    return (
        <SafeAreaView >
            <ScrollView style={{height: hp(100)}} >
                <MapScreen />
            </ScrollView>
        </SafeAreaView>

    );
};



