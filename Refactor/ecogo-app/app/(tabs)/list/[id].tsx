import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

const NewsDetailsPage = () => {
	const { id } = useLocalSearchParams();

	return (
		<View>
			<Stack.Screen options={{ headerTitle: `News #${id}` }} />

			<Text>My News: {id}</Text>
		</View>
	);
};

export default NewsDetailsPage;