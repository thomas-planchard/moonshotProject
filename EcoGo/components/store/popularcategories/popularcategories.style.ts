import {StyleSheet} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../../constants";

export default StyleSheet.create({
      container: {
        marginTop: SIZES.xLarge,
      },

      headerTitle: {
        marginLeft: SIZES.medium,
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
      },

      cardsContainer: {
        marginTop: SIZES.medium,
        flexDirection: "row",
        marginLeft: SIZES.medium,
        height: hp(12),
      },

      cardContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: wp(25),
      },

      cardImage: {
        width: wp(18),
        height: hp(9),
        borderRadius: 50,
      },

      categoryName: {
        fontSize: SIZES.small,
        color: COLORS.gray,
      },
    
});