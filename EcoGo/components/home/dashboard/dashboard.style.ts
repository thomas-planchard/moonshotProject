import { StyleSheet, Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../../constants";




const styles = StyleSheet.create({
  container: {
    flex : 1,
    height: hp(43),
    width: wp(100),
    backgroundColor: COLORS.blueGreen,
  },


 header: {
  flexDirection: "row",
  alignItems: "center",
  padding: wp(5),
  marginTop: hp(5),
  
 },
  profil: {
    width: wp(16),
    height: hp(8),
    borderRadius: 100,

  },

  welcomeMessage: {
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.medium,
    color: COLORS.gray2,
    marginTop:SIZES.xSmall,
    
  },
  userName: {
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.xLarge,
    color: COLORS.white,
  },
  stepImage: {
    width: SIZES.small,
    display: "flex",
    height: SIZES.small,
    marginRight: SIZES.xSmall,
    
  },
  carbonImage: {
    width: SIZES.medium,
    display: "flex",
    height: SIZES.medium,
    marginRight: SIZES.xSmall,
    
  },

  containerStepCarbon: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SIZES.xSmall,
  },

  imageBackground: {
    position: 'absolute',
    top: 0,
    width: wp(100),
    resizeMode: 'stretch',
    },
  infoContainer: {
      width: '40%',
      backgroundColor: COLORS.WhiteOpacity,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },

    infoContainerLarge: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: '90%',
      backgroundColor: COLORS.WhiteOpacity,
      borderRadius: 20,
      marginLeft: SIZES.medium,
      marginTop: SIZES.xxLarge,
    },

    userInformationMain: {
      marginTop: SIZES.xLarge,
      fontFamily: "Montserrat-Bold",
      fontSize: SIZES.xxLarge,
      color: COLORS.white,
    },
    userInformationMain2: {
      marginTop: SIZES.medium,
      fontFamily: "Montserrat-Bold",
      fontSize: SIZES.medium,
      color: COLORS.white,
    },
    column: {
      flexDirection: "column",
      alignItems: "center",
    },

    userInformationSecondary: {
      marginBottom: SIZES.xLarge,
      fontFamily: "Montserrat-Bold",
      fontSize: SIZES.small,
      color: COLORS.gray2,
    },
    userInformationSecondary2: {
      marginBottom: SIZES.small,
      fontFamily: "Montserrat-Bold",
      fontSize: SIZES.small,
      color: COLORS.gray2,
    },
});

export default styles;
