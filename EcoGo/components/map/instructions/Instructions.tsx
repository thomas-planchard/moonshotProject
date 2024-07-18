import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './instructions.style';

interface InstructionsProps {
  instructions: {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    end_location: { lat: number; lng: number };
    html_instructions: string;
    maneuver: string;
    polyline: { points: string };
    start_location: { lat: number; lng: number };
    travel_mode: string;
  };
  distance: number;
}

const getManeuver = (instruction) => {
  return instruction.maneuver ? instruction.maneuver : 'straight';
};

const getTurnDirection = (maneuver: string) => {
  switch (maneuver.toLowerCase()) {
    case 'turn-slight-left':
      return <MaterialCommunityIcons name="arrow-top-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'turn-sharp-left':
      return <MaterialCommunityIcons name="arrow-bottom-left" size={80} color="white" style={styles.turnIcon} />;
    case 'turn-slight-right':
      return <MaterialCommunityIcons name="arrow-top-right" size={80} color="white"style={styles.turnIcon}/>;
    case 'turn-sharp-right':
      return <MaterialCommunityIcons name="arrow-bottom-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'uturn-left':
      return <MaterialCommunityIcons name="arrow-u-down-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'uturn-right':
      return <MaterialCommunityIcons name="arrow-u-down-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'straight':
    case 'continue':
    case 'head':
      return <MaterialCommunityIcons name="arrow-up" size={80} color="white" style={styles.turnIcon}/>;
    case 'merge':
      return <MaterialCommunityIcons name="merge" size={80} color="white" style={styles.turnIcon}/>;
    case 'ramp-left':
      return <MaterialIcons name="ramp-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'ramp-right':
      return <MaterialIcons name="ramp-right" size={80} color="white" style={styles.turnIcon} />;
    case 'fork-left':
      return <MaterialIcons name="fork-left" size={80} color="white" style={styles.turnIcon} />;
    case 'fork-right':
      return <MaterialIcons name="fork-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'ferry':
      return <MaterialCommunityIcons name="ferry" size={80} color="white" style={styles.turnIcon} />;
    case 'roundabout-left':
      return <MaterialIcons name="roundabout-left" size={80} color="white" style={styles.turnIcon} />;
    case 'roundabout-right':
      return <MaterialIcons name="roundabout-right" size={80} color="white" style={styles.turnIcon} />;
    case 'turn-left':
      return <MaterialCommunityIcons name="arrow-left-top" size={80} color="white" style={styles.turnIcon}/>;
    case 'turn-right':
      return <MaterialCommunityIcons name="arrow-right-top" size={80} color="white" style={styles.turnIcon}/>;
    default:
      return null;
  }
};

const getStreetName = (instruction: string) => {
    const regex = /<b>(.*?)<\/b>/g;
    const matches = [...instruction.matchAll(regex)];
    return matches.length > 1 ? matches[1][1] : '';
  };

export const Instructions: React.FC<InstructionsProps> = ({ instructions, distance }) => {
  const maneuver = getManeuver(instructions);
  const turnDirection = getTurnDirection(maneuver);
  const streetName = getStreetName(instructions.html_instructions);

  return (
    <View style={styles.instructionContainer}>
      {turnDirection && turnDirection}
      <View style={styles.textContainer}>
        <Text style={styles.instructionsText}>{distance.toFixed(0)} m</Text>
        <Text style={styles.streetNameText} numberOfLines={3}>{streetName}</Text>
      </View>
    </View>
  );
};

export default Instructions;