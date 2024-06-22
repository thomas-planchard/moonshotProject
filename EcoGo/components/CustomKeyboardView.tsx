import * as React from 'react';
import { Text, View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

const ios = Platform.OS === 'ios';

interface CustomKeyboardViewProps {
    children: React.ReactNode;
}

const CustomKeyboardView: React.FC<CustomKeyboardViewProps> = ({children}) => {
  return (
    <KeyboardAvoidingView
        behavior={ios ? 'padding' : 'height'}
        style={{flex:1}}>
            <ScrollView
            style={{flex: 1}}
            bounces={false}
            showsVerticalScrollIndicator={false}>
                {
                    children
                }
            </ScrollView>

        </KeyboardAvoidingView>
  )
}

export default CustomKeyboardView;