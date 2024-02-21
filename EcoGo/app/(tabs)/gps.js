import { SafeAreaView, ScrollView, View, ActivityIndicator, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MapGoogle } from "../../components";



import {
    Footer,
  } from "../../components";


const Gps = () => {
    return (
        <SafeAreaView>
            <ScrollView >
                <MapGoogle />
            </ScrollView>
            <Footer />
        </SafeAreaView>


    );
};
    
    export default Gps;