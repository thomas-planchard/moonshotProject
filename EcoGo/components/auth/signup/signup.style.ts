import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
 container: {
     paddingTop: hp(7),
     paddingHorizontal: wp(5),
     height: hp(120),
     backgroundColor: 'white'
  },

  inputContainer: {
    height: hp(7),
  },

  errorMessage: { 
    color: 'red', 
    fontSize: hp(1.5), 
    marginLeft: wp(2)
}, 

  picker: {
    width: wp(60),
    height: hp(5),
    marginBottom: hp(20),
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
});

export default styles;