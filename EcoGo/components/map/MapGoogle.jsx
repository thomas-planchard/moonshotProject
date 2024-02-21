import React, { Component } from 'react'; 
import { Platform, StyleSheet, Text, View } from 'react-native'; 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import { Marker } from 'react-native-maps';
import styles from './mapgoogle.style';
export default class MapGoogle extends React.Component { 
    render() { 
        
    return ( 
    <MapView 
    style={styles.container} 
    provider={PROVIDER_GOOGLE} 
    showsUserLocation 
    initialRegion={{ 
        latitude: 37.78825, 
        longitude: -122.4324, 
        latitudeDelta: 0.0922, 
        longitudeDelta: 0.0421}}>

<Marker
  coordinate={{latitude: 37.78825, longitude: -122.4324}}
/>
    
    </MapView>
         ); 
    } 
}