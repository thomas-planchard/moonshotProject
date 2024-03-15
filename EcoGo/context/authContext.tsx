import { FC, ReactNode, createContext, useEffect } from 'react';
import { useState, useContext } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth';
import { auth, db } from '../FirebaseConfig';
import { addDoc, doc, setDoc } from 'firebase/firestore';

interface User {
    email: string;
    password: string;
    username: string;
    profileUrl: string;
}

interface AuthContextInterface {
    user: User | null;
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
            if (user){
                setIsAuthenticated(true);
                setUser(user);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        })
    },[]);

    const login = async (email: string, password : string) => {
        try{

        }catch(e){

        }
    };

    const logout = async () => {
        try{

        }catch(e){

        }
    };

    const register = async (email: string, password: string, username: string, profileUrl: string) => {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user: ', response?.user);

            await setDoc(doc(db, "users", response?.user?.uid, ), {
                username,
                profileUrl,
                userId: response?.user?.uid
            });
            return {sucess: true, data: response?.user};

        }catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
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