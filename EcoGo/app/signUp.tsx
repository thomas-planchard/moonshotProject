import {View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert} from 'react-native';
import React, { useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading/loading';


export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const emailRef = useRef("");
    const passwordRef = useRef("");


    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }
        //login process
    };

  return (
    <View>
      <StatusBar style="dark" />
      <View>
        <View>
            <Image source={require('../assets/images/register.jpg')} style={{width: wp('50%'), height: hp('20%'), alignSelf: 'center'}} />
        </View>



        <View>
          <Text style={{fontSize: hp(4)}}>Sign in</Text>
          {/* inputs  */}
          <View>
                <View style={{height: hp(7)}}>
                    <Octicons name= "mail" size={hp(2.7)} color="grey" />
                    <TextInput 
                    onChangeText={value=>emailRef.current=value}
                    style={{fontSize: hp(2)}} 
                    placeholder="Email address" 
                    placeholderTextColor={"grey"} />
                </View>
                <View>
                    <View style={{height: hp(7)}}>
                        <Octicons name= "lock" size={hp(2.7)} color="grey" />
                        <TextInput 
                        onChangeText={value=>passwordRef.current=value}
                        style={{fontSize: hp(2)}} 
                        placeholder="Password" 
                        secureTextEntry={true}
                        placeholderTextColor={"grey"} />
                    </View>
                    <Text style={{alignSelf: 'flex-end', color: 'blue', fontSize: hp(1.8)}}>Forgot password?</Text>
                </View>

                {/* submit button */}
                <View>
                    {
                        loading?(
                            <View>
                                <Loading size={hp(5.5)} />
                            </View>

                        ):(
                            <TouchableOpacity onPress={handleRegister}>
                                <Text 
                                style={{backgroundColor: 'blue', color: 'white', fontSize: hp(2.5), padding: hp(1), textAlign: 'center', borderRadius: hp(1)}}
                                >Sign in
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
             

                {/* sign up text  */}
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: hp(2)}}>
                    <Text style = {{fontSize: hp(1.8)}}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push('/signUp')}>
                        <Text style={{fontSize: hp(1.8), color: 'blue', marginLeft: wp(1)}}>Sign up</Text>
                    </Pressable>
                </View>
           </View>
        </View>
       </View>
    </View>
  );
}