import React, { useState, useRef } from 'react';
import { ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomKeyboardView from '@/components/common/CustomKeyboardView';
import { useAuth } from '@/context/AuthContext';
import SignUpHeader from '@/components/auth/signup/SignUpHeader';
import SignUpForm from '@/components/auth/signup/SignUpForm';
import SignUpFooter from '@/components/auth/signup/SignUpFooter';
import styles from '@/components/auth/signup/signup.style';

const SignUp = () => {
  const { register } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const usernameRef = useRef("");

  const [image, setImage] = useState(null);
  const [carType, setCarType] = useState(null);
  const [carSize, setCarSize] = useState(null);
  const [consumption, setConsumption] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleRegister = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !confirmPasswordRef.current ||
      !usernameRef.current ||
      image == null ||
      (carType === 'fuel' && !consumption)
    ) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    if (!validateEmail(emailRef.current)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    if (!validatePassword(passwordRef.current)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    if (passwordRef.current !== confirmPasswordRef.current) {
      setPasswordError(true);
      return;
    }

    if (carType !== "No Car" && carSize == null) {
      Alert.alert('Error', 'Please select your car size');
      return;
    }

    setPasswordError(false);
    setLoading(true);

    const userData = {
      carType,
      carSize,
      consumption: carType === "electric" ? null : consumption
    };

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, image, userData);
    setLoading(false);

    if (!response.success) {
      console.log('Sign Up', response.message);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} className="flex-1 gap-12">
        <SignUpHeader />
        <SignUpForm
          emailRef={emailRef}
          passwordRef={passwordRef}
          confirmPasswordRef={confirmPasswordRef}
          usernameRef={usernameRef}
          image={image}
          setImage={setImage}
          carType={carType}
          setCarType={setCarType}
          carSize={carSize}
          setCarSize={setCarSize}
          setConsumption={setConsumption}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          emailError={emailError}
          handleRegister={handleRegister}
          loading={loading}
        />
        <SignUpFooter />
      </ScrollView>
    </CustomKeyboardView>
  );
};

export default SignUp;