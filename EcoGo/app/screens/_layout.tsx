import { Stack } from "expo-router";

const StackLayout =()=>{
    return (
        <Stack>
            <Stack.Screen name="infoUser" options= {{headerShown: true}} />
        </Stack>
    );
};

export default StackLayout;