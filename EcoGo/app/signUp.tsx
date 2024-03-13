import {View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert} from 'react-native';
import React, { useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading/loading';


export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profilerRef = useRef("");



    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profilerRef.current) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        //register process
    };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <View style ={{paddingTop : hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        <View className='items-center'>
            <Image source={require('../assets/images/register.jpg')} resizeMode='contain' style={{height: hp(20), alignSelf: 'center'}} />
        </View>



        <View className='gap-10'>
          <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-800 '>Sign Up</Text>
          {/* inputs  */}
          <View className='gap-5'>
                <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                    <Feather name= "user" size={hp(2.7)} color="grey" />
                    <TextInput 
                    onChangeText={value=>usernameRef.current=value}
                    style={{fontSize: hp(2)}} 
                    className='flex-1 font-semibold text-neutral-700'
                    placeholder="Username" 
                    placeholderTextColor={"grey"} />
                </View>
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
                <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                    <Octicons name= "mail" size={hp(2.7)} color="grey" />
                    <TextInput 
                    onChangeText={value=>emailRef.current=value}
                    style={{fontSize: hp(2)}} 
                    className='flex-1 font-semibold text-neutral-700'
                    placeholder="Email address" 
                    placeholderTextColor={"grey"} />
                </View>
                <View  style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                    <Feather name= "image" size={hp(2.7)} color="grey" />
                    <TextInput 
                    onChangeText={value=>profilerRef.current=value}
                    style={{fontSize: hp(2)}} 
                    className='flex-1 font-semibold text-neutral-700'
                    placeholder="Profile url" 
                    placeholderTextColor={"grey"} />
                </View>

                {/* submit button */}
                <View>
                    {
                        loading?(
                            <View className='flex-row justify-center'>
                                <Loading size={hp(8)} />
                            </View>

                        ):(
                            <TouchableOpacity onPress={handleRegister} style={{height: hp(6.5)}} className="bg-green-400 rounded-xl justify-center items-center">
                                <Text 
                                style={{fontSize: hp(2.7)}}
                                className='text-white font-bold tracking-wider'
                                >Sign up
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
             

                {/* sign up text  */}
                <View className='flex-row justify-center'>
                    <Text style = {{fontSize: hp(1.8)}} className='font-semibold text-neutral-500'>Already have an account? </Text>
                    <Pressable onPress={() => router.push('/signIn')}>
                        <Text style={{fontSize: hp(1.8)}} className='font-bold text-green-400'>Sign in</Text>
                    </Pressable>
                </View>
           </View>
        </View>
       </View>
    </View>
  );
}