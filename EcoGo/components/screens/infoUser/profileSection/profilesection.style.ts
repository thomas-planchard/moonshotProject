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

    cameraIcon: { 
        backgroundColor: COLORS.lightWhite, 
        borderRadius: 24, 
        position: 'absolute', 
        right: wp(1), 
        bottom: hp(1), 
        padding: 8 
    },

    username: {
        fontSize: SIZES.xLarge,
        fontWeight: 'bold',
        marginBottom:  hp(1),
        marginTop: hp(3),
    },

    modalContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },

    progressContainer:{ 
      backgroundColor: 'white', 
      padding: 20, 
      borderRadius: 10 
    },
  });

  
export default styles;