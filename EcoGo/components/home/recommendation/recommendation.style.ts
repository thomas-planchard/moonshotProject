import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { COLORS, SIZES } from "../../../constants";

const width = wp(92);
const height = hp(10);

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    width: wp(25),
  },
  textLogoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: "space-evenly",
    alignItems: "center",
    width: width,
    height: height,
    borderRadius: SIZES.small,
    marginLeft: SIZES.medium,
  },

  smallLogoImage: {
    width: wp(25),
    height: hp(25),
    resizeMode: 'contain',
    marginRight: wp(3),
  },
  
  logoName: {
    fontSize: hp(4),
    fontWeight: 'bold',
  },
  
});

export default styles;