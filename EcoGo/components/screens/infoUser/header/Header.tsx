import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SIZES } from '@/constants/theme';
import styles from './header.style';

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/home')} style={{ flexDirection: 'row' }}>
        <Ionicons name="chevron-back" size={SIZES.xLarge} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Profile</Text>
    </View>
  );
};

export default Header;