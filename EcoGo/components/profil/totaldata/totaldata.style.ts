import { StyleSheet, Dimensions } from "react-native";

import { COLORS, SIZES } from "../../../constants";
const height = Dimensions.get("window").height * 0.15;

export default StyleSheet.create({

userInformationMain: {
    marginTop: SIZES.medium,
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  userInformationSecondary: {
    marginBottom: SIZES.small,
    fontFamily: "Montserrat-Bold",
    fontSize: SIZES.small,
    color: COLORS.gray2,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: '90%',
    borderRadius: 20,
    marginLeft: SIZES.medium,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    height: "100%",
    marginTop: SIZES.medium,
  },
  mainContainer: {
    height,
    flex: 1,
    marginTop: SIZES.medium,
  },
});