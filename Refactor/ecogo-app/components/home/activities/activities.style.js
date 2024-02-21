import { StyleSheet } from "react-native";

import { FONT, SIZES, COLORS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: SIZES.medium,
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    flexDirection: "row",
    marginLeft: SIZES.medium,
    
  },
  card: {
    width: 120,
    height: 110,
    marginRight: SIZES.medium,
    borderRadius: SIZES.large,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: COLORS.gray2,
    justifyContent: "center",
    alignItems: "left",

  },
  icons:{
    width: 25,
    height: 25,
    marginLeft: SIZES.medium,
    resizeMode: 'stretch',
  },
  activityName: {
    fontSize: SIZES.small,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginLeft: SIZES.medium,
  },
  activityTime: {
    marginTop: SIZES.small,
    marginLeft: SIZES.medium,
    fontWeight: "bold",
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
  },
});

export default styles;
