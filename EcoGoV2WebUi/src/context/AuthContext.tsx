import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, jobPosition: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "User authenticated" : "No user");
      
      // If we have a user, make sure their display name is set
      if (firebaseUser) {
        if (!firebaseUser.displayName) {
          // Try to get display name from Firestore if not set in auth
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists() && userDoc.data().name) {
              // Update the user profile with the name from Firestore
              await updateProfile(firebaseUser, {
                displayName: userDoc.data().name
              });
              // Re-fetch user to get updated profile
              setUser({ ...firebaseUser });
            }
          } catch (error) {
            console.error("Error getting user data:", error);
          }
        }
      }
      
      setUser(firebaseUser);
      setLoading(false);
      setInitialAuthCheckDone(true);
    });
    return unsubscribe;
  }, []);

  // Effect to redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && initialAuthCheckDone && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/auth') {
        console.log("No authenticated user, redirecting to login");
        window.location.href = '/auth';
      }
    }
  }, [user, loading, initialAuthCheckDone]);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore to ensure we have the display name
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (userDoc.exists() && userDoc.data().name && !userCredential.user.displayName) {
      await updateProfile(userCredential.user, {
        displayName: userDoc.data().name
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Force reload to clear any cached state
    window.location.href = '/auth';
  };

  const register = async (email: string, password: string, name: string, jobPosition: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name in Firebase Auth
    await updateProfile(cred.user, {
      displayName: name
    });
    
    // Add user data to Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      jobPosition,
      totalCarbon: 0,
      businessTrips: { trips: [] },
      sharedTrips: [],
      email
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
