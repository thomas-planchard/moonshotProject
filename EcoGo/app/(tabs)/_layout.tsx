import  {Tabs } from "expo-router";
import { Image, View} from "react-native";
import {ICONS} from "@/constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
                        bottom: hp(2),
                        left: wp(5),
                        right: wp(5),
                        borderRadius: 15,
                        height: hp(6),
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
                                    tintColor: focused ? "#7fff7f" : "#FFFF",     
                                    ...styles.icons}}
                             />
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
            <Tabs.Screen name="Challenges"
                options = {
                    {
                        tabBarIcon: ({focused}) => (
                        <View style={{alignItems: "center", justifyContent: "center", top: 15}}>
                            <Image 
                                source={ICONS.icCoin}
                                style={{
                                    tintColor: focused ? "#7fff7f" : "#FFFF",        
                                    ...styles.icons}}
                            />
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
                        </View>
                        )
                    }
                }
                />
        </Tabs>
    )
}
