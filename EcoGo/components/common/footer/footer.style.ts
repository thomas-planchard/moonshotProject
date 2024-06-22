import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  mapImage: {   
    width: 45,
    height: 45,
    resizeMode: 'contain',
    },
    icons:{
        width: 25,
        height: 25,
        resizeMode: 'contain',   
    },
  
    shadow:{
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});

export default styles;
