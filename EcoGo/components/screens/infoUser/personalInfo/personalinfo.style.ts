import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS, SIZES } from "@/constants/theme";


const styles = StyleSheet.create({

    infoContainer: {
      width: wp(90),
      marginBottom: hp(1),
      paddingTop: hp(2),
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    editButton: {
      color: COLORS.greenForest,
      fontSize: 16,
    },

  });

  
export default styles;