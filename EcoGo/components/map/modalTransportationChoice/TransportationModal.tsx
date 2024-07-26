import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import styles from './transportationmodal.style';


interface TransportationOption {
    mode: string;
    duration: string;
    distance: string;
    selected?: boolean;
  }

interface TransportationModalProps {
    setFooterVisible: (footerVisible: boolean) => void;
    isVisible: boolean;
    onClose: () => void;
    options: TransportationOption[];
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
    isVisible, 
    onClose, 
    options 
}) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      onShow={() => setFooterVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.mode}
            renderItem={({ item }) => {
                const mode = transportationModes[item.mode];
              return (
                <TouchableOpacity style={styles.optionContainer}>
                  <View style={[styles.iconContainer, { backgroundColor: mode.backgroundColor }]}>
                    <MaterialCommunityIcons name={mode.icon} size={24} color={mode.color} />
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.modeText}>{item.mode}</Text>
                    <Text style={styles.detailText}>{item.duration}, {item.distance}</Text>
                  </View>
                  <View style={styles.indicatorContainer}>
                    <View style={[styles.indicator, { backgroundColor: item.selected ? COLORS.green : COLORS.gray }]} />
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TransportationModal;