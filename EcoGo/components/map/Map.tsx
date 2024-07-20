import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { styles, customMapStyle } from './map.style';
import LoadingMap from '../common/LoadingMap';
import CarbonFootprintDisplay from './CarbonFootprintDisplay';
import decodePolyline from '@/utils/decodePolyline';
import FooterMap from './FooterMap';
import DestinationModal from './DestinationModal';
import Instructions from './instructions/Instructions';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const MAX_ZOOM_OUT = 8; // Maximum zoom out level
const REGULAR_ZOOM = 18.5; // Regular zoom level

const Map: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>('');
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [totalDistance, setTotalDistance] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('TRAVEL_MODE_UNSPECIFIED');
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [instructions, setInstructions] = useState<object | null>(null);
  const mapRef = useRef<MapView>(null);
  const stepsRef = useRef<any[]>([]);
  const followingUser = useRef(true);



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

  useEffect(() => {
    if (location && followingUser.current && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: REGULAR_ZOOM,
        heading: 0,
        pitch: 65,
        altitude: 400,
      }, { duration: 1000 });
    }
  }, [location]);

  const startRouteSimulation = (routeCoords) => {
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < routeCoords.length) {
        const newLocation = {
          coords: {
            latitude: routeCoords[index].latitude,
            longitude: routeCoords[index].longitude,
            speed: 5, // Set a fixed speed for simulation
            heading: 0,
            accuracy: 5,
            altitude: 5,
          },
          timestamp: Date.now(),
        };
        setLocation(newLocation as Location.LocationObject);
        updateInstructions(newLocation as Location.LocationObject);
        index++;
      } else {
        clearInterval(intervalId);
        Alert.alert('Navigation', 'You have arrived at your destination');
      }
    }, 10000); // Change location every 3 seconds
  };


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
        followingUser.current = true;
      }
    }
  };

  const getRoute = async () => {
    if (!location) return;
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${selectedMode}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const points = response.data.routes[0].overview_polyline.points;
      const coords = decodePolyline(points);
      setRouteCoords(coords);
      setModalVisible(false);

      // Fit the map to the route coordinates
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }

      // Fetch distance, duration, and arrival time
      const route = response.data.routes[0].legs[0];
      setTotalDistance(route.distance.text);

      // Format duration to "**h**" format
      const durationInSeconds = route.duration.value;
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const formattedDuration = `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
      setDuration(formattedDuration);

      const arrivalTime = new Date(Date.now() + durationInSeconds * 1000);
      setArrivalTime(arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Set navigation steps
      stepsRef.current = route.steps;
      console.log('Steps:', route.steps);
      startRouteSimulation(coords);
      updateInstructions(location);
    } catch (error) {
      console.error('Error fetching route:', error);
      Alert.alert('Error', 'Failed to fetch route');
    }
  };


const updateInstructions = (newLocation) => {
  if (stepsRef.current.length === 0) {
    setInstructions('You have arrived at your destination');
    return;
  }

  const currentStep = stepsRef.current[0];
  console.log('Current step:', currentStep);
  const currentLatLng = {
    latitude: newLocation.coords.latitude,
    longitude: newLocation.coords.longitude,
  };

  const stepEndLatLng = {
    latitude: currentStep.end_location.lat,
    longitude: currentStep.end_location.lng,
  };

  const distanceToStepEnd = getDistance(currentLatLng, stepEndLatLng);
  setDistance(distanceToStepEnd);
  console.log('Distance to step end:', distanceToStepEnd);

  // Consider adjusting the threshold if GPS accuracy is an issue
  const completionThreshold = 25; // Adjusted threshold to 10 meters

  if (distanceToStepEnd <= completionThreshold) {
    console.log('Step completed. Remaining steps:', stepsRef.current.length - 1);
    stepsRef.current.shift(); // Remove completed step

    if (stepsRef.current.length === 0) {
      setInstructions('You have arrived at your destination');
    } else {
      const nextStep = stepsRef.current[0];
      setInstructions(nextStep);
    }
  } else {
    setInstructions(currentStep);
  }
};
  
  const getDistance = (point1: { latitude: number, longitude: number }, point2: { latitude: number, longitude: number }) => {
    const rad = (x: number) => x * Math.PI / 180;
    const R = 6378137; // Earth’s mean radius in meters
    const dLat = rad(point2.latitude - point1.latitude);
    const dLong = rad(point2.longitude - point1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(point1.latitude)) * Math.cos(rad(point2.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // returns the distance in meter
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
        <LoadingMap size={300} />
        <Text style={{fontFamily:'bold', fontSize:hp(3)}}>Loading...</Text>
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
      <View style={styles.infoContainer}>
        <CarbonFootprintDisplay carbonFootprint={carbonFootprint} />
        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
          <MaterialIcons name="gps-fixed" size={70} color="white" />
        </TouchableOpacity>
      </View>
      <DestinationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        getRoute={getRoute}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        setDestination={setDestination}
        destination={destination}
      />
      <FooterMap
        distance={totalDistance}
        duration={duration}
        arrivalTime={arrivalTime}
        setModalVisible={setModalVisible}
      />
      {instructions && (
        <Instructions
          instructions={instructions}
          distance={distance}
        />
      )}
    </View>
  );
};

export default Map;