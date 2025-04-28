import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, Modal, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CalculateCarbonFootprint from "@/utils/CalculateCarbonFootprint";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from '../../../FirebaseConfig';
import { useAuth } from "@/context/AuthContext";
import { ICONS } from "@/constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchUserData from "@/utils/FetchUserData";
import styles from "./activities.style";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const API_URL = 'http://192.168.x.y:8001/extract-data'; // Replace with your CarbonClap API URL

const categoryDisplayNames: { [key: string]: string } = {
  essence: 'Fuel',
  trains: 'Train',
  avions: 'Plane',
};

const predefinedActivities = [
  { label: "Car", value: "Car", icon: ICONS.car },
  { label: "Bus", value: "Bus", icon: ICONS.frontBus },
  { label: "Plane", value: "Plane", icon: ICONS.blackPlane },
  { label: "Bicycle", value: "Bicycle", icon: ICONS.cycling },
  { label: "Walk", value: "Walk", icon: ICONS.cycling },
];

interface ActivityProps {
  activityData: {
    activity?: string;
    distance?: string;
  };
}

const Activities: React.FC<ActivityProps> = ({ activityData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(predefinedActivities[0].value);
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [activities, setActivities] = useState([]);
  const { user } = useAuth();
  const [userData, setUserData] = useState<{ consumption?: number; carType?: string; carbonFootprint?: string; }>({});

  useEffect(() => {
    if (user?.userId) {
      const fetchData = async () => {
        const data = await fetchUserData(user.userId, ['consumption', 'carType', 'carbonFootprint']);
        setUserData(data || {});
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (parseFloat(activityData.distance ?? "0") > 0) {
      if (activityData.activity == 'Cycling or in a bus') {
        Alert.alert(
          "Activity Detected",
          "You were detected as Cycling or on a Bus. Can you please confirm which one?",
          [
            { text: "Cycling", onPress: () => setSelectedActivity("Cycling") },
            { text: "Bus", onPress: () => setSelectedActivity("bus") }
          ]
        );
      } else {
        setSelectedActivity(activityData.activity || predefinedActivities[0].value);
      }
      setDistance(activityData.distance || '');
      AsyncStorage.removeItem('activities');
      openModal();
    }
  }, [activityData]);

  const openModal = () => {
    setSelectedActivity(predefinedActivities[0].value);
    setTime('');
    setDistance('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPickerVisible(false);
  };

  const handleAddActivity = async () => {
    const activityIcon = predefinedActivities.find(activity => activity.value === selectedActivity)?.icon;

    const userDataRef = doc(db, "userData", user.userId);

    let carbonFootprint = 0;

    if (selectedActivity === "Car") {
      const carType = userData.carType;
      const consumption = userData.consumption || undefined;
      carbonFootprint = CalculateCarbonFootprint(parseFloat(distance), carType.toLowerCase(), consumption);
    } else {
      carbonFootprint = CalculateCarbonFootprint(parseFloat(distance), selectedActivity.toLowerCase());
    }

    carbonFootprint = parseFloat(carbonFootprint.toFixed(2));

    let totalCarbonFootprint = carbonFootprint;

    const previousFootprint = parseFloat(userData.carbonFootprint ?? '0');
    totalCarbonFootprint += previousFootprint;

    await updateDoc(userDataRef, {
      carbonFootprint: increment(carbonFootprint)
    });

    setActivities([...activities, { name: selectedActivity, time, distance, icon: activityIcon }]);
    closeModal();
  };

  const openPicker = () => {
    setPickerVisible(true);
  };

  const closePicker = () => {
    setPickerVisible(false);
  };

  const showAddOptions = () => {
    Alert.alert('Add Activity', 'Choose entry method', [
      { text: 'Manual Entry', onPress: openModal },
      { text: 'Scan Receipt', onPress: handleScanReceipt },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleScanReceipt = () => {
    Alert.alert('Select Category', '', [
      { text: 'Essence', onPress: () => pickFile('essence') },
      { text: 'Trains', onPress: () => pickFile('trains') },
      { text: 'Avions', onPress: () => pickFile('avions') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickFile = async (category: string) => {
    Alert.alert('Pick File', '', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission required', 'Camera permission is needed.');
          const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
          if (!result.cancelled) {
            await sendFileToAPI(result.uri, `photo.${result.uri.split('.').pop()}`, 'image/jpeg', category);
          }
        },
      },
      {
        text: 'Select Document',
        onPress: async () => {
          const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
          if (res.type === 'success') {
            const uri = res.uri;
            const name = res.name;
            const mimeType = res.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';
            await sendFileToAPI(uri, name, mimeType, category);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const sendFileToAPI = async (uri: string, name: string, mimeType: string, category: string) => {
    try {
      const formData = new FormData();
      formData.append('file', { uri, name, type: mimeType } as any);
      formData.append('category', category);
      if (['trains', 'avions'].includes(category)) {
        formData.append('countries', 'FR');
      }
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data;
      setSelectedActivity(categoryDisplayNames[category] || '');
      setDistance(data.number_of_kilometers?.toString() || '');
      setTime('');
      openModal();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activities</Text>
        <TouchableOpacity onPress={showAddOptions} style={styles.plusButton}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsHorizontalScrollIndicator={true} horizontal style={styles.cardsContainer}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.card}>
            <Image style={styles.icons} source={activity.icon} />
            <Text style={styles.activityTime}>{activity.distance} km</Text>
            <Text style={styles.activityName}>{activity.name}</Text>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Activity</Text>
            <TouchableOpacity style={styles.input} onPress={openPicker}>
              <Text>{selectedActivity}</Text>
            </TouchableOpacity>
            {pickerVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={pickerVisible}
                onRequestClose={closePicker}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <Picker
                      selectedValue={selectedActivity}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setSelectedActivity(itemValue);
                        closePicker();
                      }}
                    >
                      {predefinedActivities.map((activity) => (
                        <Picker.Item key={activity.value} label={activity.label} value={activity.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            )}
            <TextInput
              style={styles.input}
              placeholder="Time (min)"
              value={time}
              onChangeText={setTime}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Distance (km)"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
            />
            <Button title="Add Activity" onPress={handleAddActivity} />
            <Button title="Cancel" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Activities;