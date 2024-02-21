import React from 'react'
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { useRouter, Link } from 'expo-router'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'


import styles from './footer.style'

const Footer = () => {

  const Tab = createBottomTabNavigator();
  return (
    <View style={styles.container}>
        <Image  source={require('../../../assets/images/bg.png')} style={styles.imageBackground}></Image>
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => Navigateto('/app/home')}
            ><Image source={require('../../../assets/icons/ic_home.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity  onPress={() => Navigateto('app/store')} ><Image source={require('../../../assets/icons/ic_shop.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity
           onPress={() => Navigateto('/gps')}>
              <Image source={require('../../../assets/icons/greenButton.png')} style={styles.mapImage}></Image>
              </TouchableOpacity>
              <TouchableOpacity><Image source={require('../../../assets/icons/ic_setting.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity  onPress={() => Navigateto('/app/profile')}><Image source={require('../../../assets/icons/ic_user-square.png')} style={styles.icons}></Image></TouchableOpacity>
        </View>
        </View>
  )
}
 
export default Footer