import {StyleSheet, Dimensions} from 'react-native';

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
        width: 60,
        height: 60,
        marginRight : SIZES.medium,
        marginBottom: SIZES.medium,
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
});