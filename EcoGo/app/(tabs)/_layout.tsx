import  {Tabs } from "expo-router";
import { Image, View} from "react-native";
import {ICONS} from "@/constants";
import styles from "../../components/common/footer/footer.style";



export default function layout_ () {
    return (
        <Tabs 
            screenOptions={
                {
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1a434e",
                        position: "absolute",
                        bottom: 10,
                        left: 20,
                        right: 20,
                        borderRadius: 15,
                        height: 50,
                        

                    },
                }
            
            }>
            <Tabs.Screen name="home" 
                options={
                    {
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={ICONS.icHome}
                                style={{
                                    tintColor: focused ? "#7cbb85" : "#FFFF",     
                                    ...styles.icons}}
                             />
                            {/* <Text style={{color: focused ? "#7fff7f" : "#FFFF", fontSize: 12}}>
                            Home
                            </Text> */}
                        </View>
                        )
                    }
                
                }
            />
            <Tabs.Screen name="Store"
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={ICONS.icShop}
                                style={{
                                    tintColor: focused ?"#7fff7f" : "#FFFF",        
                                    ...styles.icons}}
                            />
                            {/* <Text style={{color: focused ? "#7fff7f" : "#FFFF", fontSize: 12}}>
                            Store
                            </Text> */}
                        </View>
                        )
                    }
                }
            />
            <Tabs.Screen name="Gps" 
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <Image 
                                source={ICONS.greenButton}
                                style={{
                                    top: 15,
                                    ...styles.mapImage}}
                            />
                        ),
                    }
                
                }
            />
            <Tabs.Screen name="Settings"
                options = {
                    {
                        tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={ICONS.icSetting}
                                style={{
                                    tintColor: focused ? "#7fff7f" : "#FFFF",        
                                    ...styles.icons}}
                            />
                            {/* <Text style={{color: focused ? "#7fff7f" : "#FFFF", fontSize: 12}}>
                            Settings
                            </Text> */}
                        </View>
                        )
                    }
                }
                />
            <Tabs.Screen name="Profile"
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={ICONS.icUserSquare}
                                style={{
                                    tintColor: focused ?"#7fff7f" : "#FFFF",     
                                    ...styles.icons}}
                            />
                            {/* <Text style={{color: focused ? "#7fff7f" : "#FFFF", fontSize: 12}}>
                            Profile
                            </Text> */}
                        </View>
                        )
                    }
                }
                />
        </Tabs>
    )
}
