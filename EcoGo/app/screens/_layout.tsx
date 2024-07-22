import { Stack } from "expo-router";

const StackLayout =()=>{
    return (
        <Stack>
            <Stack.Screen name="InfoUser" options= {{headerShown: false}} />
        </Stack>
    );
};

export default StackLayout;