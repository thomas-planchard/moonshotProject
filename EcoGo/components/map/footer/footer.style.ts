import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SIZES, COLORS } from "@/constants";

const styles = StyleSheet.create({

    magnifierButton: {
        backgroundColor: COLORS.lightWhite, 
        borderRadius: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(12),
        height: hp(6),
        top: hp(3),
        left: wp(6),
        position: 'absolute',
    },

    infoContainer: {
      flexDirection: "row",
      top:hp(66),
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: wp(40),
    },
    footerContainer:{
        width: wp(100),
        height: hp(25),
        backgroundColor: COLORS.greenWhite,
        top: hp(64),
        borderRadius: 25,
        alignItems:"flex-start",
      },

      infoSection: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
      },
      infoSectionRow:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      infoArrivalTime: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
    },
    infoText: {
        fontSize: 20,
        color: 'black',
    },          
        
  });





export default styles;
  