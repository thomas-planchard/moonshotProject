 import { StyleSheet } from 'react-native';
 
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../constants/theme";
import { Colors } from 'react-native/Libraries/NewAppScreen';




const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: hp(7),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: wp(90),
    },
    title: {
      fontSize: SIZES.large,
      fontWeight: 'bold',
    },
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

    infoContainer: {
      width: wp(90),
      marginBottom: hp(1),
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(3),
    },

    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    editButton: {
      color: COLORS.greenForest,
      fontSize: 16,
    },

    userInfo : {
      fontSize: 16,
      color: Colors.grey,
    },

    infoLabel: {
      fontSize: 16,
      marginBottom: 10,
    },
    logoutButton: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(10),
      backgroundColor: COLORS.greenForest,
      borderRadius: 20,
      marginBottom: hp(5),
    },
    textInLogoutButton: {
      color: COLORS.lightWhite, 
      textAlign: 'center',
      fontSize: 15,
      fontWeight: 'bold',

    },

    textInTouchable: {
      fontSize: hp(2),
      color: 'grey',
    },

  });

  
export default styles;