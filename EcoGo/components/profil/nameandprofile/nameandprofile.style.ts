import {StyleSheet, Dimensions} from 'react-native';

import { COLORS, FONT, SIZES } from "../../../constants";

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
        width: 60,
        height: 60,
        marginRight : SIZES.medium,
        marginBottom: SIZES.medium,
    },
    userName: {
        fontFamily: FONT.bold,
        fontSize: 30,
        marginLeft:SIZES.medium,
    },
    welcomeMessage: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.gray2,
        marginLeft:SIZES.medium,
        marginTop:SIZES.xLarge,
    },
});