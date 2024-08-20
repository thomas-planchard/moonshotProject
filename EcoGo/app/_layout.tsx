import { useSegments, Slot, useRouter } from "expo-router";
import { useAuth, AuthContextProvider } from "../context/AuthContext";
import { useEffect } from "react";
import ConnectionCheck from "@/components/common/CheckConnection";
import "../global.css";



const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
       if (typeof isAuthenticated == "undefined")return ; 
       const inApp = segments[0] =='(tabs)';
       if(isAuthenticated && !inApp){
        //redirect to home
        router.replace('/(tabs)/home/')
       }else if(isAuthenticated == false ){
        //redirect to signIn
        router.replace('/SignIn')
       }
    }, [isAuthenticated]);

    return <Slot />
}


export default function RootLayout() {
    return (
        <ConnectionCheck>
        <AuthContextProvider>
                <MainLayout />
        </AuthContextProvider>
        </ConnectionCheck>
    );
};

