import { StyleSheet, Dimensions } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const height = Dimensions.get("window").height * 0.4;
const width = Dimensions.get("window").width * 0.9;

export default StyleSheet.create({

    tailleh20 :{
        height:"20%",
        backgroundColor:"#5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
        borderRadius: 10,
    },
    tailleh30 :{
        height:"30%",
        backgroundColor:"(180deg, #5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
        borderRadius: 10,
    },
    tailleh50 :{
        height:"50%",
        backgroundColor:"(180deg, #5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
        borderRadius: 10,
    },
    tailleh60 :{
        height :"60%",
        backgroundColor:"(180deg, #5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
        borderRadius: 10,
    },
    tailleh80 :{
        height:"80%",
        backgroundColor:"(180deg, #5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
        borderRadius: 10,
    },
    column: {
        width: "10%", 
       
    },
    graphique:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: SIZES.large,
 

    },
    text: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
    },
    text2: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.gray2,
    },
    days: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        textAlign: "center", 
    },
  
    container: {    
        flex : 1,
        width,
        height,
        marginTop: SIZES.xLarge,
        marginLeft: SIZES.medium,
    },
    
});