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
import  CalculateCarbonFootprint from "@/utils/CalculateCarbonFootprint";
import {  doc, getDoc, updateDoc } from "firebase/firestore"; 
import {db} from '../../../FirebaseConfig';
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth(); 


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPickerVisible(false);
  };

  const handleAddActivity = async () => {
    const activityIcon = predefinedActivities.find(activity => activity.value === selectedActivity)?.icon;
    
    let carbonFootprint = 0;

    // Fetch car data from Firestore
    const userDataRef = doc(db, "userData", user.userId); // Adjust this to match your structure
    const docSnapshot = await getDoc(userDataRef);

    if (selectedActivity === "Car") {
      try {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const carType = userData.carType;
          const consumption = userData.consumption || undefined; 
          carbonFootprint = CalculateCarbonFootprint(parseFloat(distance), carType.toLowerCase(), consumption); // Assuming gasoline for simplicity
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching car data: ", error);
      }
    } else {
      // Calculate carbon footprint for other activities
      carbonFootprint = CalculateCarbonFootprint(parseFloat(distance), selectedActivity.toLowerCase());
    }

         // Round the carbon footprint to 1 decimal place
         carbonFootprint = parseFloat(carbonFootprint.toFixed(1));

         let totalCarbonFootprint = carbonFootprint;
   
         if (docSnapshot.exists()) {
           const userData = docSnapshot.data();
           const previousFootprint = parseFloat(userData.carbonFootprint) || 0; // Ensure previousFootprint is a number
           totalCarbonFootprint += previousFootprint;
         }
   
   
         // Update the accumulated carbon footprint
         await updateDoc(userDataRef, {
           carbonFootprint: totalCarbonFootprint
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

