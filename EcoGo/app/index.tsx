import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { View, Pressable, Text } from 'react-native';

const style = StyleSheet.create({
	container: {
	backgroundColor: "#5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);" ,
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	},
	text: {
	color: 'black',
	fontSize: 100,
	fontWeight: 'bold',
	},
});

const LoginPage = () => {
	const router = useRouter();

	const handleLogin = () => {
		// Add your login logic here
		router.replace('/home');
	};

	return (
		<View style={style.container}>
			<Pressable onPress={handleLogin}>
				<Text style={style.text}>EcoGo</Text>
			</Pressable>
		</View>
	);
};

export default LoginPage;