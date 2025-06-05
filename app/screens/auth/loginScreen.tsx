import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [isFingerPressed, setIsFingerPressed] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  // Check if device supports biometric authentication
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Fingerprint',
        disableDeviceFallback: true,
        cancelLabel: 'Cancel',
      });
      
      if (biometricAuth.success) {
        // Proceed with biometric login
        console.log('Fingerprint authentication successful');
        // Add your login logic here
      } else {
        Alert.alert('Authentication Failed', 'Please try again or use password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication');
    }
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Phone Number is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (validateInputs()) {
      // Proceed with sign in
      console.log('Sign in successful');
      navigation.navigate('Dashboard');
    }
  };

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <View style={styles.topBox}>
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={24} color="#045555" />
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Welcome Back! 👋</Text>
          </View>
        </View>
        <View style={styles.bottomBox}>
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, errors.username && styles.inputError]}>
              <Feather name="user" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: '' }));
                  }
                }}
              />
              {errors.username && (
                <Feather name="alert-circle" size={20} color="#ff3333" style={styles.errorIcon} />
              )}
            </View>
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#045555" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleNavigation('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.signInButton}
                activeOpacity={0.7}
                onPress={handleSignIn}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              
              {isBiometricSupported && (
                <TouchableOpacity 
                  style={[styles.fingerprintButton, isFingerPressed && styles.fingerprintButtonPressed]}
                  activeOpacity={0.7}
                  onPressIn={() => setIsFingerPressed(true)}
                  onPressOut={() => {
                    setIsFingerPressed(false);
                    handleBiometricAuth();
                  }}
                >
                  <Entypo 
                    name="fingerprint" 
                    size={isFingerPressed ? 88 : 44} 
                    color={isFingerPressed ? '#ff0000' : '#045555'} 
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleNavigation('Register')}
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  headerContainer: {
    padding: 16,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    padding: 16,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  topBox: {
    height: height * 0.4,
    backgroundColor: '#045555',
    borderBottomRightRadius: 50,
  },
  bottomBox: {
    height: height * 0.5,
    backgroundColor: '#fff',
    padding: 16,
    width: width * 0.9,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: -150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  inputIcon: {
    marginRight: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#045555',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
  signInButton: {
    flex: 1,
    backgroundColor: '#045555',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fingerprintButton: {
    width: 54,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fingerprintButtonPressed: {
    width: 108,
    height: 108,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputError: {
    borderColor: '#ff3333',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 10,
  },
  errorIcon: {
    marginLeft: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#045555',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 