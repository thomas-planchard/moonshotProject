 import { StyleSheet } from 'react-native';
 
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { COLORS, SIZES } from "../../constants/theme";




const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F3F4F8',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: wp(90),
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginTop: 20,
      marginBottom: 20,
    },
    infoContainer: {
      width: '80%',
      marginBottom: 20,
    },
    infoLabel: {
      fontSize: 16,
      marginBottom: 10,
    },
    logoutButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  });
  
export default styles;