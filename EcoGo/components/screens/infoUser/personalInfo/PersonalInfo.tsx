import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EditProfileModal from '@/components/screens/infoUser/editProfileModal/EditProfileComponent'; 
import { COLORS } from '@/constants';
import { getAuth, sendPasswordResetEmail, Auth } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import styles from './personalinfo.style';


const PersonalInformation = () => {
    const auth = getAuth();
    const userLogin = auth.currentUser;
    const { user } = useAuth();   

  const [editModalVisible, setEditModalVisible] = useState(false);

  const handlePasswordReset = async (auth: Auth, email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert('Error', 'Failed to send password reset email');
    }
  };


    return (
        <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
            <Text style={styles.tittleText}>Personal Information</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            </View>
            <View className='gap-4'>
            <View  style={styles.inputContainer} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                        <Octicons name= "mail" size={hp(2.7)} color={COLORS.greenForest} />
                        <TextInput
                        editable={false}
                        style={styles.inputStyle} 
                        className='flex-1 font-semibold text-neutral-400'
                        placeholder={userLogin?.email || 'Not specified'} 
                        inputMode='email'
                        placeholderTextColor={"grey"}>
                        </TextInput>
            </View>
            <View style={styles.inputContainer} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                <Octicons name="person" size={hp(2.7)} color={COLORS.greenForest} />
                <TextInput
                    editable={false}
                    style={styles.inputStyle} 
                    className='flex-1 font-semibold text-neutral-400'
                    placeholder={user?.username || 'Not specified'} 
                    placeholderTextColor={"grey"}>
                </TextInput>
            </View>
            <View style={styles.inputContainer} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl'>
                <Octicons name="key" size={hp(2.7)} color={COLORS.greenForest} />
                <TouchableOpacity
                    onPress={() => {
                        handlePasswordReset(auth, user?.email || '')
                            .then(() => {
                                Alert.alert("Password Reset Email Sent", "Please check your email for instructions to reset your password.");
                            })
                            .catch((error) => {
                                Alert.alert("Error", error.message);
                            });
                    }}
                >
                    <Text style={styles.resetPasswordText}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
        <EditProfileModal
        modalVisible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        user={user}
      />
    </View>
    );
}

export default PersonalInformation;