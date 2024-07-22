import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {ICONS} from "@/constants"
import styles from "./activities.style";

const predefinedActivities = [
  { label: "Car", value: "Car", icon: ICONS.car },
  { label: "Bus", value: "Bus", icon: ICONS.frontBus },
  { label: "Plane", value: "Plane", icon: ICONS.blackPlane },
  { label: "Cycling", value: "Cycling", icon: ICONS.cycling },
];

export default function Activities() {
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(predefinedActivities[0].value);
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [activities, setActivities] = useState([]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPickerVisible(false);
  };

  const handleAddActivity = () => {
    const activityIcon = predefinedActivities.find(activity => activity.value === selectedActivity)?.icon;
    setActivities([...activities, { name: selectedActivity, time, distance, icon: activityIcon }]);
    closeModal();
  };

  const openPicker = () => {
    setPickerVisible(true);
  };

  const closePicker = () => {
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activities</Text>
        <TouchableOpacity onPress={openModal} style={styles.plusButton}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsHorizontalScrollIndicator={true} horizontal style={styles.cardsContainer}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.card}>
            <Image style={styles.icons} source={activity.icon} />
            <Text style={styles.activityTime}>{activity.time} min</Text>
            <Text style={styles.activityName}>{activity.name}</Text>
          </View>
        ))}
      </ScrollView>
      
      <Modal
        animationType="slide"
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

