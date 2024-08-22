import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '@/components/common/Loading';

interface SubmitButtonProps {
    loading: boolean;
    handleLogin: () => void;
  }
  

const SubmitButton: React.FC<SubmitButtonProps>  = ({ loading, handleLogin }) => {
  return (
    <View>
      {loading ? (
        <View className='flex-row justify-center'>
          <Loading size={hp(8)} />
        </View>
      ) : (
        <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5) }} className="bg-green-400 rounded-xl justify-center items-center">
          <Text style={{ fontSize: hp(2.7) }} className='text-white font-bold tracking-wider'>
            Sign in
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SubmitButton;