import {StyleSheet, Dimensions} from 'react-native';

import { COLORS, FONT, SIZES } from "../../../constants";

export default StyleSheet.create({
    container: {
        marginTop: SIZES.medium,
        height: 350,
      },
      headerTitle: {
        marginLeft: SIZES.medium,
        fontSize: SIZES.xLarge,
        fontFamily: FONT.medium,
        color: COLORS.primary,
      },
      cardsContainer: {
        marginTop: SIZES.medium,
        flexDirection: "row",
        marginLeft: SIZES.medium,
        
        
      },
      card: {
        width: 200,
        height: 260,
        marginRight: SIZES.medium,
        borderRadius: 10,
        resizeMode: 'stretch',
      },
});