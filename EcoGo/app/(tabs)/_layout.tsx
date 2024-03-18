import  {Tabs } from "expo-router";
import { Image, View} from "react-native";
import styles from "../../components/common/footer/footer.style";



export default () => {
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
                        ...styles.shadow,

                    },
                }
            
            }>
            <Tabs.Screen name="home" 
                options={
                    {
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={require("../../assets/icons/ic_home.png")}
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
            <Tabs.Screen name="store"
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={require("../../assets/icons/ic_shop.png")}
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

            <Tabs.Screen name="gps" 
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <Image 
                                source={require("../../assets/icons/greenButton.png")}
                                style={{
                                    top: 15,
                                    ...styles.mapImage}}
                            />
                        ),
                    }
                
                }
            />
            <Tabs.Screen name="settings"
                options = {
                    {
                        tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={require("../../assets/icons/ic_setting.png")}
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
            <Tabs.Screen name="profile"
                options={
                    {
                        tabBarIcon: ({focused}) => (
                            <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={require("../../assets/icons/ic_user-square.png")}
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
