import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
// Assume you have initialized Firebase elsewhere in your project

const InfoUser = () => {
  const {logout,user} = useAuth();
  const handleLogout = async () => {
    await logout();
  }
  console.log('InfoUser', user);

  return (
    <View style={styles.container}>
      <Button title="Sign out" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F8', // Use theme colors if defined
  },
  info: {
    fontSize: 16, // Use theme sizes if defined
    marginBottom: 10,
    // Apply other styling as needed, using theme if applicable
  },
  // Add styles for other elements
});

export default InfoUser;
