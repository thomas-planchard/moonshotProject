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
import { updateDoc, doc, increment } from 'firebase/firestore';
import fetchUserData from '@/utils/FetchUserData';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/FirebaseConfig';


// Constants for map zoom levels
const MAX_ZOOM_OUT = 8; // Maximum zoom out level
const REGULAR_ZOOM = 18.5; // Regular zoom level

const Map = () => {

  const { user } = useAuth(); // Get the user from the AuthContext

  // State variables

  
  const [simulateTrip, setSimulateTrip] = useState<boolean>(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>('');
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [totalDistance, setTotalDistance] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('TRAVEL_MODE_UNSPECIFIED');
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [instructions, setInstructions] = useState<object | null>(null);
  const [isMapTouched, setIsMapTouched] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string | null>('');
  const [transportOptions, setTransportOptions] = useState<Array<{ mode: string; duration: string; distance: string; polyline: { latitude: number; longitude: number }[] }>>([]);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(true);
  const [totalDistanceTraveled, setTotalDistanceTraveled] = useState<number>(0);
  const previousLocation = useRef<{ latitude: number, longitude: number } | null>(null);

  //Variables to hold user data
  const [userData, setUserData] = useState<{ consumption?: number; carType?: string; carbonFootprint?: string }>({});


  
  
  // Refs 
  const mapRef = useRef<MapView>(null);
  const stepsRef = useRef<any[]>([]);
  const followingUser = useRef(true);
  const distanceTraveled = useRef(0); // Track the cumulative distance traveled
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID
  const simulateTripRef = useRef(simulateTrip); // Ref to track simulateTrip state
  

  // Effect to fetch user data from the database
  useEffect(() => {
      if (user?.userId) {
        const fetchData = async () => {
          const data = await fetchUserData(user.userId, ['consumption', 'carType', 'carbonFootprint']);
          setUserData(data || {});
        };
        fetchData();
      }
  }, [user]);


 useEffect(() => {
  (async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (reverseGeocode.length > 0) {
      setCountryCode(reverseGeocode[0].isoCountryCode);
    }
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
    if (!previousLocation.current) {
      previousLocation.current = {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
      };
    } else {
      const newPoint = {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
      };
      
      const distance = getDistance(previousLocation.current, newPoint);
      distanceTraveled.current += distance;
      setTotalDistanceTraveled(prev => prev + distance); // Update total distance traveled

      const heading = calculateHeading(previousLocation.current, newPoint);

      if (distanceTraveled.current >= 100) {
        calculateAndUpdateCarbonFootprint(selectedMode, 100);
        distanceTraveled.current -= 100; // Reset distance after calculation
      }

      previousLocation.current = newPoint; // Update the previous location
      // Update the map camera heading
      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: {
            latitude: newPoint.latitude,
            longitude: newPoint.longitude,
          },
          heading: heading, // Apply the calculated heading
          zoom: REGULAR_ZOOM,
          pitch: 100,
          altitude: 400,
        }, { duration: 1000 });
      }
    }
    setLocation(newLocation);
    updateInstructions(newLocation);
  };


  // Function to calculate and update carbon footprint
  const calculateAndUpdateCarbonFootprint = async (mode: string, distance: number) => {
    let newFootprint = 0;
    if (mode === 'DRIVE') {
      // Fetch the user's car consumption from the database
      try {
        if (user?.userId) {
          const carConsumption = userData?.consumption || undefined;
          const carType = userData?.carType;  
            // Calculate carbon footprint using car consumption
            newFootprint = CalculateCarbonFootprint(distance / 1000, carType.toLowerCase(), carConsumption);
        }
      } catch (error) {
        console.error("Error fetching car consumption data from the database:", error);
        return;
      }
    } else {
      // Calculate carbon footprint for other modes
      if (mode === "TRANSIT") {
        mode = "BUS";
      }
      else{
      newFootprint = CalculateCarbonFootprint(distance / 1000, mode.toLowerCase()); // Convert distance to kilometers
      }
    }
    setCarbonFootprint(prev => {
      const updatedFootprint = prev + newFootprint;
      updateCarbonFootprintInDB(newFootprint);
      return updatedFootprint;
    });
  };

  const updateCarbonFootprintInDB = async (newFootprint: number) => {
    if (user?.userId) {
      const userDataRef = doc(db, "userData", user.userId);
      try {
        // Update the carbon footprint in the database
        const roundedFootprint = parseFloat(newFootprint.toFixed(2));
        console.log(roundedFootprint)
        
        await updateDoc(userDataRef, {
          carbonFootprint: increment(roundedFootprint), // Store as rounded value
        });
      } catch (error) {
        console.error("Error updating carbon footprint:", error);
      }
    }
  };


    // Function to stop the simulation
    const stopSimulation = () => {
      setSimulateTrip(false);
      simulateTripRef.current = false; // Update the ref immediately
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current); // Clear the interval
        simulationIntervalRef.current = null; // Reset the interval ref
      }
    };
  

  const startRouteSimulation = (routeCoords: Array<{ latitude: number; longitude: number }>, speed = 50) => {
      // Stop any ongoing simulation
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }

    // Set simulation flag and ref
    setSimulateTrip(true);
    simulateTripRef.current = true;

    let index = 0;
    const updateInterval = 1000; // Update every second
    const distancePerUpdate = (speed * 1000) / 3600; // Speed in meters per second
    let simulatedDistanceTraveled = 0; // Track the distance traveled in simulation
  
    simulationIntervalRef.current = setInterval(() => {
      if (!simulateTripRef.current || index >= routeCoords.length - 1) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
        return; // Exit if the simulation is stopped or route is complete
      }
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
          // Update the location and instructions
          setLocation(newLocation as Location.LocationObject);
          updateInstructions(newLocation as Location.LocationObject);
          // Calculate the traveled distance in this segment and add it to the total
          const distanceTraveledInSegment = getDistance(start, { latitude: newLatitude, longitude: newLongitude });
          simulatedDistanceTraveled += distanceTraveledInSegment;
          // If 100 meters or more has been traveled, update the carbon footprint
          if (simulatedDistanceTraveled >= 100) {
            calculateAndUpdateCarbonFootprint(selectedMode, 100);
            simulatedDistanceTraveled -= 100; // Reset the distance counter after calculation
          }  
          // Adjust the start position closer to the end position
          routeCoords[index] = {
            latitude: newLatitude,
            longitude: newLongitude,
          };
        } else {
          index++;
        }
      } else {
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
    const fieldMask = 'routes.distanceMeters,routes.duration,routes.legs,routes.polyline.encodedPolyline';
  
    // Create an array of API request promises
    const requests = travelModes.map(mode => {
      const requestBody = {
        origin,
        destination: destinationObj,
        travelMode: mode,
        routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
        computeAlternativeRoutes: false,
        languageCode: 'en-US',
        units: 'METRIC',
      };
      return axios.post(
        `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_MAPS_APIKEY}`,
        requestBody,
        {
          headers: {
            'X-Goog-FieldMask': fieldMask,
          },
        }
      ).then(response => {
        const route = response.data.routes[0];
        if (route && route.legs && route.legs.length > 0) {
          const leg = route.legs[0];
          const polyline = route.polyline ? decodePolyline(route.polyline.encodedPolyline) : [];
          return {
            mode,
            duration: leg.localizedValues?.duration?.text || 'Not available',
            distance: leg.localizedValues?.distance?.text || 'Not available',
            polyline,
            steps: leg.steps || [],  // Capture the steps from the route leg
          };
        } else {
          return {
            mode,
            duration: 'Not available',
            distance: 'Not available',
            polyline: [],
            steps: [],
          };
        }
      }).catch(() => ({
        mode,
        duration: 'Not available',
        distance: 'Not available',
        polyline: [],
        steps: [],
      }));
    });
    try {
      // Execute all requests concurrently
      const results = await Promise.all(requests);
      const options = results;
      // Flatten the steps across all modes, adding checks for endLocation
      const allSteps = options.flatMap(option => 
        option.steps.map(step => ({
          ...step,
          travelMode: option.mode,
          endLocation: step.endLocation || null,  // Ensure endLocation is always defined
        }))
      );
      stepsRef.current = allSteps.filter(step => step.endLocation !== null); // Store all valid steps for all modes
      setTransportOptions(options);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  
  const updateInstructions = (newLocation: Location.LocationObject) => {
    if (!destination || stepsRef.current.length === 0) return; // No destination set or no steps available
    const currentLatLng = {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
    };
    let currentStep = stepsRef.current[0];
    // Ensure the endLocation is defined for the current step
    if (!currentStep.endLocation || !currentStep.endLocation.latLng) {
        console.error('End location or latLng is undefined for the current step');
        return;
    }
    const stepEndLatLng = {
        latitude: currentStep.endLocation.latLng.latitude,
        longitude: currentStep.endLocation.latLng.longitude,
    };
    // Calculate the distance to the end of the current step
    const distanceToStepEnd = getDistance(currentLatLng, stepEndLatLng);
    setDistance(distanceToStepEnd);
    // Update the remaining distance and duration
    updateRemainingDistanceAndDuration();
    // Define a completion threshold
    const completionThreshold = 20; // 20 meters threshold to consider the step complete
    // Check if the user has passed the step's endpoint
    const userHasPassedStep = distanceToStepEnd <= completionThreshold;
    if (userHasPassedStep) {
        // Consider the step as completed and remove it from the steps array
        stepsRef.current.shift();
        // If no more steps remain, the user has reached the destination
        if (stepsRef.current.length === 0) {
            setInstructions({
                instructions: 'You have arrived at your destination',
                distance: 0,
                maneuver: 'straight',
            });
            resetMapState(false); // Reset the map state
            return;
        }
        // Move to the next step
        currentStep = stepsRef.current[0];
    }
    // Set the next maneuver (considering the next step, if available)
    let nextManeuver = currentStep.navigationInstruction?.maneuver || 'straight';
    if (stepsRef.current.length > 1) {
        const nextStep = stepsRef.current[1];
        if (nextStep && nextStep.navigationInstruction && nextStep.navigationInstruction.maneuver) {
            nextManeuver = nextStep.navigationInstruction.maneuver;
        }
    }
    // Update the instructions based on the current step and upcoming maneuver
    const nextInstruction = {
        instructions: currentStep.navigationInstruction?.instructions || '',
        distance: distanceToStepEnd,
        maneuver: nextManeuver,
    };
    setInstructions(nextInstruction);
};

// Function to update remaining distance and duration
const updateRemainingDistanceAndDuration = () => {
  if (!destination) return;
  let remainingDistance = 0;
  let remainingDuration = 0;

  remainingDistance += distance;

  // Calculate remaining distance for all subsequent steps
  for (let i = 0; i < stepsRef.current.length - 1; i++) {
    const stepStart = stepsRef.current[i].endLocation.latLng;
    const stepEnd = stepsRef.current[i + 1].endLocation.latLng;
    remainingDistance += getDistance(
      { latitude: stepStart.latitude, longitude: stepStart.longitude },
      { latitude: stepEnd.latitude, longitude: stepEnd.longitude }
    );
    // Add the duration of each step (assumes duration is provided in seconds)
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


const resetMapState = (cancel: boolean) => {
  const resetActions = () => {
    stopSimulation();
    setRouteCoords([]); // Clear the polyline
    setInstructions(null); // Clear the instructions
    stepsRef.current = []; // Clear the steps
    setDestination(''); // Clear the destination
    setArrivalTime(''); // Clear the arrival time
    setDistance(0); // Reset the distance
    setDuration(''); // Clear the duration
    setTotalDistance(''); // Clear the total distance
    setCarbonFootprint(0); // Reset the carbon footprint
    setTransportOptions([]); // Clear the transport options
    if (locationSubscription) {
      locationSubscription.remove(); // Stop the subscription to prevent multiple updates
    }
    setLocationSubscription(null); // Clear the location subscription    
    console.log("simulateTrip state after reset:", simulateTrip);
  };
  if (cancel) {
    resetActions();
  } else {
    // Set a 10-second delay before resetting the map if not cancelled
    setTimeout(resetActions, 10000); // 10 seconds delay (10000 milliseconds)
  }
};

  

  const startNavigation =  () => {
    const selectedOption = transportOptions.find(option => option.mode === selectedMode);
    if (!selectedOption || !selectedOption.polyline || selectedOption.polyline.length === 0) {
        console.error('Selected option does not have a valid polyline');
        return;
    }
    const filteredSteps = stepsRef.current.filter(step => step.travelMode === selectedMode);
    stepsRef.current = filteredSteps; // Update the steps to only include the selected mode
    // Prompt the user to choose between simulation or real navigation
    Alert.alert(
        'Start Trip',
        'Do you want to simulate the trip or use real navigation?',
        [
            {
                text: 'Simulate Trip',
                onPress: () => {
                    console.log(simulateTrip);
                    startRouteSimulation(selectedOption.polyline); // Start the simulation
                    setModalVisible(false);
                }
            },
            {
                text: 'Use Real Location',
                onPress: () => {
                    // Stop any existing simulation
                    if (locationSubscription) {
                      locationSubscription.remove(); // Stop the subscription to prevent multiple updates
                  }
                  // Set up real-time location tracking
                  Location.watchPositionAsync(
                      {
                          accuracy: Location.Accuracy.High,
                          distanceInterval: 0, // Update every 10 meters
                          timeInterval: 1000, // Update every second
                      },
                      (newLocation) => {
                          updateLocation(newLocation);
                      }
                  ).then(subscription => {
                      setLocationSubscription(subscription);
                  }).catch(error => {
                      console.error('Error starting location tracking:', error);
                  });

                  setModalVisible(false);
                }
            },
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                    resetMapState(true); // Reset the map state
                }
            },
        ],
        { cancelable: true }
    );
};


  useEffect(() => {
    if (selectedMode) {
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
        cacheEnabled={true}
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
        isMapTouched={isMapTouched}
        userLocation={location}
        countryCode={countryCode}
        getRoute={getRoute}
        setDestination={setDestination}
        destination={destination}
        resetMapState={resetMapState}
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