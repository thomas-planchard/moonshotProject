import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SignUpFooter= () => {
  const router = useRouter();

  return (
    <View style={{paddingTop: hp(2)}} className="flex-row justify-center">
      <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
        Already have an account?{' '}
      </Text>
      <Pressable onPress={() => router.push('/SignIn')}>
        <Text style={{ fontSize: hp(1.8) }} className="font-bold text-green-400">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export default SignUpFooter;