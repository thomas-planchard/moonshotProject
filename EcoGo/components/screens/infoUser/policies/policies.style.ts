import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { COLORS } from '@/constants';


const styles = StyleSheet.create({
    container: {
        marginVertical: hp(2),
    },
    header: {
        fontSize: hp(2.5),
        color: COLORS.greenForest,
        fontWeight: 'bold',
        marginBottom: hp(2),
    },
    button: {
        height: hp(7),
        flexDirection: 'row',
        paddingHorizontal: hp(2),
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        borderRadius: hp(2),
        marginTop: hp(2),
    },
    buttonText: {
        fontSize: hp(2),
        marginLeft: hp(2),
        color: '#333',
    },
});

export default styles;