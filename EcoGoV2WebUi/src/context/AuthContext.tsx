import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Department, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  userDepartment: Department | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, jobPosition: string, department: Department, role: UserRole) => Promise<void>;
  isManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userDepartment, setUserDepartment] = useState<Department | null>(null);

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
            
            // Set user role and department
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role || 'employee');
              setUserDepartment(userDoc.data().department || null);
            }
          } catch (error) {
            console.error("Error getting user data:", error);
          }
        } else {
          // Get user role and department even if display name exists
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role || 'employee');
              setUserDepartment(userDoc.data().department || null);
            }
          } catch (error) {
            console.error("Error getting user role data:", error);
          }
        }
      } else {
        setUserRole(null);
        setUserDepartment(null);
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
    
    // Get user data from Firestore to ensure we have the display name and role
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (userDoc.exists()) {
      if (userDoc.data().name && !userCredential.user.displayName) {
        await updateProfile(userCredential.user, {
          displayName: userDoc.data().name
        });
      }
      
      // Update role and department state
      setUserRole(userDoc.data().role || 'employee');
      setUserDepartment(userDoc.data().department || null);
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Force reload to clear any cached state
    window.location.href = '/auth';
  };

  const register = async (email: string, password: string, name: string, jobPosition: string, department: Department, role: UserRole = 'employee') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name in Firebase Auth
    await updateProfile(cred.user, {
      displayName: name
    });
    
    // Add user data to Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      jobPosition,
      department,
      role,
      totalCarbon: 0,
      businessTrips: { trips: [] },
      sharedTrips: [],
      email
    });
    
    // Update state
    setUserRole(role);
    setUserDepartment(department);
  };
  
  // Helper function to check if current user is a manager
  const isManager = () => {
    return userRole === 'manager';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userRole,
      userDepartment,
      login, 
      logout, 
      register,
      isManager
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
