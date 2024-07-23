import { View } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { MapScreen } from "../../components";






export default function Gps(){
    return (
        <View style={{height: hp(100)}} >
            <MapScreen />
        </View>

    );
};



