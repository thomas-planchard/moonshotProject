import { useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';



const StartPage = () => {
	
	return (
	<View className="flex-1 justify-center">
	  <ActivityIndicator size ="large" color="grey">
	  </ActivityIndicator>					
	</View>
  );
};

export default StartPage;

