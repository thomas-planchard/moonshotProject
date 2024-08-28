import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SIZES, COLORS } from "@/constants";

const styles = StyleSheet.create({
  magnifierButton: {
    zIndex:10,
    backgroundColor: COLORS.lightWhite, 
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(12),
    height: hp(6),
    top: hp(3),
    left: wp(8),
},
  
  footerContainer:{
    width: wp(100),
    position: 'absolute',
    backgroundColor: COLORS.greenWhite,
    bottom: 0,
    borderRadius: 25,
    alignItems:"flex-start",
  },
  infoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: hp(3),
    width: wp(100),
    position: 'relative',
  },
  infoSectionRow: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoArrivalTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  infoTextLeft: {
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
    width: wp(20),
    marginLeft: wp(5),
    
  },
  infoTextRight: {
    fontSize: 20,
    color: 'black',
    textAlign: 'right',
    width: wp(20),
    marginLeft: wp(2),
  },
  dot: {
    position: 'absolute',
  },


  searchContainer: {
    marginTop: hp(4),
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: hp(2),
    marginLeft: wp(5),
  },

  searchIcon: {
    marginRight: 10,
  },
  
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
  },

  suggestionItem: {
    padding: 20,
    flexDirection: 'row',
    width: wp(90),
    marginTop: hp(2),

  },

  suggestionIcon: {
    marginRight: 10,
    marginLeft: 10,

  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },

  customBorder: {
    height: 1, // Height of the border
    width: wp(60), // Adjust the width as per requirement
    backgroundColor: COLORS.gray,
    alignSelf: 'center', // Center the border within the suggestionItem
  },
});

export default styles;