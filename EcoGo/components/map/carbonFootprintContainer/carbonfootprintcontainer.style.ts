import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SIZES, COLORS } from "@/constants";

const styles = StyleSheet.create({
        carbonFootprintContainer: {
            alignItems: 'center',
            top: hp(2.5),
          },
          carbonFootprintTextContainer: {
            bottom: hp(7), 
            left: wp(5),
            transform: [{ translateX: -20 }, { translateY: -10 }],
            alignItems: 'center',
          },
          carbonFootprintText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          },
          carbonFootprintText2: {
            fontSize: 12,
            fontWeight: 'bold',
            color: 'white',
          },
  });



export default styles;
  