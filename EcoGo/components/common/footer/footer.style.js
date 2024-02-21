import { StyleSheet, Dimensions } from "react-native";


import { COLORS, SIZES } from "../../../constants";

const widthMap = Dimensions.get("window").width*0.16;
const widthColumn = Dimensions.get("window").width*0.9;
const heightMap = Dimensions.get("window").height*0.07;
const heightImage = Dimensions.get("window").height*0.09;
widthPhone = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: widthPhone,
    bottom: 0,
    height: heightImage,
  },
  mapImage: {   
    width: widthMap,
    height: heightMap,
    resizeMode: 'stretch',
    marginBottom: SIZES.medium,
    },
    icons:{
        width: widthMap/2.5,
        height: heightMap/2.5,
        resizeMode: 'stretch',
        marginBottom: SIZES.small,
        
    },
    footer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: widthColumn,
        marginLeft: SIZES.large,
        
    },

    imageBackground: {
        resizeMode: 'stretch',
        height: heightImage,
        width: "100%",
        position: 'absolute',
        },
});

export default styles;
