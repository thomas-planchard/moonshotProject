import { StyleSheet, Dimensions } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const height = Dimensions.get("window").height*0.40;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex : 1,
    height,
    width,
  },

  welcomeMessage: {
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.medium,
    color: COLORS.gray2,
    marginLeft:SIZES.medium,
    marginTop:SIZES.xSmall,
  },
  userName: {
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.xLarge,
    color: COLORS.white,
    marginLeft:SIZES.medium,
  },
  stepImage: {
    width: SIZES.small,
    display: "flex",
    height: SIZES.small,
    
  },
  carbonImage: {
    width: SIZES.medium,
    display: "flex",
    height: SIZES.medium,
    
  },
  caloriesImage: {
    width: SIZES.small,
    display: "flex",
    height: SIZES.small,
  },

  containerStepCarbon: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SIZES.medium,
  },

  imageBackground: {
    position: 'absolute',
    top: 0,
    width,
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
