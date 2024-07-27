import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '@/constants/theme';


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      top: hp(31),
    },
    modalContent: {
      height: hp(35),
      width: wp(90),
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    iconContainer: {
      padding: 10,
      borderRadius: 8,
      marginRight: 10,
    },
    infoContainer: {
      flex: 1,
    },
    modeText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    detailText: {
      color: COLORS.gray,
    },
    indicatorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    separator: {
      height: hp(0.1),
      backgroundColor: COLORS.gray,
    },
    closeButton: {
      marginLeft: wp(25),
      marginTop: hp(2),
      width: wp(30),
      height: hp(3),
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.lightgreen,
    },
    closeButtonText: {
      fontSize: 16,
      color: COLORS.white,
    },
  });

export default styles;
  