import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SIZES } from "@/constants/theme";


const styles = StyleSheet.create({

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: wp(90),
      paddingTop: hp(2),
    },
    title: {
      fontSize: SIZES.large,
      fontWeight: 'bold',
    },
    backText: { 
      fontSize: SIZES.large,
      textDecorationLine: 'underline'
    },
   
});
  
export default styles;