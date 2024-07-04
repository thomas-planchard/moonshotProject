import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SIZES, COLORS } from '@/constants/theme';

const ConnectionCheck = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const netInfo = useNetInfo();
  const navigation = useNavigation();

  useEffect(() => {
    const checkConnection = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
      setIsInternetReachable(networkState.isInternetReachable);
    };

    checkConnection();
  }, [netInfo]);

  if (!isConnected || !isInternetReachable) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/no-connection.png')} 
          style={styles.image}
        />
        <Text style={styles.text}>Sorry, you don't have enough internet connection.</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.greenWhite,
  },
  image: {
    width: wp(80),
    height: hp(40),
    resizeMode: 'cover',
  },
  text: {
    fontSize: SIZES.large,
    color: "black",
    textAlign: 'center',
  },
});

export default ConnectionCheck;