import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const vehicles = {
  car: require('./assets/car.png'), // Add your own vehicle icons here
  bike: require('./assets/bike.png'),
  walk: require('./assets/walk.png'),
};

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [vehicle, setVehicle] = useState('car');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      }, (newLocation) => {
        setLocation(newLocation.coords);
        setSpeed(newLocation.coords.speed);
      });
    })();
  }, []);

  const handleVehicleChange = (selectedVehicle) => {
    setVehicle(selectedVehicle);
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        {errorMsg ? <Text>{errorMsg}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        followsUserLocation
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          image={vehicles[vehicle]}
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.speedText}>Speed: {speed ? (speed * 3.6).toFixed(2) : '0'} km/h</Text>
        <View style={styles.buttonContainer}>
          <Button title="Car" onPress={() => handleVehicleChange('car')} />
          <Button title="Bike" onPress={() => handleVehicleChange('bike')} />
          <Button title="Walk" onPress={() => handleVehicleChange('walk')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  speedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default MapScreen;