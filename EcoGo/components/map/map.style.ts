import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { FONT, SIZES, COLORS } from "../../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: hp(100),
      width: wp(100),
    },
    containerLoading: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: hp(100),
      width: wp(100),
      },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    markerImage: {
      width: wp(10),
      height: hp(10),
      resizeMode: 'contain',
    },
    centerButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      borderRadius: 47.5, 
      justifyContent: 'center',
      alignItems: 'center',
      width: 95,
      height: 95,
    },
    infoContainer: {
      flexDirection: "row",
      top:hp(66),
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: wp(40),
    },

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
        padding: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'gray',
        },
        modeButtonSelected: {
        padding: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'lightblue',
        },
        modeButtonText: {
        fontSize: 9,
        },
    
        instructionContainer : {
            position: 'absolute',
            top: hp(10),
            left: wp(5),
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with light opacity
            borderRadius: 25,
            padding: 10,
            height: hp(15),
            width: wp(35),
            },
        instructionsText: {
            fontSize: 16,
            color: '#fff',
        },

        carbonFootprintContainer: {
            alignItems: 'center',
            top: hp(2.5),
          },
          carbonFootprintTextContainer: {
            bottom: hp(7), 
            left: wp(5),
            transform: [{ translateX: -20 }, { translateY: -10 }],
            alignItems: 'center',
          },
          carbonFootprintText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          },
          carbonFootprintText2: {
            fontSize: 12,
            fontWeight: 'bold',
            color: 'white',
          },
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
          footerContainer:{
            width: wp(100),
            height: hp(20),
            backgroundColor: COLORS.greenWhite,
            top: hp(64),
            borderRadius: 25,
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



const customMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
    { featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{ color: "#dcd2be" }] },
    { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e90" }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#93817c" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#a5b076" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#447530" }] },
    { featureType: "poi.business", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "poi.medical", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "poi.place_of_worship", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "poi.sports_complex", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "poi.government", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "poi.school", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f1e6" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fdfcf8" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8c967" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9bc62" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#e98d58" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#db8555" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#806b63" }] },
    { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "transit.line", elementType: "labels.text.fill", stylers: [{ color: "#8f7d77" }] },
    { featureType: "transit.line", elementType: "labels.text.stroke", stylers: [{ color: "#ebe3cd" }] },
    { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] }
  ];

export {styles ,customMapStyle};
  