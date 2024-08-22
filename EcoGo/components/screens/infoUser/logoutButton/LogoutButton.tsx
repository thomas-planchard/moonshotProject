import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import styles from './logoutbutton.style';

const LogoutButton= () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Text style={styles.textInLogoutButton}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;