import { Link, useRouter } from 'expo-router';
import { StyleSheet, View, Pressable, Text } from 'react-native';

const styleCSS = StyleSheet.create({
	container:{
	backgroundColor: "#5EC5FF 0%, rgba(100, 223, 183, 0.552083) 99.99%, rgba(107, 255, 94, 0) 100%);",
	flex : 1,
	justifyContent: 'center',
	alignItems: 'center'
	}
})

const LoginPage = () => {
	const router = useRouter();

	const handleLogin = () => {
		// Add your login logic here
		router.replace('/home');
	};

	return (
		<View style={styleCSS.container}>
			<Pressable onPress={handleLogin}>
				<Text>Login</Text>
			</Pressable>

			<Link href="/register" asChild>
				<Pressable>
					<Text>Create account</Text>
				</Pressable>
			</Link>

			<Link href="/test">Unmatched route</Link>
		</View>
	);
};

export default LoginPage;