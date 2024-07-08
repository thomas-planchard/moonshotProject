import React from 'react';
import { View, Modal, Text, TextInput, Button, StyleSheet } from 'react-native';
import { styles } from './map.style';

interface DestinationModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  destination: string;
  setDestination: (destination: string) => void;
  getRoute: () => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({
  modalVisible,
  setModalVisible,
  destination,
  setDestination,
  getRoute,
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
          <Button title="Get Route" onPress={getRoute} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};


export default DestinationModal;