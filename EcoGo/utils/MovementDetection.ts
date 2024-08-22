import { useEffect, useState } from 'react';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';
import { map, filter } from 'rxjs/operators';
import { storeActivity } from './AsyncStorage';

type MovementType = 'Walking' | 'Driving' | 'Cycling or in a bus' | 'Uncertain'; //Possible output

interface MovementDetectorProps {
  onMovementChange: (movement: MovementType) => void;
  gpsUpdateInterval?: number;
  sensorUpdateInterval?: number;
}

export const useMovementDetector = ({
  onMovementChange,
  gpsUpdateInterval = 10000, // 10 seconds 
  sensorUpdateInterval = 200,  // 200ms
}: MovementDetectorProps) => {
  const [accelerationData, setAccelerationData] = useState<number[]>([]);
  const [gyroData, setGyroData] = useState<number[]>([]);
  const [gpsSpeed, setGpsSpeed] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }   
    // Start GPS tracking
    const watchId = Geolocation.watchPosition(
      (position) => {
        const speed = position.coords.speed; // Speed in meters/second
        setGpsSpeed(speed);
        adaptiveSensorUpdate(speed);
      },
      (error) => {
        // Surface the error to the user or a monitoring service
        handleGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Minimum distance in meters to trigger an update
        interval: gpsUpdateInterval,
      }
    );
    // Initialize sensors with adaptive frequency
    const accelerometerSubscription = startAccelerometer();
    const gyroscopeSubscription = startGyroscope();

    return () => {
      Geolocation.clearWatch(watchId);

      // Properly unsubscribe to prevent memory leaks
      accelerometerSubscription?.unsubscribe();
      gyroscopeSubscription?.unsubscribe();
    };
  };
    requestLocationPermission();
  }, []);

  const adaptiveSensorUpdate = (speed: number | null) => {
    const now = Date.now();

    // Adjust accelerometer and gyroscope update intervals based on speed
    if (speed !== null) {
      if (speed > 5) { // Assuming 5 m/s (~18 km/h) as the threshold for driving
        setUpdateIntervalForType(SensorTypes.accelerometer, 1000); // Check every 1 second
        setUpdateIntervalForType(SensorTypes.gyroscope, 1000);
      } else {
        setUpdateIntervalForType(SensorTypes.accelerometer, sensorUpdateInterval);
        setUpdateIntervalForType(SensorTypes.gyroscope, sensorUpdateInterval);
      }
    }

    // Throttle updates to save power
    if (now - lastUpdate > 5000) { // Only analyze every 5 seconds
      analyzeMovement(accelerationData, gyroData, speed);
      setLastUpdate(now);
      setAccelerationData([]);
      setGyroData([]);
    }
  };

  const startAccelerometer = () => {
    try {
      setUpdateIntervalForType(SensorTypes.accelerometer, sensorUpdateInterval); // Start with a 200ms interval

      return accelerometer
        .pipe(
          map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z) - 9.81), // Remove gravity (thx Wikipedia)
          filter((acceleration) => !isNaN(acceleration))
        )
        .subscribe({
          next: (acceleration) => {
            setAccelerationData((prevData) => {
              // Use a fixed-size array to store the last 50 readings to avoid frequent memory allocations
              const newData = [...prevData, acceleration];
              return newData.slice(-50);
            });
          },
          error: (error) => {
            handleSensorError('Accelerometer', error);
          },
        });
    } catch (error) {
      handleSensorError('Accelerometer', error);
    }
  };


  const startGyroscope = () => {
    try {
      setUpdateIntervalForType(SensorTypes.gyroscope, sensorUpdateInterval); // Start with a 200ms interval

      return gyroscope
        .pipe(
          map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)),
          filter((rotation) => !isNaN(rotation))
        )
        .subscribe({
          next: (rotation) => {
            setGyroData((prevData) => {
              // fixed-size array to store the last 50 readings to avoid frequent memory allocations
              const newData = [...prevData, rotation];
              return newData.slice(-50);
            });
          },
          error: (error) => {
            handleSensorError('Gyroscope', error);
          },
        });
    } catch (error) {
      handleSensorError('Gyroscope', error);
    }
  };


  const analyzeMovement = (accData: number[], gyroData: number[], speed: number | null) => {
    const variance = calculateVariance(accData);
    const meanAccel = calculateMean(accData);
    const meanGyro = calculateMean(gyroData);

    let movement: MovementType = 'Uncertain';

    if (speed !== null && speed > 5) {
      if (variance < 0.2) {
        movement = 'Driving'; // Likely driving if speed is high and variance is low
      } else {
        movement = 'Cycling or in a bus'; // Could be cycling or in a bus if variance is higher
      }
    } else if (variance > 0.5 && meanAccel > 0.3 && meanGyro < 1) {
      movement = 'Walking';
    } else if (meanGyro > 1) {
      movement = 'Cycling or in a bus';
    }
    const activity = {
        movement,
        timestamp: Date.now(),
      };
    
      storeActivity(activity);

    onMovementChange(movement);
  };

  const calculateVariance = (data: number[]) => {
    const mean = calculateMean(data);
    return data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
  };

  const calculateMean = (data: number[]) => {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  };

  const handleGeolocationError = (error: any) => {
    console.error('Geolocation error:', error);
  };

  const handleSensorError = (sensorType: string, error: any) => {
    console.error(`${sensorType} error:`, error);
  };
};