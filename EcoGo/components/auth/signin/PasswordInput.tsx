import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface PasswordInputProps {
    passwordRef: React.MutableRefObject<string>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

const PasswordInput: React.FC<PasswordInputProps> = ({ passwordRef, showPassword, setShowPassword }) => {
  return (
    <View className='gap-3'>
      <View style={{ height: hp(7) }} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
        <Octicons name="lock" size={hp(2.7)} color="grey" />
        <TextInput
          onChangeText={(value) => passwordRef.current = value}
          style={{ fontSize: hp(2) }}
          className='flex-1 font-semibold text-neutral-700'
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor="grey"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Octicons name={showPassword ? "eye" : "eye-closed"} size={hp(2.7)} color="grey" />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: hp(1.8) }} className='font-semibold text-right text-neutral-500'>Forgot password?</Text>
    </View>
  );
};

export default PasswordInput;