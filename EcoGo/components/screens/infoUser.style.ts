 import { StyleSheet } from 'react-native';
 
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../constants/theme";
import { Colors } from 'react-native/Libraries/NewAppScreen';




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
      width: wp(90),
      marginBottom: 20,
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(4),
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
      color: Colors.black,
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