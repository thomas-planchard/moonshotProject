import { View, Text, TouchableOpacity, RefreshControl, ScrollView, Modal, Alert, ActivityIndicator, ProgressBarAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar} from 'react-native-paper';
import  styles  from '@/components/screens/infoUser/infoUser.style.ts';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import UploadModal from "@/utils/modal/uploadModal";
import { generateImagePath, updateImageToFirebase } from '@/utils/dataProcessing/uploadImageToFirebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/authContext';
import { SIZES, COLORS } from '@/constants/theme.ts';
import { getAuth } from 'firebase/auth';
import {ProfilImage} from '@/components/common/profilImage/profilImage';
import { sendPasswordResetEmail } from 'firebase/auth';
import PoliciesContainer from '@/components/screens/infoUser/policies';
import PersonalInformation from '@/components/screens/infoUser/personalInfo';


const InfoUser = () => {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const auth = getAuth();
  const userLogin = auth.currentUser;
  var profileImageUrl = "";

  const [imageLoaded, setImageLoaded] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }


  const handleLogout = async () => {
    await logout();
  }



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect : [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
       setModalVisible(false);
       profileImageUrl = await updateImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId), user?.userId, setIsUploading, setProgress).catch((error)=>{
         Alert.alert('Error', 'Failed to upload image');
       });
      updateUser({ profileImageUrl: profileImageUrl });
    }
  };

  const pickImagewithCamera = async () => {
    try{
      await ImagePicker.requestCameraPermissionsAsync();
    }catch(err){
      console.log(err);
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect : [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setModalVisible(false);
       profileImageUrl = await updateImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId), user?.userId, setIsUploading, setProgress);
      updateUser({ profileImageUrl: profileImageUrl });
    }
  }


  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <CustomKeyboardView>
      <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: COLORS.greenWhite}}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}/>
        }>
        <View style ={{paddingTop : hp(7), paddingHorizontal: wp(5), backgroundColor: COLORS.greenWhite}} className='flex-1 gap-12'>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <TouchableOpacity onPress={() => router.push('/home')} style={{flexDirection:"row"}}>
              <Ionicons name="chevron-back" size={SIZES.xLarge} color="black"/>
              <Text style={{fontSize:SIZES.large, textDecorationLine:'underline'}}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems:'center'}}>
            <View>
                <ProfilImage imageState={imageLoaded} source={user?.profileImageUrl} style={styles.profileImage}  setImageState={setImageLoaded}/>
              <TouchableOpacity style={{backgroundColor: COLORS.lightWhite, borderRadius: 24, position: 'absolute', right: 5, bottom: 5, padding: 8}} 
                onPress={() => setModalVisible(true)}>
                  <Ionicons name="camera" size={24} color={COLORS.greenForest}/>
              </TouchableOpacity> 
              <Modal
                animationType="slide"
                transparent={true}
                visible={isUploading}
                onRequestClose={() => {
                    setIsUploading(false);
                }}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                        <Text>Uploading Image: {Math.round(progress)}%</Text>
                        <ProgressBar progress={progress/100} color= {COLORS.darkGreen} />
                    </View>
                </View>
            </Modal>
            </View>
            <Text style={styles.username}>{ user?.username|| 'Not specified'}</Text>
          </View>

          <PersonalInformation user={user} sendPasswordResetEmail={handlePasswordReset} userLogin={userLogin}/>
          <PoliciesContainer/>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.textInLogoutButton}>Logout</Text>
          </TouchableOpacity>

        </View>
        <UploadModal
          modalVisible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={() => pickImagewithCamera()}
          onGalleryPress={() => pickImage()}
        />
      </ScrollView>
    </CustomKeyboardView>

  );
};

export default InfoUser;
