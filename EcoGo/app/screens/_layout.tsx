import { Stack } from "expo-router";

const StackLayout =()=>{
    return (
        <Stack>
            <Stack.Screen name="infoUser" options= {{headerShown: false}} />
        </Stack>
    );
};

export default StackLayout;