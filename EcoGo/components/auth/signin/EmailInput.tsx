import React from 'react';
import { View, TextInput } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface EmailInputProps {
    emailRef: React.MutableRefObject<string>;
  }

const EmailInput: React.FC<EmailInputProps> = ({ emailRef }) => {
  return (
    <View style={{ height: hp(7) }} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
      <Octicons name="mail" size={hp(2.7)} color="grey" />
      <TextInput
        onChangeText={(value) => emailRef.current = value}
        style={{ fontSize: hp(2) }}
        className='flex-1 font-semibold text-neutral-700'
        placeholder="Email address"
        placeholderTextColor="grey"
        autoCapitalize='none'
        autoComplete='email'
      />
    </View>
  );
};

export default EmailInput;