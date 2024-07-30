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
import CalculateCarbonFootprint from '@/utils/CalculateCarbonFootprint';
import TransportationModal from './modalTransportationChoice/TransportationModal';
import {decodePolyline, getDistance, calculateHeading} from '@/utils/MapUtils';
import FooterMap from './footer/FooterMap';
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
  const [isMapToucehd, setIsMapTouched] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string | null>('');
  const [transportOptions, setTransportOptions] = useState<Array<{ mode: string; duration: string; distance: string; polyline: { latitude: number; longitude: number }[] }>>([]);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(true);

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
      // const calculatedCarbonFootprint = CalculateCarbonFootprint(location.coords.speed || 0);
      // if (calculatedCarbonFootprint > 0) {
      //   setCarbonFootprint(calculatedCarbonFootprint);
      // }
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        setCountryCode(reverseGeocode[0].isoCountryCode);
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
        pitch: 100,
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
const startRouteSimulation = (routeCoords, speed = 50) => {
  let index = 0;
  const updateInterval = 1000; // Update every second
  const distancePerUpdate = (speed * 1000) / 3600; // Speed in meters per second
  
  const intervalId = setInterval(() => {
    if (index < routeCoords.length - 1) {
      const start = routeCoords[index];
      const end = routeCoords[index + 1];
      const segmentDistance = getDistance(start, end);

      if (segmentDistance > distancePerUpdate) {
        const fraction = distancePerUpdate / segmentDistance;
        const newLatitude = start.latitude + (end.latitude - start.latitude) * fraction;
        const newLongitude = start.longitude + (end.longitude - start.longitude) * fraction;
        const newLocation = {
          coords: {
            latitude: newLatitude,
            longitude: newLongitude,
            speed: speed, // Set a fixed speed for simulation
            heading: calculateHeading(start, end),
            accuracy: 5,
            altitude: 5,
          },
          timestamp: Date.now(),
        };
        setLocation(newLocation as Location.LocationObject);
        updateInstructions(newLocation as Location.LocationObject);

        // Adjust start position closer to the end position
        routeCoords[index] = {
          latitude: newLatitude,
          longitude: newLongitude,
        };
      } else {
        index++;
      }
    } else {
      clearInterval(intervalId);
    }
  }, updateInterval); // Update location every second
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
        camera.pitch = 100;
        camera.altitude = 400;
        mapRef.current?.animateCamera(camera, { duration: 1000 });
        followingUser.current = true;
      }
    }
  };




  const getRoute = async () => {
    if (!location || !destination) return;
  
  
    const [destinationLat, destinationLng] = destination.split(',').map(Number);
  
    const origin = {
      location: {
        latLng: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
    };
  
    const destinationObj = {
      location: {
          latLng: {
            latitude: destinationLat,
            longitude: destinationLng,
          },
      },
    };
  
    const travelModes = ['DRIVE', 'WALK', 'TRANSIT', 'BICYCLE'];
    const options = [];
    const allSteps = [];
    const fieldMask = 'routes.distanceMeters,routes.duration,routes.legs,routes.polyline.encodedPolyline';
  
    for (let mode of travelModes) {
      const requestBody = {
        origin,
        destination: destinationObj,
        travelMode: mode,
        routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
        computeAlternativeRoutes: false,
        languageCode: 'en-US',
        units: 'METRIC',
      };
  
      if (mode === 'DRIVE') {
        requestBody.routingPreference = 'TRAFFIC_AWARE';
      }
  
      try {
        const response = await axios.post(
          `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_MAPS_APIKEY}`,
          requestBody,
          {
            headers: {
              'X-Goog-FieldMask': fieldMask,
            },
          }
        );
  
        const route = response.data.routes[0];
        if (route && route.legs && route.legs.length > 0) {
          const leg = route.legs[0];
          const polyline = decodePolyline(route.polyline.encodedPolyline);
          // Store the steps for the current mode
          route.legs[0].steps.forEach(step => {
            step.travelMode = mode;
            allSteps.push(step);
          });
  
          options.push({
            mode,
            duration: leg.localizedValues?.duration?.text || 'Not available',
            distance: leg.localizedValues?.distance?.text || 'Not available',
            polyline,
          });

        } else {
          options.push({
            mode,
            duration: 'Not available',
            distance: 'Not available',
            polyline: [],
          });
        }
      } catch (error) {
          options.push({
            mode,
            duration: 'Not available',
            distance: 'Not available',
            polyline: [],
          });
        }
    }
    stepsRef.current = allSteps; // Store all steps for all modes
    setTransportOptions(options);
    setModalVisible(true);
  };



// Function to update instructions based on current location
const updateInstructions = (newLocation) => {
  if (!destination || stepsRef.current.length === 0) return; // No destination set or no steps available

  console.log('Current Steps:', stepsRef.current);

  const currentStep = stepsRef.current[0];
  const currentLatLng = {
    latitude: newLocation.coords.latitude,
    longitude: newLocation.coords.longitude,
  };

  // Ensure endLocation and latLng are defined
  if (!currentStep.endLocation || !currentStep.endLocation.latLng) {
    console.error('End location or latLng is undefined');
    return;
  }

  const stepEndLatLng = {
    latitude: currentStep.endLocation.latLng.latitude,
    longitude: currentStep.endLocation.latLng.longitude,
  };

  const distanceToStepEnd = getDistance(currentLatLng, stepEndLatLng);
  setDistance(distanceToStepEnd);

  const completionThreshold = 10; // Adjusted threshold to 10 meters

  if (distanceToStepEnd <= completionThreshold) {
    stepsRef.current.shift(); // Remove completed step
    if (stepsRef.current.length === 0) {
      setInstructions({
        instructions: 'You have arrived at your destination',
        distance: 0,
        maneuver: 'straight'
      });
      return;
    }
  }

  const nextStep = stepsRef.current[0];
  const nextManeuver = stepsRef.current[1]?.navigationInstruction?.maneuver || nextStep.navigationInstruction?.maneuver || 'straight';

  const instruction = {
    instructions: nextStep.navigationInstruction?.instructions || '',
    distance: nextStep.distanceMeters,
    maneuver: nextManeuver
  };

  setInstructions(instruction);
  updateRemainingDistanceAndDuration();
};

// Function to update remaining distance and duration
const updateRemainingDistanceAndDuration = () => {
  if (!destination) return;

  let remainingDistance = 0;
  let remainingDuration = 0;

  for (let i = 0; i < stepsRef.current.length; i++) {
    remainingDistance += stepsRef.current[i].distanceMeters;
    remainingDuration += parseInt(stepsRef.current[i].staticDuration?.replace('s', '') || '0');
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



  // Function to handle zoom changes + detect if the user touches the map
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

  // Function to update route based on selected mode
  const updateRoute = (selectedMode: string) => {
    const selectedOption = transportOptions.find(option => option.mode === selectedMode);
    if (selectedOption && selectedOption.polyline) {
      const polylineCoords = selectedOption.polyline.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
  
      setRouteCoords(polylineCoords);

      if (mapRef.current) {
        mapRef.current.fitToCoordinates(polylineCoords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  };
  const startNavigation = () => {
    const selectedOption = transportOptions.find(option => option.mode === selectedMode);
    
    if (selectedOption && selectedOption.polyline && selectedOption.polyline.length > 0) {
      // Filter steps based on selected mode
      const filteredSteps = stepsRef.current.filter(step => step.travelMode === selectedMode);
      
      if (filteredSteps.length === 0) {
        console.error(`No steps found for the selected mode: ${selectedMode}`);
        return;
      }
  
      stepsRef.current = filteredSteps; // Update stepsRef to only include steps for the selected mode
      console.log('Filtered Steps:', stepsRef.current);
      startRouteSimulation(selectedOption.polyline);
      setModalVisible(false);
    } else {
      console.error('Selected option does not have a valid polyline');
    }
  };



  useEffect(() => {
    if (selectedMode) {
      console.log('Selected mode:', selectedMode);
      updateRoute(selectedMode);
    }
  }, [selectedMode, transportOptions]);



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
          pitch: 100, 
          heading: 0,
          altitude: 400, 
          zoom: REGULAR_ZOOM, // Initial zoom level
        }}
        showsBuildings={false}
        onRegionChangeComplete={handleZoomChange}
        onPress={() => setIsMapTouched(true)}
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
      {isFooterVisible && (
      <View style={styles.infoContainer}>
        <CarbonFootprintDisplay carbonFootprint={carbonFootprint} />
        <TouchableOpacity style={styles.centerButton} onPress={centerMapOnLocation}>
          <MaterialIcons name="gps-fixed" size={70} color="white" />
        </TouchableOpacity>
      </View>
      )}
      <FooterMap
        footerVisible={isFooterVisible}
        setModalVisible={setModalVisible}
        distance={totalDistance}
        duration={duration}
        arrivalTime={arrivalTime}
        setIsMapTouched={setIsMapTouched}
        isMapTouched={isMapToucehd}
        userLocation={location}
        countryCode={countryCode}
        getRoute={getRoute}
        setDestination={setDestination}
        destination={destination}
      />
      {modalVisible && (
        <TransportationModal
          setFooterVisible={setIsFooterVisible}
          setIsVisible={setModalVisible}
          options={transportOptions}
          selectedMode={selectedMode}
          onSelectedMode={(mode) => {
            setSelectedMode(mode);
            updateRoute(mode);
          }}
          onConfirm={startNavigation}
        />
      )}
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