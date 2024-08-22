import React from 'react';
import { View, Image, Text } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SignUpHeader = () => {
  return (
    <View className="items-center">
      <Image source={require('@/assets/images/register.jpg')} resizeMode="contain" style={{ height: hp(20), alignSelf: 'center' }} />
      <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
        Sign Up
      </Text>
    </View>
  );
};

export default SignUpHeader;