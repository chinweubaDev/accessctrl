import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password
  const [errors, setErrors] = useState({
    phoneNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validatePhone = () => {
    if (!phoneNumber.trim()) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Phone Number is required' }));
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!otp.trim() || otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter valid 6-digit OTP' }));
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOTP = () => {
    if (validatePhone()) {
      // TODO: Implement OTP sending logic
      Alert.alert('OTP Sent', 'Please check your phone for the OTP code');
      setStep(2);
    }
  };

  const handleVerifyOTP = () => {
    if (validateOtp()) {
      // TODO: Implement OTP verification logic
      setStep(3);
    }
  };

  const handleResetPassword = () => {
    if (validatePasswords()) {
      // TODO: Implement password reset logic
      Alert.alert('Success', 'Password has been reset successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Reset Password</Text>
      <Text style={styles.stepDescription}>
        Enter your phone number to receive a verification code
      </Text>
      <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
        <Feather name="phone" size={20} color="#045555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
          }}
          keyboardType="phone-pad"
        />
      </View>
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      <Pressable style={styles.actionButton} onPress={handleSendOTP}>
        <Text style={styles.actionButtonText}>Send OTP</Text>
      </Pressable>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Enter OTP</Text>
      <Text style={styles.stepDescription}>
        Enter the 6-digit code sent to your phone
      </Text>
      <View style={[styles.inputContainer, errors.otp && styles.inputError]}>
        <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#666"
          value={otp}
          onChangeText={(text) => {
            setOtp(text);
            setErrors(prev => ({ ...prev, otp: '' }));
          }}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>
      {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
      <Pressable style={styles.actionButton} onPress={handleVerifyOTP}>
        <Text style={styles.actionButtonText}>Verify OTP</Text>
      </Pressable>
      <Pressable style={styles.resendButton} onPress={handleSendOTP}>
        <Text style={styles.resendButtonText}>Resend OTP</Text>
      </Pressable>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>New Password</Text>
      <Text style={styles.stepDescription}>
        Create a new password for your account
      </Text>
      <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
        <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#666"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setErrors(prev => ({ ...prev, newPassword: '' }));
          }}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#045555" />
        </Pressable>
      </View>
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
        <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
          }}
          secureTextEntry={!showPassword}
        />
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <Pressable style={styles.actionButton} onPress={handleResetPassword}>
        <Text style={styles.actionButtonText}>Reset Password</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <View style={styles.topBox}>
          <View style={styles.headerContainer}>
            <Pressable 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={24} color="#045555" />
            </Pressable>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Forgot Password</Text>
          </View>
        </View>
        <View style={styles.bottomBox}>
          <View style={styles.formContainer}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
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
    height: height * 0.35,
    backgroundColor: '#045555',
    borderBottomRightRadius: 50,
  },
  bottomBox: {
    minHeight: height * 0.65,
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
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
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
  actionButton: {
    backgroundColor: '#045555',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  resendButtonText: {
    color: '#045555',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
