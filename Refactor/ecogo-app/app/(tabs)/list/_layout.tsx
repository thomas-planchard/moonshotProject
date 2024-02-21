import { Stack } from 'expo-router';

const NewsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerTitle: 'News' }} />
		</Stack>
	);
};

export default NewsLayout;