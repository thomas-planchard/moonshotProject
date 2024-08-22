import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS, SIZES } from "@/constants/theme";


const styles = StyleSheet.create({
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,  
      borderColor: COLORS.greyGreen,
      borderWidth: 5,
    },

    username: {
      fontSize: SIZES.xLarge,
      fontWeight: 'bold',
      marginBottom:  hp(1),
      marginTop: hp(3),
    },
  });

  
export default styles;