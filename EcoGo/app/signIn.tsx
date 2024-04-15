import {View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert} from 'react-native';
import React, { useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '@/context/authContext';


export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();

    const emailRef = useRef("");
    const passwordRef = useRef("");


    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        setLoading(true);
        const response = await login(emailRef.current, passwordRef.current);
        setLoading(false);
        if (!response.sucess) {
            Alert.alert('Sign In Erreur', response.msg);
        }
    };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style ={{paddingTop : hp(8), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        <View className='items-center'>
            <Image source={require('../assets/images/login.png')} resizeMode='contain' style={{height: hp(30), alignSelf: 'center'}} />
        </View>



        <View className='gap-10'>
          <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-800 '>Sign in</Text>
          {/* inputs  */}
          <View className='gap-5'>
                <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                    <Octicons name= "mail" size={hp(2.7)} color="grey" />
                    <TextInput 
                    onChangeText={value=>emailRef.current=value}
                    style={{fontSize: hp(2)}} 
                    className='flex-1 font-semibold text-neutral-700'
                    placeholder="Email address" 
                    placeholderTextColor={"grey"} />
                </View>
                <View className='gap-3'>
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
                    <Text style={{fontSize: hp(1.8)}} className='font-semibold text-right text-neutral-500'>Forgot password?</Text>
                </View>

                {/* submit button */}
                <View>
                    {
                        loading?(
                            <View className='flex-row justify-center'>
                                <Loading size={hp(8)} />
                            </View>

                        ):(
                            <TouchableOpacity onPress={handleLogin} style={{height: hp(6.5)}} className="bg-green-400 rounded-xl justify-center items-center">
                                <Text 
                                style={{fontSize: hp(2.7)}}
                                className='text-white font-bold tracking-wider'
                                >Sign in
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
             

                {/* sign up text  */}
                <View className='flex-row justify-center'>
                    <Text style = {{fontSize: hp(1.8)}} className='font-semibold text-neutral-500'>Don't have an account? </Text>
                    <Pressable onPress={() => router.push('/signUp')}>
                        <Text style={{fontSize: hp(1.8)}} className='font-bold text-green-400'>Sign up</Text>
                    </Pressable>
                </View>
           </View>
        </View>
       </View>
    </CustomKeyboardView>
  );
}