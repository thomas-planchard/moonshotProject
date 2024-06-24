import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  
  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current || image == null) {
        Alert.alert('Error', 'Please fill all the fields');
        return;
    }
    setLoading(true);
    

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, image);

    setLoading(false);

    console.log('got result: ', response);

    if(!response.sucess){
        Alert.alert('Sign Up', response.message);
    }

};

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
        <View className="items-center">
          <Image source={require('../assets/images/register.jpg')} resizeMode="contain" style={{ height: hp(20), alignSelf: 'center' }} />
        </View>

        <View className="gap-10">
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
            Sign Up
          </Text>

          {/* Inputs */}
          <View className="gap-5">
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Feather name="user" size={hp(2.7)} color="grey" />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Username"
                placeholderTextColor="grey"
                autoComplete='name'
              />
            </View>
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="lock" size={hp(2.7)} color="grey" />
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Password"
                secureTextEntry
                autoComplete='new-password'
                placeholderTextColor="grey"
              />
            </View>
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="mail" size={hp(2.7)} color="grey" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email address"
                placeholderTextColor="grey"
                autoCapitalize='none'
                autoComplete='email'
              />
            </View>
            <TouchableOpacity
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
              onPress={pickImage}
            >
              <Image
                source={{ uri: image || 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1' }}
                style={{ height: hp(5), width: wp(10), borderRadius: 100 }}
              />
              <Text style={{ fontSize: hp(2), color: 'grey' }} className="flex-1 font-semibold">
                {image ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{ height: hp(6.5) }}
                  className="bg-green-400 rounded-xl justify-center items-center"
                >
                  <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                    Sign up
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign In Text */}
            <View className="flex-row justify-center">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/signIn')}>
                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-green-400">
                  Sign in
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}