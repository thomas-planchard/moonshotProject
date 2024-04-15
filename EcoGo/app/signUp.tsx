import {View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert} from 'react-native';
import React, { useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';



export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {register} = useAuth();
    const [selectedImageUri, setSelectedImageUri] = useState(null);

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profilerRef = useRef("");



    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profilerRef.current) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        setLoading(true);

        try {
            // Upload image first
            const storage = getStorage();
            const storageRef = sRef(storage, `profileImages/${new Date().getTime()}`);
            const imgBlob = await fetch(profilerRef.current).then((r) => r.blob());
            const snapshot = await uploadBytes(storageRef, imgBlob);
            const downloadURL = await getDownloadURL(snapshot.ref);
        
            // Now proceed with user registration
            let response = await register(emailRef.current, passwordRef.current, usernameRef.current, downloadURL);
        
            if (!response.success) {
              Alert.alert('Sign Up', response.message);
              return;
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Upload Error', 'Error during the sign-up process.');
          } finally {
            setLoading(false);
          }
    };

    const handleImageSelection = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access gallery is required!");
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true, // Allow basic editing before finalizing
            aspect: [4, 3], // Aspect ratio to maintain during editing
            quality: 1, // Keep full quality of the image
        });
        if (!pickerResult.cancelled) {
            setSelectedImageUri(pickerResult.uri);
            profilerRef.current = pickerResult.uri;
        }
    };

  return (
    <CustomKeyboardView>
        <StatusBar style="dark" />
        <View style ={{paddingTop : hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
            <View className='items-center'>
                <Image source={require('../assets/images/register.jpg')} resizeMode='contain' style={{height: hp(20), alignSelf: 'center'}} />
            </View>


            <View className='gap-10'>
            <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-800 '>Sign Up</Text>
            {/* inputs  */}
            <View className='gap-5'>
                    <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Feather name= "user" size={hp(2.7)} color="grey" />
                        <TextInput 
                        onChangeText={value=>usernameRef.current=value}
                        style={{fontSize: hp(2)}} 
                        className='flex-1 font-semibold text-neutral-700'
                        placeholder="Username" 
                        placeholderTextColor={"grey"} />
                    </View>
                    <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Octicons name= "lock" size={hp(2.7)} color="grey" />
                        <TextInput 
                        onChangeText={value=>passwordRef.current=value}
                        style={{fontSize: hp(2)}} 
                        className='flex-1 font-semibold text-neutral-700'
                        placeholder="Password" 
                        secureTextEntry={true}
                        placeholderTextColor={"grey"} />
                    </View>
                    <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Octicons name= "mail" size={hp(2.7)} color="grey" />
                        <TextInput 
                        onChangeText={value=>emailRef.current=value}
                        style={{fontSize: hp(2)}} 
                        className='flex-1 font-semibold text-neutral-700'
                        placeholder="Email address" 
                        placeholderTextColor={"grey"} />
                    </View>
                    <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Feather name="image" size={hp(2.7)} color="grey" />
                        <TouchableOpacity onPress={handleImageSelection} style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700'>
                                {selectedImageUri ? 'Image Selected' : 'Select Profile Image'}
                            </Text>
                            {selectedImageUri && <Image source={{ uri: selectedImageUri }} style={{ width: 40, height: 40, borderRadius: 20 }} />}
                        </TouchableOpacity>
                    </View>

                    {/* submit button */}
                    <View>
                        {
                            loading?(
                                <View className='flex-row justify-center'>
                                    <Loading size={hp(8)} />
                                </View>

                            ):(
                                <TouchableOpacity onPress={handleRegister} style={{height: hp(6.5)}} className="bg-green-400 rounded-xl justify-center items-center">
                                    <Text 
                                    style={{fontSize: hp(2.7)}}
                                    className='text-white font-bold tracking-wider'
                                    >Sign up
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                

                    {/* sign up text  */}
                    <View className='flex-row justify-center'>
                        <Text style = {{fontSize: hp(1.8)}} className='font-semibold text-neutral-500'>Already have an account? </Text>
                        <Pressable onPress={() => router.push('/signIn')}>
                            <Text style={{fontSize: hp(1.8)}} className='font-bold text-green-400'>Sign in</Text>
                        </Pressable>
                    </View>
            </View>
            </View>
        </View>
    </CustomKeyboardView>
  );
}