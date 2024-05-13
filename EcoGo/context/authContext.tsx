import { FC, ReactNode, createContext, useEffect } from 'react';
import { useState, useContext } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth, db } from '../FirebaseConfig';
import { addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import {uploadImageToFirebase, generateImagePath}  from '@/utils/dataProcessing/uploadImageToFirebase';


interface User {
    username: string;
    profileImageUrl: string;
    userId: string;
    email: string;
    password: string;
    
}

interface AuthContextInterface {
    user: User | null ;
    isAuthenticated: boolean | undefined;
    login: (email: string, password: string) => void;
    logout: () => void;
    register: (email: string, password: string, username: string, profileUrl: string) => Promise<{sucess: boolean, message?: string}>;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

interface AuthContextProviderProps {
    children: ReactNode;
}


export const AuthContextProvider: FC<AuthContextProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            // console.log('user: ', user);
            if (user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        })
    },[]);

    const updateUserData = async (userId: string) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            let data = docSnap.data();
            setUser({username: data.username, profileImageUrl: data.profileImageUrl, userId: data.userId, email: "", password: ""});

        }
        
    }

    const login = async (email: string, password : string) => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {sucess: true};

        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg = 'Invalid email'
            if(msg.includes('(auth/user-not-found)')) msg = 'User not found'
            if(msg.includes('(auth/wrong-password)')) msg = 'Wrong password'
            return {sucess: false, message: msg};

        }
    };

    const logout = async () => {
        try{
            await signOut(auth);
            return {sucess: true};


        }catch(e){

            return {sucess: false, message: e.message, error: e};

        }
    };

    const register = async (email: string, password: string, username: string, image: any) => {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user: ', response?.user);
            await uploadImageToFirebase(image, generateImagePath(response?.user?.uid)); 
            const storage = getStorage();
            const profileImageUrl = await getDownloadURL(ref(storage, generateImagePath(response?.user?.uid)));

            await setDoc(doc(db, "users", response?.user?.uid, ), {
                username,
                profileImageUrl,
                userId: response?.user?.uid
            });
            setUser(user);
            updateUserData(response?.user?.uid);
            return {sucess: true, data: response?.user};


        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg = 'Invalid email'
            if(msg.includes('(auth/email-already-in-use)')) msg = 'This email is already in use'
            return {sucess: false, message: msg};

        }
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = (): AuthContextInterface => {
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth must be used within AuthContextProvider');
    }
    return value;
}