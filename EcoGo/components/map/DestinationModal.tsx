import React from 'react';
import { View, Modal, Text, TouchableOpacity, Button, TextInput } from 'react-native';
import { styles } from './map.style';

interface DestinationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  getRoute: () => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  setDestination: (destination: string) => void;
  destination: string;

}

const DestinationModal: React.FC<DestinationModalProps> = ({
  modalVisible,
  setModalVisible,
  getRoute,
  selectedMode,
  setSelectedMode,
  setDestination,
  destination,
}) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Enter Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={destination}
          onChangeText={setDestination}
        />
        <Text style={styles.modalTitle}>Select Mode of Transportation</Text>
        <View style={styles.modeButtonsContainer}>
          <TouchableOpacity
            style={selectedMode === 'DRIVE' ? styles.modeButtonSelected : styles.modeButton}
            onPress={() => setSelectedMode('DRIVE')}
          >
            <Text style={styles.modeButtonText}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedMode === 'BICYCLE' ? styles.modeButtonSelected : styles.modeButton}
            onPress={() => setSelectedMode('BICYCLE')}
          >
            <Text style={styles.modeButtonText}>Bicycle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedMode === 'WALK' ? styles.modeButtonSelected : styles.modeButton}
            onPress={() => setSelectedMode('WALK')}
          >
            <Text style={styles.modeButtonText}>Walking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedMode === 'TWO_WHEELER' ? styles.modeButtonSelected : styles.modeButton}
            onPress={() => setSelectedMode('TWO_WHEELER')}
          >
            <Text style={styles.modeButtonText}>2 Wheeler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedMode === 'TRANSITE' ? styles.modeButtonSelected : styles.modeButton}
            onPress={() => setSelectedMode('TRANSIT')}
          >
            <Text style={styles.modeButtonText}> Public Transportation  </Text>
          </TouchableOpacity>
        </View>
        <Button title="Get Route" onPress={getRoute} />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </View>
    </View>
  </Modal>
  );
};


export default DestinationModal;