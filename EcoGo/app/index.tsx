import { StyleSheet, View, Pressable, Text, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native';
import React, {useState} from 'react';
import { FIREBASE_APP, FIREBASE_AUTH } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const auth = FIREBASE_AUTH;

	
	const signIn = async () => {
		setLoading(true);
		try {
			const response = await signInWithEmailAndPassword(auth, email, password);
			console.log(response);
		} catch (error) {
			console.error(error);
			alert("Sign in failed")
		} finally {
			setLoading(false);
		}
	}

	const signUp = async () => {
		setLoading(true);
		try {
			const response = await createUserWithEmailAndPassword(auth, email, password);
			console.log(response);
			alert("Check your email")
		} catch (error) {
			console.error(error);
			alert("Sign in failed")
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={style.container}>
			<KeyboardAvoidingView behavior="padding">
			<TextInput style={style.input} placeholder="Email" autoCapitalize='none' value={email} onChangeText={(text)=>setEmail(text)} />
			<TextInput style={style.input} placeholder="password" autoCapitalize='none' value={password} onChangeText={(text)=>setPassword(text)} secureTextEntry={true} />
			{ loading ? <ActivityIndicator size="large" color="#1a434e" /> 
			: <>
			<Button title="Login" onPress={signIn} />
			<Button title="Create account" onPress={signUp} />
			</>
			}
			</KeyboardAvoidingView>
		</View>
	);
};

const style = StyleSheet.create({
	container: {
	marginHorizontal: 20,
	flex: 1,
	justifyContent: 'center',
	},
	input: {
	marginVertical: 4,
	height: 50,
	borderWidth: 1, 
	borderRadius: 4,
	padding: 10,
	backgroundColor: 'white',
	},
});
