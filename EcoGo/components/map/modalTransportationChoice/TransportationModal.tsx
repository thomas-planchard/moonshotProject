import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from './transportationmodal.style';


interface TransportationOption {
    mode: string;
    duration: string;
    distance: string;
    polyline?: { latitude: number; longitude: number }[];
    selected?: boolean;
  }

interface TransportationModalProps {
    onSelectedMode: (mode: string) => void;
    selectedMode: string ;
    setFooterVisible: (footerVisible: boolean) => void;
    setIsVisible: (isVisible: boolean) => void;
    options: TransportationOption[];
    onConfirm: () => void;  
    }


const transportationModes = { 
  WALK: {
    icon: 'walk',
    color: COLORS.green,
    backgroundColor: COLORS.greenWhite,
  },
  DRIVE: {
    icon: 'car',
    color: COLORS.orange,
    backgroundColor: COLORS.lightOrange,
  },
  BICYCLE: {
    icon: 'bicycle',
    color: COLORS.blue,
    backgroundColor: COLORS.lightBlue,
  },
  TRANSIT: {
    icon: 'bus',
    color: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
  },
};

const TransportationModal: React.FC<TransportationModalProps> = ({ 
    setFooterVisible,
    setIsVisible,
    options,
    selectedMode,
    onSelectedMode,
    onConfirm
}) => {

    const onClose = () => {
        setFooterVisible(true);
        setIsVisible(false);
    };  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      onShow={() => setFooterVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.mode}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
                const mode = transportationModes[item.mode];
              return (
                <TouchableOpacity style={styles.optionContainer} onPress={() => onSelectedMode(item.mode)}>
                  <View style={[styles.iconContainer, { backgroundColor: mode.backgroundColor }]}>
                    <MaterialCommunityIcons name={mode.icon} size={24} color={mode.color} />
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.modeText}>{item.mode}</Text>
                    <Text style={styles.detailText}>{item.duration}, {item.distance}</Text>
                  </View>
                  <View style={styles.indicatorContainer}>
                    <View style={[styles.indicator,  { backgroundColor: selectedMode === item.mode ? COLORS.green : COLORS.gray }]} />
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <TouchableOpacity style={styles.closeButton} onPress={()=>{
            onClose();
            onConfirm();
          }}>
            <Text style={styles.closeButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TransportationModal;