import { StyleSheet } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  whiteBackground: {
   backgroundColor: COLORS.greenWhite,
    borderTopLeftRadius: SIZES.xLarge,
    borderTopRightRadius: SIZES.xLarge,
    width: wp(100), 
    height: hp(67), 
  }
    
});

export default styles;
