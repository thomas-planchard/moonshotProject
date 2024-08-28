import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp  } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from './policies.style';

const PoliciesContainer = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Policies</Text>
            <TouchableOpacity style={styles.button} accessibilityLabel="Terms of Service">
                <Octicons name="law" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={styles.buttonText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} accessibilityLabel="Privacy Policy">
                <Octicons name="shield" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={styles.buttonText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} accessibilityLabel="Cookies Policy">
                <Octicons name="browser" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={styles.buttonText}>Cookies Policy</Text>
            </TouchableOpacity>
        </View>
    );
}



export default PoliciesContainer;