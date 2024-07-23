import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SIZES, COLORS } from "@/constants";

const styles = StyleSheet.create({

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: wp(80),
      },
      
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
      },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
      },

    modeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        },
    modeButton: {
        height: hp(3),
        width: wp(12),
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modeButtonSelected: {
        height: hp(3),
        width: wp(12),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modeButtonText: {
        fontSize: 9,
    },
        
  });


export default styles;