import { SafeAreaView, ScrollView, View, ActivityIndicator, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP} from 'react-native-responsive-screen';
import { MapScreen } from "../../components";






export default function Gps(){
    return (
        <View style={{height: heightPercentageToDP(100)}} >
            <MapScreen />
        </View>

    );
};



