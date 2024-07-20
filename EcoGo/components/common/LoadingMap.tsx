import * as React from 'react';
import {View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingMap({size}: {size: number}) {
  return (
    <View style={{height: size, aspectRatio: 2}}>
      <LottieView
        style = {{flex: 1}}
        source={require('../../assets/animation/mapLoading.json')}
        autoPlay
        loop
      />
    </View>
  );
}