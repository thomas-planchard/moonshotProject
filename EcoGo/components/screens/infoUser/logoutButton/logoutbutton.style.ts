import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "@/constants/theme";


const styles = StyleSheet.create({

    logoutButton: {
      width: wp(50),
      paddingVertical: hp(1.5),
      backgroundColor: COLORS.greenForest,
      borderRadius: 20,
      marginLeft: wp(20),
      marginBottom: hp(5),
    },
    textInLogoutButton: {
      color: COLORS.lightWhite, 
      textAlign: 'center',
      fontSize: 15,
      fontWeight: 'bold',

    },
  });

  
export default styles;