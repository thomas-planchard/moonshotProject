import React from 'react';
import { View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './instructions.style';

interface InstructionsProps {
    instructions: string;
}

const getTurnDirection = (instruction: string) => {
    if (instruction.toLowerCase().includes('west')) {
        return <Feather style ={styles.turnIcon} name="corner-up-left" size={84} color="white" />; 
    } else if (instruction.toLowerCase().includes('east')) {
        return <Feather  style ={styles.turnIcon} name="corner-up-right" size={84} color="white" />; 
    } else if (instruction.toLowerCase().includes('north')) {
        return  <Feather  style ={styles.turnIcon} name="arrow-up" size={84} color="white" />; 
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