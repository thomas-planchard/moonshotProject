import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const styles = StyleSheet.create({
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: hp(40),
        width: wp(100),
        backgroundColor: 'rgb(0, 0, 0)',
        top: hp(-35),
    },
    turnIcon: {
        marginLeft: wp(6),
        marginBottom: hp(4),
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: wp(5),
        width: wp(70),
        marginBottom: hp(4),
    },
    instructionsText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
    },
    streetNameText: {
        fontSize: 22,
        flexShrink: 1,
        fontWeight: 'bold',
        color: COLORS.lightgreen,
    },
  
});
