import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { SIZES, COLORS } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
    backgroundColor: '#e8f5f0'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZES.medium,
  },
  headerTitle: {
    marginLeft: SIZES.medium,
    fontSize: SIZES.large,
    fontFamily: "Montserrat-Bold",
    color: COLORS.primary,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
    flexDirection: "row",
    marginLeft: SIZES.medium,
    
  },
  card: {
    width: 120,
    height: 110,
    marginRight: SIZES.medium,
    borderRadius: SIZES.large,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: COLORS.gray2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  icons:{
    width: 25,
    height: 25,
    marginLeft: SIZES.medium,
    resizeMode: 'stretch',
  },
  activityName: {
    fontSize: SIZES.small,
    fontFamily: "Montserrat-Bold",
    color: COLORS.gray,
    marginLeft: SIZES.medium,
  },
  activityTime: {
    marginTop: SIZES.small,
    marginLeft: SIZES.medium,
    fontWeight: "bold",
    fontSize: SIZES.medium,
    fontFamily: "Montserrat-Bold",
  },

  plusButton: {
    backgroundColor: COLORS.greenForest,
    borderRadius: 20,
    padding: 10,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: COLORS.greenWhite,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
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
});

export default styles;
