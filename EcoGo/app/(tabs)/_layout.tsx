import  {Tabs } from "expo-router";

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="home"/>
            <Tabs.Screen name="store"/>
            <Tabs.Screen name="gps" />
            <Tabs.Screen name="settings"/>
            <Tabs.Screen name="profile"/>
        </Tabs>
    )
}