import {StyleSheet, Dimensions} from 'react-native';

import { COLORS, FONT, SIZES } from "../../../constants";

export default StyleSheet.create({
      container: {
        marginTop: SIZES.xLarge,
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
        height: 100,
        
        
      },
      card: {
        width: 80,
        height: 80,
        marginRight: SIZES.medium,
        borderRadius: 50,
      },
     
      categoryName: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.gray,
        textAlign: "center",
      },
    
});