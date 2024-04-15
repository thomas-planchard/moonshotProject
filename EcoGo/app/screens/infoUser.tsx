import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';


const InfoUser = () => {
  const {logout,user} = useAuth();
  const handleLogout = async () => {
    await logout();
  }

  const router = useRouter();


  return (
    <View style={styles.container}>
      <Button title="Sign out" onPress={handleLogout} />
      <Button title="Go to home" onPress={() => router.push('/home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F8',
  },
  info: {
    fontSize: 16, 
    marginBottom: 10,
  },
});

export default InfoUser;
