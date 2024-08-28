import React, { useRef, useState } from 'react';
import { View, Image, Alert, StatusBar, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '@/components/common/CustomKeyboardView';
import { useAuth } from '@/context/AuthContext';
import EmailInput from '@/components/auth/signin/EmailInput';
import PasswordInput from '@/components/auth/signin/PasswordInput';
import SubmitButton from '@/components/auth/signin/SubmitButton';
import SignUpPrompt from '@/components/auth/signin/SignUpPrompt';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert('Sign In Error', response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5), backgroundColor: 'white', height: hp(100) }} className='flex-1 gap-12'>
        <View className='items-center'>
          <Image source={require('../assets/images/login.png')} resizeMode='contain' style={{ height: hp(30), alignSelf: 'center' }} />
        </View>
        <View className='gap-10'>
          <Text style={{ fontSize: hp(4) }} className='font-bold tracking-wider text-center text-neutral-800'>Sign in</Text>

          <View className='gap-5'>
            <EmailInput emailRef={emailRef} />
            <PasswordInput passwordRef={passwordRef} showPassword={showPassword} setShowPassword={setShowPassword} />
            <SubmitButton loading={loading} handleLogin={handleLogin} />
            <SignUpPrompt router={router} />
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}