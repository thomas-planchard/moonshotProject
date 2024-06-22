 import { StyleSheet } from 'react-native';
 
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../constants/theme";




const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#F3F4F8',
      marginTop: hp(5),
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
      width: '80%',
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: 16,
      marginBottom: 10,
    },
    logoutButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
  
export default styles;