import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../../constants";

export default StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    profileImage: {
        width: wp(16),
        height: hp(8),
        marginRight : SIZES.medium,
        marginBottom: SIZES.medium,
        borderRadius: 100,
    },
    userName: {
        fontFamily: "Montserrat-Bold",
        fontSize: 30,
        marginLeft:SIZES.medium,
    },
    welcomeMessage: {
        fontFamily: "Montserrat-Bold",
        fontSize: SIZES.medium,
        color: COLORS.gray2,
        marginLeft:SIZES.medium,
        marginTop:SIZES.xLarge,
    },
    editImage: {
        width: 20,
        height: 20,
        marginRight : SIZES.small,
    },
    edit: {
        fontFamily: "Montserrat-Bold",
        fontSize: SIZES.small,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      marginRight: SIZES.medium,
      alignItems: "center",
  },
});