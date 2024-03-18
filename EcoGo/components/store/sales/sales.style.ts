import {StyleSheet, Dimensions} from 'react-native';

import { COLORS, SIZES } from "../../../constants";

export default StyleSheet.create({
    container: {
        marginTop: SIZES.xLarge,
        height: 300,
      },
      headerTitle: {
        marginLeft: SIZES.medium,
        fontSize: SIZES.xLarge,
        fontFamily: "Montserrat-Bold",
        color: COLORS.primary,
      },
      cardsContainer: {
        marginTop: SIZES.medium,
        flexDirection: "row",
        marginLeft: SIZES.medium,
        
        
      },
      card: {
        width: 160,
        height: 220,
        marginRight: SIZES.medium,
        borderRadius: 10,
      },
     
   
});