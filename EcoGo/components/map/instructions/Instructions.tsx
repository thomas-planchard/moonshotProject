import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './instructions.style';

interface InstructionsProps {
    instructions: string;
}

const getTurnDirection = (instruction: string) => {
    if (instruction.toLowerCase().includes('slight left')) {
        return <MaterialCommunityIcons name="arrow-top-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('sharp left')) {
        return <MaterialCommunityIcons name="arrow-bottom-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('left')) {
        return <MaterialCommunityIcons name="arrow-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('slight right')) {
        return <MaterialCommunityIcons name="arrow-top-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('sharp right')) {
        return <MaterialCommunityIcons name="arrow-bottom-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('right')) {
        return <MaterialCommunityIcons name="arrow-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('uturn left')) {
        return <MaterialCommunityIcons name="arrow-u-down-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('uturn right')) {
        return <MaterialCommunityIcons name="arrow-u-down-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('straight')) {
        return <MaterialCommunityIcons name="arrow-up" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('merge')) {
        return <MaterialCommunityIcons name="merge" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('ramp left')) {
        return <MaterialIcons name="ramp-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('ramp right')) {
        return <MaterialIcons name="ramp-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('fork left')) {
        return <MaterialIcons name="fork-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('fork right')) {
        return <MaterialIcons name="fork-right" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('ferry')) {
        return <MaterialCommunityIcons name="ferry" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('roundabout left')) {
        return <MaterialIcons name="roundabout-left" size={80} color="white" />;
    } else if (instruction.toLowerCase().includes('roundabout right')) {
        return <MaterialIcons name="roundabout-right" size={80} color="white" />;
    }
    return null;
};

const getDistance = (instruction: string) => {
    const regex = /in (\d+) m/;
    const match = instruction.match(regex);
    return match ? match[1] : '';
};

const getStreetName = (instruction: string) => {
    const regex = /on (.+?) in \d+ m/;
    const match = instruction.match(regex);
    return match ? match[1] : '';
};


export const Instructions: React.FC<InstructionsProps> = ({ instructions }) => {
    console.log(instructions);
    const turnDirection = getTurnDirection(instructions);
    const distance = getDistance(instructions);
    const streetName = getStreetName(instructions);

    return (
        <View style={styles.instructionContainer}>
            {turnDirection && turnDirection}
            <View style={styles.textContainer}>
                <Text style={styles.instructionsText}>{distance} m</Text>
                <Text style={styles.streetNameText} numberOfLines={3}>{streetName}</Text>
            </View>
        </View>
    );
};

export default Instructions;