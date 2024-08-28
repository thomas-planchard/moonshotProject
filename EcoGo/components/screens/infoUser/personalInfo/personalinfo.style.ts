import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS, SIZES } from "@/constants/theme";


const styles = StyleSheet.create({

    infoContainer: {
      width: wp(90),
      marginBottom: hp(1),
      paddingTop: hp(2),
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    tittleText: {
      fontSize: hp(2.5), 
      color: COLORS.greenForest, 
      fontWeight: 'bold', 
      marginBottom: hp(2)
    },

    editButton: {
      color: COLORS.greenForest,
      fontSize: 16,
    },

    inputContainer: {
      height: hp(7)
    },

    inputStyle: {
      fontSize: hp(2)
    },

    resetPasswordText: {
      fontSize: hp(2),
       color: '#333'
      },  

  });

  
export default styles;