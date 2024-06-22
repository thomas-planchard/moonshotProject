import { View, Text, Button, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchingUserNameAndProfileImage } from "@/utils/dataProcessing/fetchingUserNameAndProfileImage";
import  styles  from '../../components/screens/infoUser.style.ts';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import UploadModal from "@/utils/modal/uploadModal";
import { uploadImageToFirebase, generateImagePath } from '@/utils/dataProcessing/uploadImageToFirebase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/authContext';
import { SIZES, COLORS } from '@/constants/theme.ts';
import { getAuth } from 'firebase/auth';


const InfoUser = () => {
  const { user, logout } = useAuth();
  const auth = getAuth();
  const userLogin = auth.currentUser;
  const [image, setImage] = useState(null);
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
      uploadImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId));
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
      uploadImageToFirebase(result.assets[0].uri, generateImagePath(user?.userId));
    }
  }

  const removeImage = async () => {
    uploadImageToFirebase('https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg', generateImagePath(user?.userId));
  }

  console.log('image: ', generateImagePath(user?.userId));

  return (
    <CustomKeyboardView>
      <ScrollView
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
              source={{ uri: user?.profileImageUrl || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={{backgroundColor: COLORS.lightWhite, borderRadius: 24, position: 'absolute', right: 5, bottom: 5, padding: 8}} onPress={() => setModalVisible(true)}>
                <Ionicons name="camera" size={24} color={COLORS.greenForest}/>
            </TouchableOpacity> 
          </View>
          <Text style={styles.username}>{ user?.username|| 'Not specified'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email: {userLogin?.email}</Text>
       
          <Text style={styles.infoLabel}>Password: {userLogin?.uid} </Text>
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
