import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SignUpPromptProps {
  router: Router;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ router }) => {
  return (
    <View className='flex-row justify-center'>
      <Text style={{ fontSize: hp(1.8) }} className='font-semibold text-neutral-500'>Don't have an account? </Text>
      <Pressable onPress={() => router.push('/SignUp')}>
        <Text style={{ fontSize: hp(1.8) }} className='font-bold text-green-400'>Sign up</Text>
      </Pressable>
    </View>
  );
};

export default SignUpPrompt;