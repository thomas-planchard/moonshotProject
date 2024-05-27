import { View, Text, Button, Image, TouchableOpacity, RefreshControl, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import  styles  from '../../components/screens/infoUser.style.ts';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import UploadModal from "@/utils/modal/uploadModal";
import { uploadImageToFirebase, generateImagePath, updateImageToFirebase } from '@/utils/dataProcessing/uploadImageToFirebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/authContext';
import { SIZES, COLORS } from '@/constants/theme.ts';
import { getAuth } from 'firebase/auth';
import { Octicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';


const InfoUser = () => {
  const { user, logout } = useAuth();
  const auth = getAuth();
  const userLogin = auth.currentUser;
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

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
      
      updateImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId), user?.userId);
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
      updateImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId), user?.userId);
    }
  }

  const removeImage = async () => {
    updateImageToFirebase('https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg', generateImagePath(user?.userId), user?.userId);
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
      style={{backgroundColor: COLORS.greenWhite, height: hp(100)}}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}/>
        }>
      <View style ={{paddingTop : hp(7), paddingHorizontal: wp(5), backgroundColor: COLORS.greenWhite , height:hp(100)}} className='flex-1 gap-12'>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <TouchableOpacity onPress={() => router.push('/home')} style={{flexDirection:"row"}}>
            <Ionicons name="chevron-back" size={SIZES.xLarge} color="black"/>
            <Text style={{fontSize:SIZES.large, textDecorationLine:'underline'}}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center'}}>
          <View>
              <Image
                source={{ uri: imageLoaded ? user?.profileImageUrl : 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }}
                onLoadEnd={() => setImageLoaded(true)}
                style={styles.profileImage}
              />
            <TouchableOpacity style={{backgroundColor: COLORS.lightWhite, borderRadius: 24, position: 'absolute', right: 5, bottom: 5, padding: 8}} onPress={() => setModalVisible(true)}>
                <Ionicons name="camera" size={24} color={COLORS.greenForest}/>
            </TouchableOpacity> 
          </View>
          <Text style={styles.username}>{ user?.username|| 'Not specified'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Personal Information</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View className='gap-4'>
          <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Octicons name= "mail" size={hp(2.7)} color={COLORS.greenForest} />
                        <TextInput
                        editable={false}
                        style={{fontSize: hp(2)}} 
                        className='flex-1 font-semibold text-neutral-400'
                        placeholder={userLogin?.email || 'Not specified'} 
                        inputMode='email'
                        placeholderTextColor={"grey"}>
                        </TextInput>
            </View>
              <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                <Octicons name="lock" size={hp(2.7)} color={COLORS.greenForest} />
                <TextInput
                  style={{fontSize: hp(2)}} 
                  className='flex-1 font-semibold text-neutral-400'
                  placeholder="Enter your email" 
                  placeholderTextColor={"grey"}
                  onChangeText={text => setEmail(text)}
                  value={userLogin?.email}
                />
                <Button
                  title="Reset Password"
                  onPress={handlePasswordReset}
                />
              </View>
            </View>
        </View>

        <Button title="Sign out" onPress={handleLogout} style={styles.logoutButton} />
      </View>
      <UploadModal
        modalVisible={modalVisible}
        onBackPress={() => setModalVisible(false)}
        onCameraPress={() => pickImagewithCamera()}
        onGalleryPress={() => pickImage()}
        onRemovePress={() => removeImage()}
      />
      </ScrollView>
    </CustomKeyboardView>

  );
};

export default InfoUser;
