import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import styles from '@/components/screens/infoUser/infoUser.style';
import CustomKeyboardView from '@/components/common/CustomKeyboardView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import UploadModal from '@/utils/UploadModal';
import { generateImagePath, updateImageToFirebase } from '@/utils/UploadImageToFirebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { SIZES, COLORS } from '@/constants/theme';
import { ProfilImage } from '@/components/common/ProfilImage';  
import PoliciesContainer from '@/components/screens/infoUser/Policies';
import PersonalInformation from '@/components/screens/infoUser/PersonalInfo';

const InfoUser = () => {
  const router = useRouter();
  const { logout, updateUser, user } = useAuth();
  

  const [imageLoaded, setImageLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

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
        const profileImageUrl = await updateImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId), user?.userId, setIsUploading, setProgress);
        updateUser({ profileImageUrl });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };


  return (
    <CustomKeyboardView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS.greenWhite }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5), backgroundColor: COLORS.greenWhite }} className="flex-1 gap-12">
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <TouchableOpacity onPress={() => router.push('/home')} style={{ flexDirection: 'row' }}>
              <Ionicons name="chevron-back" size={SIZES.xLarge} color="black" />
              <Text style={{ fontSize: SIZES.large, textDecorationLine: 'underline' }}>Back</Text>
            </TouchableOpacity>
          </View>
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
          </View>

          <PersonalInformation />
          <PoliciesContainer />

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.textInLogoutButton}>Logout</Text>
          </TouchableOpacity>
        </View>
        <UploadModal
          modalVisible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={() => pickImage(true)}
          onGalleryPress={() => pickImage()}
        />
      </ScrollView>
    </CustomKeyboardView>
  );
};

export default InfoUser;