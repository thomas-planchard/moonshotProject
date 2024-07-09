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
      position: 'absolute',
      bottom: hp(10), 
      right: wp(5),
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Black background with light opacity
      borderRadius: 50, 
      padding: 20,
    },
    menuButton: {
      position: 'absolute',
      top: hp(5),
      left: wp(5),
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with light opacity
      borderRadius: 25,
      padding: 10,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuButtonText: {
      fontSize: 16,
      color: '#fff',
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
      carbonContainer: {
        position: 'absolute',
        top: hp(10), 
        right: wp(5),
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with light opacity
        borderRadius: 50, 
        alignItems: 'center',
        justifyContent: 'center',
      },
      carbonText:{
        position: 'absolute',
        fontSize: 14,
        fontWeight: "bold",
        
      },
      speedometer: {
        width: wp(22),
        height: hp(10),
        resizeMode: 'contain',
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
    { featureType: "poi.government", "elementType": "labels", "stylers" :[{ "visibility": "off" }] },
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
  