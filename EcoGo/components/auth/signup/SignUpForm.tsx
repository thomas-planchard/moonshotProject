import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '@/components/common/Loading';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { typeOfCars, sizeOfCars } from '@/constants/index';
import styles from './signup.style';

interface SignUpFormProps {
  emailRef: React.MutableRefObject<string>;
  passwordRef: React.MutableRefObject<string>;
  confirmPasswordRef: React.MutableRefObject<string>;
  usernameRef: React.MutableRefObject<string>;
  image: string | null;
  setImage: (image: string | null) => void;
  carType: string | null;
  setCarType: (type: string | null) => void;
  carSize: string | null;
  setCarSize: (size: string | null) => void;
  setConsumption: (consumption: string) => void;
  passwordError: boolean;
  setPasswordError: (error: boolean) => void;
  emailError: boolean;
  handleRegister: () => void;
  loading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  emailRef,
  passwordRef,
  confirmPasswordRef,
  usernameRef,
  image,
  setImage,
  carType,
  setCarType,
  carSize,
  setCarSize,
  setConsumption,
  passwordError,
  setPasswordError,
  emailError,
  handleRegister,
  loading
}) => {
    
  const [carTypeModalVisible, setCarTypeModalVisible] = useState(false);
  const [carSizeModalVisible, setCarSizeModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const openPickerCarType = () => {
    setCarTypeModalVisible(true);
  };

  const openPickerCarSize = () => {
    setCarSizeModalVisible(true);
  };

  const closePickerCarType = () => {
    setCarTypeModalVisible(false);
  };

  const closePickerCarSize = () => {
    setCarSizeModalVisible(false);
  };

  const checkPasswordsMatch = () => {
    if (passwordRef.current !== confirmPasswordRef.current) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  return (
    <View style={{paddingTop: hp(2)}} className="gap-10">
      <View className="gap-5">
        <View style={styles.inputContainer} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <Feather name="user" size={hp(2.7)} color="grey" />
          <TextInput
            onChangeText={(value) => (usernameRef.current = value)}
            style={{ fontSize: hp(2) }}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Username"
            placeholderTextColor="grey"
            autoComplete="name"
          />
        </View>
        <View style={[ styles.inputContainer,{borderColor: emailError ? 'red' : 'transparent',borderWidth: 1} ]} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <Octicons name="mail" size={hp(2.7)} color="grey" />
          <TextInput
            onChangeText={(value) => (emailRef.current = value)}
            style={{ fontSize: hp(2) }}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Email address"
            placeholderTextColor="grey"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>
        {emailError && (
          <Text style={styles.errorMessage}>
            Invalid email address.
          </Text>
        )}
        <View style={styles.inputContainer} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <Octicons name="lock" size={hp(2.7)} color="grey" />
          <TextInput
            onChangeText={(value) => (passwordRef.current = value)}
            style={{ fontSize: hp(2) }}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            placeholderTextColor="grey"
            onBlur={checkPasswordsMatch}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Octicons name={showPassword ? "eye" : "eye-closed"} size={hp(2.7)} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={[styles.inputContainer, {borderColor: passwordError ? 'red' : 'transparent', borderWidth: 1 }]} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
          <Octicons name="lock" size={hp(2.7)} color="grey" />
          <TextInput
            onChangeText={(value) => (confirmPasswordRef.current = value)}
            style={{ fontSize: hp(2) }}
            className="flex-1 font-semibold text-neutral-700"
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            placeholderTextColor="grey"
            onBlur={checkPasswordsMatch}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Octicons name={showConfirmPassword ? "eye" : "eye-closed"} size={hp(2.7)} color="grey" />
          </TouchableOpacity>
        </View>
        {passwordError && (
          <Text style={styles.errorMessage}>
            Passwords do not match.
          </Text>
        )}
        <TouchableOpacity
          style={styles.inputContainer}
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
        <TouchableOpacity style={styles.inputContainer} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl" onPress={openPickerCarType}>
          <MaterialCommunityIcons name="car-info" size={hp(2.7)} color="grey" />
          <Text style={{ fontSize: hp(2), color: carType == null ? "grey" : "black" }} className="flex-1 font-semibold">{carType == null ? "Select Car Type" : carType}</Text>
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

        {/* Conditionally render car size picker if carType is not "No car" */}
        {carType !== "No Car" && (
          <TouchableOpacity style={styles.inputContainer} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl" onPress={openPickerCarSize}>
            <MaterialCommunityIcons name="car-multiple" size={hp(2.7)} color="grey" />
            <Text style={{ fontSize: hp(2), color: carSize == null ? "grey" : "black" }} className="flex-1 font-semibold">{carSize == null ? "Select Car Size" : carSize}</Text>
          </TouchableOpacity>
        )}
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
          <View style={styles.inputContainer} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
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
        ) : null}

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
      </View>
    </View>
  );
};

export default SignUpForm;