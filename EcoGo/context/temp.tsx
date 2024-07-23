import { FC, ReactNode, createContext, useEffect } from 'react';
import { useState, useContext } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../FirebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import { uploadImageToFirebase, generateImagePath } from '@/utils/UploadImageToFirebase';

interface User {
  username: string;
  profileImageUrl: string;
  userId: string;
  email: string;
  password: string;
  carType?: string;
  carSize?: string;
  consumption?: string | null;
}

interface AuthContextInterface {
  user: User | null;
  isAuthenticated: boolean | undefined;
  updateUser: (newUserData: Partial<User>) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, username: string, image: any, userData: any) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        updateUserData(firebaseUser.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      const userDataDocRef = doc(db, 'userData', userId);
      const userDataDocSnap = await getDoc(userDataDocRef);

      if (userDocSnap.exists() && userDataDocSnap.exists()) {
        const userDocData = userDocSnap.data();
        const userDataDocData = userDataDocSnap.data();

        setUser({
          username: userDocData.username,
          profileImageUrl: userDocData.profileImageUrl,
          userId: userDocData.userId,
          email: userDocData.email,
          password: '',
          carType: userDataDocData.carType,
          carSize: userDataDocData.carSize,
          consumption: userDataDocData.consumption
        });
      } else if (userDocSnap.exists()) {
        const userDocData = userDocSnap.data();
        setUser({
          username: userDocData.username,
          profileImageUrl: userDocData.profileImageUrl,
          userId: userDocData.userId,
          email: userDocData.email,
          password: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }

  const updateUser = async (newUserData: Partial<User>) => {
    if (!user) return;

    const userUpdates: Partial<User> = {};
    const userDataUpdates: Partial<User> = {};

    if (newUserData.username) userUpdates.username = newUserData.username;
    if (newUserData.email) userUpdates.email = newUserData.email;
    if (newUserData.profileImageUrl) userUpdates.profileImageUrl = newUserData.profileImageUrl;
    if (newUserData.carType) userDataUpdates.carType = newUserData.carType;
    if (newUserData.carSize) userDataUpdates.carSize = newUserData.carSize;
    if (newUserData.consumption !== undefined) userDataUpdates.consumption = newUserData.consumption;

    const userDocRef = doc(db, 'users', user.userId);
    const userDataDocRef = doc(db, 'userData', user.userId);

    try {
      if (Object.keys(userUpdates).length > 0) {
        await updateDoc(userDocRef, userUpdates);
      }
      if (Object.keys(userDataUpdates).length > 0) {
        await updateDoc(userDataDocRef, userDataUpdates);
      }
      setUser((prevUser) => ({
        ...prevUser,
        ...newUserData
      }));
    } catch (error) {
      console.error('Error updating user data: ', error);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
      if (msg.includes('(auth/user-not-found)')) msg = 'User not found';
      if (msg.includes('(auth/wrong-password)')) msg = 'Wrong password';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message, error: e };
    }
  };

  const register = async (email: string, password: string, username: string, image: any, userData: any) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await uploadImageToFirebase(image, generateImagePath(response?.user?.uid));
      const storage = getStorage();
      const profileImageUrl = await getDownloadURL(ref(storage, generateImagePath(response?.user?.uid)));

      // Save user details to 'users' collection
      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileImageUrl,
        userId: response?.user?.uid,
        email
      });

      // Save additional user data to 'userData' collection
      await setDoc(doc(db, "userData", response?.user?.uid), {
        ...userData,
        carbonFootprint: 0,
        userId: response?.user?.uid
      });

      updateUserData(response?.user?.uid);
      return { success: true, data: response?.user };

    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
      if (msg.includes('(auth/email-already-in-use)')) msg = 'This email is already in use';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, updateUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextInterface => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return value;
}