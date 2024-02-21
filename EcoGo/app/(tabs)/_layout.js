import { Stack, Tabs } from 'expo-router';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()

const Layout = () => {

    const [fontsLoaded] = useFonts({
        DMBold: require('../../assets/fonts/DMSans-Bold.ttf'),
        DMMedium: require('../../assets/fonts/DMSans-Medium.ttf'),
        DMRegular: require('../../assets/fonts/DMSans-Regular.ttf'),
    });
        
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }
    return <Stack 
        onLayout= {onLayoutRootView}
         screenOptions ={{
            headerShown: false,
         }}
        >
    <Stack.Screen name="home" option={{headerTitle: "Home", headerShown: false }} />
    <Stack.Screen name="gps" option={{headerTitle: "GPS", headerShown: false }} />
    <Stack.Screen name="profile" option={{headerTitle: "Profile", headerShown: false }} />
    <Stack.Screen name="store" option={{headerTitle: "Store", headerShown: false }} />
    </Stack>
    
}

export default Layout;