// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth} from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from "@env";



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})
export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');

