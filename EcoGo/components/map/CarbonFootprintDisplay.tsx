import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './map.style';
import { COLORS } from '@/constants';

interface CarbonFootprintDisplayProps {
  carbonFootprint: number;
}

const getCarbonFootprintColor = (carbonFootprint: number) => {
  if (carbonFootprint < 100) {
    return COLORS.lightgreen;
  } else if (carbonFootprint >= 100 && carbonFootprint <= 200) {
    return 'orange';
  } else {
    return 'red';
  }
};

const CarbonFootprintDisplay: React.FC<CarbonFootprintDisplayProps> = ({ carbonFootprint }) => {
  return (
    <View style={styles.carbonContainer}>
      <Image source={require('@/assets/icons/speedometer.png')} style={styles.speedometer} />
      <Text style={{ ...styles.carbonText, color: getCarbonFootprintColor(carbonFootprint) }}>
        {carbonFootprint.toFixed(2)}
      </Text>
    </View>
  );
};

export default CarbonFootprintDisplay;