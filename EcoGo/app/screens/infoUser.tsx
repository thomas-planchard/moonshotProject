import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import  styles  from '../../components/screens/infoUser.style.ts';

const InfoUser = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
        <Button title="Home" onPress={() => router.push('/home')} />
      </View>

      <Image
        source={{ uri: user.photoURL || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }}
        style={styles.profileImage}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email: {user.email}</Text>
        <Text style={styles.infoLabel}>Username: {user.displayName || 'Not specified'}</Text>
        <Text style={styles.infoLabel}>Password: ••••••••</Text>
      </View>

      <Button title="Sign out" onPress={handleLogout} style={styles.logoutButton} />
    </View>
  );
};

export default InfoUser;
