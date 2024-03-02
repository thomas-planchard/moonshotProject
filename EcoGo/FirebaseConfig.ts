// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmcSuak_s9VmHa-TyjVVWKGOLYSd5WnCw",
  authDomain: "rnecogo-69b4c.firebaseapp.com",
  projectId: "rnecogo-69b4c",
  storageBucket: "rnecogo-69b4c.appspot.com",
  messagingSenderId: "635816518280",
  appId: "1:635816518280:web:85dcfd13eb7c169637b53d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
})
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const usersRef = collection(FIREBASE_DB, 'users');
export const roomRef = collection(FIREBASE_DB, 'rooms');

