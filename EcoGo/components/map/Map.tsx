import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from '@env';
import  decode  from '@/utils/decodePolyline';
import CarbonFootprintDisplay from './CarbonFootprintDisplay';
import DestinationModal from './DestinationModal';
import { styles, customMapStyle } from './map.style';
import { COLORS } from '@/constants';

const MAX_ZOOM_OUT = 8; // Maximum zoom out level
const REGULAR_ZOOM = 19.5; // Regular zoom level

const Map: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [carbonFootprint, setCarbonFootprint] = useState<number>(150);
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
      setSpeed(location.coords.speed || 0);
      const calculatedCarbonFootprint = calculateCarbonFootprint(location.coords.speed || 0);
      if (calculatedCarbonFootprint > 0) {
        setCarbonFootprint(calculatedCarbonFootprint);
      }
    })();
  }, []);

  const centerMapOnLocation = async () => {
    if (location && mapRef.current) {
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
    }
  };

  const getRoute = async () => {
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

  const calculateCarbonFootprint = (speed: number): number => {
    const baseEmissions = 0.2; // kg CO2 per km
    return baseEmissions * speed; // assuming speed in km/h for a 1-hour trip
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
        {carbonFootprint > 0 && (
          <CarbonFootprintDisplay carbonFootprint={carbonFootprint} />
        )}
         {modalVisible && (
        <DestinationModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          destination={destination}
          setDestination={setDestination}
          getRoute={getRoute}
        />
      )}
      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
        <MaterialIcons name="gps-fixed" size={34} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Map;