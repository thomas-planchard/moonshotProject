import React from 'react';
import { View, Text } from 'react-native';
import  styles  from './carbonfootprintcontainer.style';
import { Circle, G, Svg, Line } from 'react-native-svg';
import { COLORS } from '@/constants';

interface CarbonFootprintDisplayProps {
  carbonFootprint: number;
}

const getCarbonFootprintColor = (carbonFootprint: number) => {
  if (carbonFootprint < 1000) {
    return COLORS.lightgreen;
  } else if (carbonFootprint >= 1000 && carbonFootprint <= 2000) {
    return 'orange';
  } else {
    return 'red';
  }
};



const CarbonFootprintDisplay: React.FC<CarbonFootprintDisplayProps> = ({ carbonFootprint }) => {
  const radius = 50;
  const strokeWidth = 10;
  const progress = Math.min(carbonFootprint / 10000, 1); // Ensure progress doesn't exceed 100%

  const dashArray = Array.from({ length: 30 }, (_, i) => i); // Create an array of 30 dashes
  const dashLength = 10; // Length of each dash
  const dashStrokeWidth = 11; // Width of each dash
  const dashBorderWidth = 12; // Width of each dash border
  const filledDashes = Math.ceil(dashArray.length * progress); // Number of dashes to fill based on progress

  return (
  <View style={styles.carbonFootprintContainer}>
        <Svg width="100" height="100" viewBox="0 0 120 120">
          <G rotation="-90" origin="60, 60">
            <Circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e6e6e6"
              strokeWidth={strokeWidth}
              fill={COLORS.darkGreen}
            />
             {dashArray.map((dash, index) => {
            const angle = (index / dashArray.length) * 2 * Math.PI;
            const x1 = 60 + (radius - dashLength / 2) * Math.cos(angle);
            const y1 = 60 + (radius - dashLength / 2) * Math.sin(angle);
            const x2 = 60 + (radius + dashLength / 2) * Math.cos(angle);
            const y2 = 60 + (radius + dashLength / 2) * Math.sin(angle);
            const x1Border = 60 + (radius - dashLength / 2 - 1) * Math.cos(angle);
            const y1Border = 60 + (radius - dashLength / 2 - 1) * Math.sin(angle);
            const x2Border = 60 + (radius + dashLength / 2 + 1) * Math.cos(angle);
            const y2Border = 60 + (radius + dashLength / 2 + 1) * Math.sin(angle);
            return (
              <G key={index}>
                <Line
                  x1={x1Border}
                  y1={y1Border}
                  x2={x2Border}
                  y2={y2Border}
                  stroke={COLORS.blueGreen}
                  strokeWidth={dashBorderWidth}
                />
                <Line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={index < filledDashes ? getCarbonFootprintColor(carbonFootprint) : "#e6e6e6"}
                  strokeWidth={dashStrokeWidth}
                />
              </G>
            );
          })}
        </G>
        </Svg>
        <View style={styles.carbonFootprintTextContainer}>
          <Text style={styles.carbonFootprintText}>{carbonFootprint.toFixed(0)}</Text>
          <Text style={styles.carbonFootprintText2}>LBS</Text>
        </View>
      </View>
  );
};

export default CarbonFootprintDisplay;