import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '@/constants/theme'; // Update the path as necessary

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: COLORS.greenWhite,
    borderRadius: 10,
   
  },

  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  inputContainer: {
    height: hp(7),
  },

  selectText: {
    fontSize: hp(2),
    color: 'grey'
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
    backgroundColor: COLORS.greenWhite,
    borderRadius: 10,
    margin: 20,
    padding: 20,
  
  },

  buttonContainer: {
    marginTop: 20,
     alignItems: "center" 
  },

  textInput: {
    fontSize: hp(2)
  },


  saveButton: {
    backgroundColor: COLORS.greenForest,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: wp(40)
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  cancelButton: {
    backgroundColor: COLORS.lightWhite,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: wp(40)
  },
  cancelButtonText: {
    color: 'black',
    fontSize: SIZES.medium,
  },
});