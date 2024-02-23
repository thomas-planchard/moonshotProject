import {StyleSheet, Dimensions} from 'react-native';

import { COLORS, FONT, SIZES } from "../../../constants";

const height = Dimensions.get("window").height*0.05;

export default StyleSheet.create({
    container: {
        flex: 1,
        height,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: SIZES.large,
        marginLeft: SIZES.medium,
    },
    editImage: {
        width: 20,
        height: 20,
        marginRight : SIZES.small,
    },
    follower: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
    },
    followerText: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.gray2,
    },
    edit: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
    },

    row2: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginRight: SIZES.medium,
  },
});