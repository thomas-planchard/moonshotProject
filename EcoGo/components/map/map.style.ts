import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SIZES, COLORS } from "../../constants";
import { Button } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: hp(100),
      width: wp(100),
    },

    containerLoading: {
      backgroundColor: 'white',
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
      top:hp(65),
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: wp(40),
    }
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
  