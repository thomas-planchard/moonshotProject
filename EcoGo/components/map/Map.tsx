// Import necessary modules and components
import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { styles, customMapStyle } from './map.style';
import LoadingMap from '../common/LoadingMap';
import CarbonFootprintDisplay from './carbonFootprintContainer/CarbonFootprintDisplay';
import {decodePolyline, getDistance, calculateHeading} from '@/utils/MapUtils';
import FooterMap from './footer/FooterMap';
import DestinationModal from './selectAdressModal/DestinationModal';
import Instructions from './instructions/Instructions';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Constants for map zoom levels
const MAX_ZOOM_OUT = 8; // Maximum zoom out level
const REGULAR_ZOOM = 18.5; // Regular zoom level

const Map: React.FC = () => {
  // State variables
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

  // Refs for map and navigation steps
  const mapRef = useRef<MapView>(null);
  const stepsRef = useRef<any[]>([]);
  const followingUser = useRef(true);

  // Effect to request location permissions and watch for location changes
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

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 1000, // Update every second
        },
        (newLocation) => {
          console.log('Location updated:', newLocation.coords);
          updateLocation(newLocation);
        }
      );

      return () => {
        subscription.remove();
      };
    })();
  }, []);

  // Effect to update map camera on location change
  useEffect(() => {
    if (location && followingUser.current && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: REGULAR_ZOOM,
        heading: location.coords.heading, // Use the heading to rotate the map
        pitch: 65,
        altitude: 400,
      }, { duration: 1000 });
    }
  }, [location]);

  // Function to update location state and instructions
  const updateLocation = (newLocation: Location.LocationObject) => {
    setLocation(newLocation);
    updateInstructions(newLocation);
  };

  // Function to simulate route navigation
  const startRouteSimulation = (routeCoords) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < routeCoords.length) {
        const newLocation = {
          coords: {
            latitude: routeCoords[index].latitude,
            longitude: routeCoords[index].longitude,
            speed: 5, // Set a fixed speed for simulation
            heading: routeCoords[index + 1]
              ? calculateHeading(routeCoords[index], routeCoords[index + 1])
              : 0,
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
      }
    }, 5000); // Change location every 10 seconds
  };



  // Function to center map on current location
  const centerMapOnLocation = async () => {
    if (location && mapRef.current) {
      const camera = await mapRef.current?.getCamera();
      if (camera) {
        camera.center = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        camera.zoom = REGULAR_ZOOM;
        camera.heading = location.coords.heading;
        camera.pitch = 65;
        camera.altitude = 400;
        mapRef.current?.animateCamera(camera, { duration: 1000 });
        followingUser.current = true;
      }
    }
  };

  // Function to get route from Google Maps API
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
      console.log('Duration in seconds:', route.duration.value);
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

  // Function to update instructions based on current location
  const updateInstructions = (newLocation) => {
    if (!destination) return; // No destination set

    if (stepsRef.current.length === 0) {
      setInstructions({
        html_instructions: destination,
        distance: 0,
        maneuver: 'straight'
      });
      Alert.alert('Navigation', 'You have arrived at your destination');
      return;
    }

    const currentStep = stepsRef.current[0];
    const nextStep = stepsRef.current[1] || { html_instructions: destination, distance: currentStep.distance, maneuver: 'straight' };

    const instruction = {
      ...nextStep,
      distance: currentStep.distance
    };

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

    const completionThreshold = 25; // Adjusted threshold to 25 meters

    if (distanceToStepEnd <= completionThreshold) {
      stepsRef.current.shift(); // Remove completed step

      if (stepsRef.current.length === 0) {
        setInstructions({
          html_instructions: destination,
          distance: currentStep.distance,
          maneuver: 'straight'
        });
        Alert.alert('Navigation', 'You have arrived at your destination');

        // Set the remaining distance to 0
        setDistance(0);
      } else if (stepsRef.current.length === 1) {
        setInstructions({
          ...stepsRef.current[0],
          html_instructions: destination,
          distance: currentStep.distance,
          maneuver: 'straight'
        });
      } else {
        setInstructions({
          ...stepsRef.current[0],
          distance: currentStep.distance
        });
      }
    } else {
      setInstructions(instruction);
    }

    // Update total distance, duration, and arrival time
    updateRemainingDistanceAndDuration(newLocation);
  };

  // Function to update remaining distance and duration
  const updateRemainingDistanceAndDuration = (currentLocation) => {
    if (!destination) return;
    const finalDestination = stepsRef.current.length > 0 ? stepsRef.current[stepsRef.current.length - 1].end_location : { lat: destinationLat, lng: destinationLng };

    let remainingDistance = getDistance(
      { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
      { latitude: finalDestination.lat, longitude: finalDestination.lng }
    );

    let remainingDuration = 0;

    for (let i = 0; i < stepsRef.current.length; i++) {
      remainingDistance += stepsRef.current[i].distance.value;
      remainingDuration += stepsRef.current[i].duration.value;
    }

    // Update total distance
    setTotalDistance(`${(remainingDistance / 1000).toFixed(1)} km`);

    // Update duration in "**h**" format
    const hours = Math.floor(remainingDuration / 3600);
    const minutes = Math.floor((remainingDuration % 3600) / 60);
    const formattedDuration = `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
    setDuration(formattedDuration);

    // Update arrival time
    const arrivalTime = new Date(Date.now() + remainingDuration * 1000);
    setArrivalTime(arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };


  // Function to handle zoom changes
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

  // Function to calculate carbon footprint
  const calculateCarbonFootprint = (speed: number): number => {
    const baseEmissions = 0.2; // kg CO2 per km
    return baseEmissions * speed; // assuming speed in km/h for a 1-hour trip
  };

  // If location is not available, show loading screen
  if (!location) {
    return (
      <View style={styles.containerLoading}>
        <LoadingMap size={300} />
        <Text style={{fontFamily:'bold', fontSize:hp(3)}}>Loading...</Text>
      </View>
    );
  }

  // Main render
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
          pitch: 65, 
          heading: 0,
          altitude: 400, 
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
            strokeColor="blue" 
            strokeWidth={10} 
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