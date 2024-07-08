import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Text, Image, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from '@env';
import {styles, customMapStyle} from './map.style';

const MAX_ZOOM_OUT = 8; // Maximum zoom out level
const REGULAR_ZOOM = 19.5; // Regular zoom level


const Map = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>('');
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const centerMapOnLocation = async () => {
    console.log('Center button clicked');
    if (location && mapRef.current) {
      console.log('Centering map to:', location.coords.latitude, location.coords.longitude);

      const camera = await mapRef.current?.getCamera();

      if (camera) {
        camera.center = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        camera.zoom = REGULAR_ZOOM;
        camera.heading = 0;
        camera.pitch = 65;
        camera.altitude = 400;
        mapRef.current?.animateCamera(camera, { duration: 1000 });
      }
    } else {
      console.log('Location or mapRef not available');
    }
  };

  const getRoute = async (destination: string) => {
    if (!location) return;
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const points = response.data.routes[0].overview_polyline.points;
      const coords = decode(points);
      setRouteCoords(coords);
      setModalVisible(false);
    } catch (error) {
      console.error('Error fetching route:', error);
      Alert.alert('Error', 'Failed to fetch route');
    }
  };

  const decode = (t: string) => {
    let points: Array<{ latitude: number; longitude: number }> = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const handleZoomChange = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current?.getCamera();
      if (camera) {
        if (camera.zoom < MAX_ZOOM_OUT) {
          camera.zoom = MAX_ZOOM_OUT;
          mapRef.current?.animateCamera(camera, { duration: 300 });
        }
      }
    }
  };

  if (!location) {
    return (
      <View style={styles.containerLoading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        customMapStyle={customMapStyle}
        style={styles.map}
        initialCamera={{
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          pitch: 65, // Adjust the pitch to incline the view
          heading: 0,
          altitude: 400, // Adjust the altitude to control zoom level
          zoom: REGULAR_ZOOM, // Initial zoom level
        }}
        showsBuildings={false}
        onRegionChangeComplete={handleZoomChange}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }} // Center the image on the marker
        >
          <Image source={require('@/assets/icons/basicNavigationIcon.png')} style={styles.markerImage} />
        </Marker>
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="blue" // Line color
            strokeWidth={10} // Line width
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
        <MaterialIcons name="gps-fixed" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={destination}
              onChangeText={setDestination}
            />
            <Button title="Get Route" onPress={() => getRoute(destination)} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default Map;