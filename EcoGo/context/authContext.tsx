import { FC, ReactNode, createContext, useEffect } from 'react';
import { useState, useContext } from 'react';

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
    register: (email: string, password: string, username: string, profileUrl: string) => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

interface AuthContextProviderProps {
    children: ReactNode;
}


export const AuthContextProvider: FC<AuthContextProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setIsAuthenticated(false);
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

        }catch(e){

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