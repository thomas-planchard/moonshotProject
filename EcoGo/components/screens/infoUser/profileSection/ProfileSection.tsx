import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfilImage } from '@/components/common/ProfilImage';
import { COLORS } from '@/constants/theme';
import { ProgressBar } from 'react-native-paper';
import UploadModal from '../UploadModal';
import { generateImagePath, updateImageToFirebase } from '@/utils/UploadImageToFirebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import styles from './profilesection.style';

const ProfileSection= () => {
  const { user, updateUser } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImage = async (isCamera = false) => {
    let result;
    try {
      if (isCamera) {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        setModalVisible(false);
        const profileImageUrl = await updateImageToFirebase(
          result.assets[0].uri, 
          generateImagePath(user?.userId), 
          user?.userId, 
          setIsUploading, 
          setProgress
        );
        updateUser({ profileImageUrl });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <ProfilImage imageState={imageLoaded} source={user?.profileImageUrl} style={styles.profileImage} setImageState={setImageLoaded} />
        <TouchableOpacity
          style={{ backgroundColor: COLORS.lightWhite, borderRadius: 24, position: 'absolute', right: 5, bottom: 5, padding: 8 }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="camera" size={24} color={COLORS.greenForest} />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isUploading}
          onRequestClose={() => setIsUploading(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text>Uploading Image: {Math.round(progress)}%</Text>
              <ProgressBar progress={progress / 100} color={COLORS.darkGreen} />
            </View>
          </View>
        </Modal>
      </View>
      <Text style={styles.username}>{user?.username || 'Not specified'}</Text>
      <UploadModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onBackPress={() => setModalVisible(false)}
        onCameraPress={() => pickImage(true)}
        onGalleryPress={() => pickImage()}
      />
    </View>
  );
};

export default ProfileSection;