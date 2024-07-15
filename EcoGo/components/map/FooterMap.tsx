import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './map.style';
import { COLORS } from '@/constants/theme';


interface FooterMapProps {
  setModalVisible: (visible: boolean) => void;
}

const FooterMap: React.FC<FooterMapProps> = ({ setModalVisible }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.magnifierButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="search" size={34} color= {COLORS.blueGreen} />
      </TouchableOpacity>
    </View>
  );
};

export default FooterMap;