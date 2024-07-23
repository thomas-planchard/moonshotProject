import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert, Modal, StyleSheet, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/common/Loading';
import CustomKeyboardView from '@/components/common/CustomKeyboardView';
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import { typeOfCars, sizeOfCars } from '@/constants/index';
import { Picker } from '@react-native-picker/picker';


export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const usernameRef = useRef("");

  const [image, setImage] = useState(null);
  const [carTypeModalVisible, setCarTypeModalVisible] = useState(false);
  const [carSizeModalVisible, setCarSizeModalVisible] = useState(false);
  const [consumption, setConsumption] = useState("");
  const [carType, setCarType] = useState(null);
  const [carSize, setCarSize] = useState(null);

  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const openPickerCarType = () => {
    setCarTypeModalVisible(true);
  }
  const openPickerCarSize = () => {
    setCarSizeModalVisible(true);
  }

  const closePickerCarType = () => {
    setCarTypeModalVisible(false);
  }

  const closePickerCarSize = () => {
    setCarSizeModalVisible(false);
  }

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
    if (
      !emailRef.current || 
      !passwordRef.current || 
      !confirmPasswordRef.current || 
      !usernameRef.current || 
      image == null ||
      (carType === 'fuel' && !consumption)
    ) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    if (passwordRef.current !== confirmPasswordRef.current) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
    setLoading(true);

    const userData = {
      carType,
      carSize,
      consumption: carType === "electric" ? null : consumption
    };

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, image, userData);

    setLoading(false);

    Alert.alert('got result: ', response);

    if (!response.sucess) {
      console.log('Sign Up', response.message);
    }
  };

  const checkPasswordsMatch = () => {
    if (passwordRef.current !== confirmPasswordRef.current) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <ScrollView style={{ paddingTop: hp(7), paddingHorizontal: wp(5), height: hp(120) , backgroundColor:'white' }} className="flex-1 gap-12">
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
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="lock" size={hp(2.7)} color="grey" />
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Password"
                secureTextEntry={!showPassword}
                autoComplete='new-password'
                placeholderTextColor="grey"
                onBlur={checkPasswordsMatch}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Octicons name={showPassword ? "eye" : "eye-closed"} size={hp(2.7)} color="grey" />
              </TouchableOpacity>
            </View>
            <View style={{ height: hp(7), borderColor: passwordError ? 'red' : 'transparent', borderWidth: 1 }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="lock" size={hp(2.7)} color="grey" />
              <TextInput
                onChangeText={(value) => (confirmPasswordRef.current = value)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                autoComplete='new-password'
                placeholderTextColor="grey"
                onBlur={checkPasswordsMatch}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Octicons name={showConfirmPassword ? "eye" : "eye-closed"} size={hp(2.7)} color="grey" />
              </TouchableOpacity>
            </View>
            {passwordError && (
              <Text style={{ color: 'red', fontSize: hp(1.5), marginLeft: wp(2) }}>
                Passwords do not match.
              </Text>
            )}
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

            {/* Car Type */}
            <TouchableOpacity style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl" onPress={openPickerCarType}>
              <MaterialCommunityIcons name="car-info" size={hp(2.7)} color="grey" />
              <Text style={{ fontSize: hp(2), color: carType==null? "grey": "black" }} className="flex-1 font-semibold">{carType==null? "Select Car Type": carType}</Text>
            </TouchableOpacity>
            {carTypeModalVisible && (
              <Modal
                transparent={true}
                animationType="fade" 
                visible={carTypeModalVisible}
                onRequestClose={closePickerCarType}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <Picker
                      selectedValue={carType}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setCarType(itemValue);
                        closePickerCarType();
                      }}
                    >
                      {typeOfCars.map((car) => (
                        <Picker.Item key={car.value} label={car.label} value={car.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            )}
            {/* Car Size */}
            <TouchableOpacity style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl" onPress={openPickerCarSize}>
              <MaterialCommunityIcons name="car-multiple" size={hp(2.7)} color="grey" />
              <Text style={{ fontSize: hp(2), color: carSize==null? "grey": "black" }} className="flex-1 font-semibold">{carSize==null? "Select Car Size": carSize}</Text>
            </TouchableOpacity>
            {carSizeModalVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={carSizeModalVisible}
                onRequestClose={closePickerCarSize}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <Picker
                      selectedValue={carSize}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setCarSize(itemValue);
                        closePickerCarSize();
                      }}
                    >
                      {sizeOfCars.map((size) => (
                        <Picker.Item key={size.value} label={size.label} value={size.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </Modal>
            )}
            {/* Car Consumption (only for fuel cars) */}
            {carType === "Fuel" || carType === "Gazoil" ? (
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                <MaterialCommunityIcons name="fuel" size={hp(2.7)} color="grey" />
                <TextInput
                  onChangeText={(value) => setConsumption(value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Consumption (L/km)"
                  placeholderTextColor="grey"
                  keyboardType="numeric"
                />
              </View>
            ):null}

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
              <Pressable onPress={() => router.push('/SignIn')}>
                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-green-400">
                  Sign in
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </CustomKeyboardView>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: wp(60),
    height: hp(5),
    marginBottom: hp(20),
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 20,
    padding: 20,
  
  },
});