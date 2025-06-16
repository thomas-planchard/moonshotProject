import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPd5a_BV20Rgux6IOp9YNt2SmnU0_k5AM",
  authDomain: "ecogocorporate.firebaseapp.com",
  databaseURL: "https://ecogocorporate-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecogocorporate",
  storageBucket: "ecogocorporate.firebasestorage.app",
  messagingSenderId: "1072763882311",
  appId: "1:1072763882311:web:3302c1da77b976006f1a62",
  measurementId: "G-12YYBFKWD9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set auth persistence to session (will persist until tab is closed)
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Firebase auth persistence error:", error);
  });

export const db = getFirestore(app);
