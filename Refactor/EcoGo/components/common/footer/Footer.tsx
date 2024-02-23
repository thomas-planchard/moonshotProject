import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'


import styles from './footer.style'


export default function Footer() {

  return (
    <View style={styles.container}>
        <Image  source={require('../../../assets/images/bg.png')} style={styles.imageBackground}></Image>
        <View style={styles.footer}>
            <TouchableOpacity
            ><Image source={require('../../../assets/icons/ic_home.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity  ><Image source={require('../../../assets/icons/ic_shop.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity
          >
              <Image source={require('../../../assets/icons/greenButton.png')} style={styles.mapImage}></Image>
              </TouchableOpacity>
              <TouchableOpacity><Image source={require('../../../assets/icons/ic_setting.png')} style={styles.icons}></Image></TouchableOpacity>
           <TouchableOpacity><Image source={require('../../../assets/icons/ic_user-square.png')} style={styles.icons}></Image></TouchableOpacity>
        </View>
        </View>
  )
}
 
