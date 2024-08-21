import { ScrollView, View, AppState, Alert, Text } from "react-native";
import {
  Activities,
  Recommendation,
  Dashboard,
} from "../../../components";
import { useMovementDetector } from '@/utils/MovementDetection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredActivities } from "@/utils/AsyncStorage";
import { useState, useEffect } from 'react';
import styles from "@/components/home/whitebackground/whitebackground.style";
import { COLORS } from "@/constants";




export default function Home() {

  const [movement, setMovement] = useState<MovementType>('Uncertain');
  const [appState, setAppState] = useState(AppState.currentState);


  // useMovementDetector({
  //   onMovementChange: setMovement,
  // });

console.log(movement);

  useEffect(() => {
    const checkForActivities = async () => {
      const activities = await getStoredActivities();
      if (activities.length > 0) {
        const lastActivity = activities[activities.length - 1];
        Alert.alert(
          'Activity Detected',
          `You were ${lastActivity.movement}`,
          [{ text: 'OK', onPress: () => AsyncStorage.removeItem('activities') }]
        );
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkForActivities();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);



  

  return (
    
    <View style={{backgroundColor:COLORS.blueGreen}}>
      <ScrollView showsVerticalScrollIndicator={false}>
          <Dashboard/>
          <View style = {styles.whiteBackground}>
          <Activities />
          <Recommendation />
          </View>
      </ScrollView>
    </View>
  );
};
