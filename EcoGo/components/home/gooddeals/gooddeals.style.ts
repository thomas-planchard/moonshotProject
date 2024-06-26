import { StyleSheet, Dimensions } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const width = Dimensions.get("window").width*0.92;
const height = Dimensions.get("window").height*0.10;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: "Montserrat-Bold",
    color: COLORS.primary,
    marginLeft: SIZES.medium,
  },

  imageDeals: { 
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: width,
    height: height,
    borderRadius: SIZES.small,
    resizeMode: 'stretch',
    marginLeft: SIZES.medium,
  },

  cardsContainer: {
    marginTop: SIZES.medium,
    gap: SIZES.small,
  },

  
});

export default styles;
