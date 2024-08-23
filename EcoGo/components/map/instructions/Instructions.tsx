import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './instructions.style';

interface InstructionsProps {
  instructions: {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    end_location: { lat: number; lng: number };
    instructions: string;
    maneuver: string;
    polyline: { points: string };
    start_location: { lat: number; lng: number };
    travel_mode: string;
  };
  distance: number;
}


const getTurnDirection = (maneuver: string) => {
  switch (maneuver.toLowerCase()) {
    case 'turn_slight_left':
      return <MaterialCommunityIcons name="arrow-top-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'turn_sharp_left':
      return <MaterialCommunityIcons name="arrow-bottom-left" size={80} color="white" style={styles.turnIcon} />;
    case 'turn_slight_right':
      return <MaterialCommunityIcons name="arrow-top-right" size={80} color="white"style={styles.turnIcon}/>;
    case 'turn_sharp_right':
      return <MaterialCommunityIcons name="arrow-bottom-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'uturn_left':
      return <MaterialCommunityIcons name="arrow-u-down-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'uturn_right':
      return <MaterialCommunityIcons name="arrow-u-down-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'straight':
    case 'continue':
    case 'name_change':
    case 'depart':
    case 'head':
      return <MaterialCommunityIcons name="arrow-up" size={80} color="white" style={styles.turnIcon}/>;
    case 'merge':
      return <MaterialCommunityIcons name="merge" size={80} color="white" style={styles.turnIcon}/>;
    case 'ramp_left':
      return <MaterialIcons name="ramp-left" size={80} color="white" style={styles.turnIcon}/>;
    case 'ramp_right':
      return <MaterialIcons name="ramp-right" size={80} color="white" style={styles.turnIcon} />;
    case 'fork_left':
      return <MaterialIcons name="fork-left" size={80} color="white" style={styles.turnIcon} />;
    case 'fork_right':
      return <MaterialIcons name="fork-right" size={80} color="white" style={styles.turnIcon}/>;
    case 'ferry':
      return <MaterialCommunityIcons name="ferry" size={80} color="white" style={styles.turnIcon} />;
    case 'roundabout_left':
      return <MaterialIcons name="roundabout-left" size={80} color="white" style={styles.turnIcon} />;
    case 'roundabout_right':
      return <MaterialIcons name="roundabout-right" size={80} color="white" style={styles.turnIcon} />;
    case 'turn_left':
      return <MaterialCommunityIcons name="arrow-left-top" size={80} color="white" style={styles.turnIcon}/>;
    case 'turn_right':
      return <MaterialCommunityIcons name="arrow-right-top" size={80} color="white" style={styles.turnIcon}/>;
    default:
      return null;
  }
};

const getStreetName = (instruction: string) => {
  // Define a regex to capture the street name after 'onto', 'on', 'towards', etc.
  const regex = /(?:onto|on|towards|Continue onto)\s(.+)/i;
  const match = instruction.match(regex);

  // If there's a match, return the captured street name; otherwise, return the whole instruction
  return match ? match[1] : instruction;
};

const Instructions: React.FC<InstructionsProps> = ({ instructions, distance }) => {
  const turnDirection = getTurnDirection(instructions.maneuver);
  const streetName = getStreetName(instructions.instructions);

  // console.log('Instructions:', instructions);

  return (
    <View style={styles.instructionContainer}>
      {turnDirection && turnDirection}
      <View style={styles.textContainer}>
        <Text style={styles.instructionsText}>{distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance.toFixed(0)} m`}</Text>
        <Text style={styles.streetNameText} numberOfLines={3}>{streetName}</Text>
      </View>
    </View>
  );
};

export default Instructions;