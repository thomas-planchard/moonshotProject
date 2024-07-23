import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from "react-native";


export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work In Progress</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
