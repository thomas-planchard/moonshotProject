import { StyleSheet, Dimensions } from "react-native";

import { FONT, SIZES, COLORS } from "../../constants";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
;
const styles = StyleSheet.create({

    mapContainer: {
        height: 600,
        width: 400,
    },
    container:{
        flex: 1,
        height,
        width,
    },

});

export default styles;