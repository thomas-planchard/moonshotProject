import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '@/context/AuthContext';
import { typeOfCars, sizeOfCars } from '@/constants/index';
import styles from './editProfile.style'; 

const EditProfileModal = ({ modalVisible, onRequestClose, user }) => {

  const { updateUser } = useAuth();  

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [carType, setCarType] = useState(user?.carType || '');
  const [carSize, setCarSize] = useState(user?.carSize || '');
  const [consumption, setConsumption] = useState(user?.consumption || '');
  const [carTypeModalVisible, setCarTypeModalVisible] = useState(false);
  const [carSizeModalVisible, setCarSizeModalVisible] = useState(false);

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setCarType(user?.carType || 'electric');
    setCarSize(user?.carSize || 'citadine');
    setConsumption(user?.consumption || '');
  }, [user]);

  const handleSave = async () => {
    if (!username || !email || ((carType === 'Fuel'|| carType === 'Gazoil') && !consumption)) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const updatedUser = {
      username,
      email,
      carType,
      carSize,
      consumption: carType === 'electric' ? null : consumption,
    };

    try {
      await updateUser(updatedUser);
      onRequestClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent} className="gap-4">
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <View style={{ height: hp(7) }} className="flex-row px-4 bg-neutral-100 items-center rounded-2xl">
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={{ fontSize: hp(2) }}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Username"
              placeholderTextColor="grey"
            />
          </View>

          <View style={{ height: hp(7) }} className="flex-row  px-4 bg-neutral-100 items-center rounded-2xl">
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{ fontSize: hp(2) }}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Email address"
              placeholderTextColor="grey"
              autoCapitalize='none'
            />
          </View>

          {/* Car Type */}
          <TouchableOpacity
            style={{ height: hp(7) }}
            className="flex-row px-4 bg-neutral-100 items-center rounded-2xl"
            onPress={() => setCarTypeModalVisible(true)}
          >
            <Text style={{ fontSize: hp(2), color: 'grey' }}>{carType}</Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            animationType="slide"
            visible={carTypeModalVisible}
            onRequestClose={() => setCarTypeModalVisible(false)}
          >
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalContent}>
                <Text style={styles.modalTitle}>Select Car Type</Text>
                <Picker
                  selectedValue={carType}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setCarType(itemValue);
                    setCarTypeModalVisible(false);
                  }}
                >
                    {typeOfCars.map((car) => (
                        <Picker.Item key={car.value} label={car.label} value={car.value} />
                      ))}
                </Picker>
              </View>
            </View>
          </Modal>

          {/* Car Size */}
          <TouchableOpacity
            style={{ height: hp(7) }}
            className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
            onPress={() => setCarSizeModalVisible(true)}
          >
            <Text style={{ fontSize: hp(2), color: 'grey' }}>{carSize}</Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            animationType="slide"
            visible={carSizeModalVisible}
            onRequestClose={() => setCarSizeModalVisible(false)}
          >
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalContent}>
                <Text style={styles.modalTitle}>Select Car Size</Text>
                <Picker
                  selectedValue={carSize}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setCarSize(itemValue);
                    setCarSizeModalVisible(false);
                  }}
                >
                    {sizeOfCars.map((size) => (
                        <Picker.Item key={size.value} label={size.label} value={size.value} />
                      ))}
                </Picker>
              </View>
            </View>
          </Modal>

          {/* Car Consumption (only for fuel cars) */}
          {carType === "Fuel" || carType === "Gazoil" ?  (
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <TextInput
                value={consumption}
                onChangeText={setConsumption}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Consumption (L/km)"
                placeholderTextColor="grey"
                keyboardType="numeric"
              />
            </View>
          ):null}

          {/* Save Button */}
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRequestClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;