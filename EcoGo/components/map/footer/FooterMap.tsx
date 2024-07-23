import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import  styles  from './footer.style';
import { COLORS } from '@/constants/theme';

interface FooterMapProps {
  setModalVisible: (visible: boolean) => void;
  distance: string;
  duration: string;
  arrivalTime: string;
}

const FooterMap: React.FC<FooterMapProps> = ({ setModalVisible, distance, duration, arrivalTime }) => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.infoSection}>
        <Text style={styles.infoArrivalTime}>{arrivalTime}</Text>
        <View style={styles.infoSectionRow}>
            <Text style={styles.infoText}>{duration} </Text>
            {duration && <Entypo name="dot-single" size={24} color='black' />}
            <Text style={styles.infoText}> {distance}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.magnifierButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="search" size={34} color={COLORS.blueGreen} />
      </TouchableOpacity>
    </View>
  );
};

export default FooterMap;