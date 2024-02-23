import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  whiteBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.xLarge,
    borderTopRightRadius: SIZES.xLarge,
    top: -SIZES.xLarge,
  },
  container:{
    height: "100%",
  }
    
});

export default styles;
