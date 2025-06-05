import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Sample estates data
const ESTATES = [
  'Royal Estate',
  'Green Valley Estate',
  'Sunshine Gardens',
  'Palm Heights Estate',
  'Golden Park Estate'
];

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showEstates, setShowEstates] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    estateName: '',
    address: '',
    ownerName: '',
    idCard: null as string | null,
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    estateName: '',
    address: '',
    ownerName: '',
    idCard: '',
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      phoneNumber: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      estateName: '',
      address: '',
      ownerName: '',
      idCard: '',
    };

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!formData.estateName.trim()) {
      newErrors.estateName = 'Estate Name is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'House Address is required';
      isValid = false;
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'House Owner Name is required';
      isValid = false;
    }

    if (!formData.idCard) {
      newErrors.idCard = 'Identification Card is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = () => {
    if (validateInputs()) {
      // Proceed with registration
      console.log('Registration successful');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setFormData(prev => ({ ...prev, idCard: result.assets[0].uri }));
      if (errors.idCard) {
        setErrors(prev => ({ ...prev, idCard: '' }));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.logoText}>Create Account</Text>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.bottomBox}>
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
              <Feather name="phone" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Feather name="alert-circle" size={20} color="#ff3333" style={styles.errorIcon} />
              )}
            </View>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

            <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
              <Feather name="user" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
              />
              {errors.fullName && (
                <Feather name="alert-circle" size={20} color="#ff3333" style={styles.errorIcon} />
              )}
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            <View style={[styles.inputContainer, errors.estateName && styles.inputError]}>
              <MaterialIcons name="house" size={20} color="#045555" style={styles.inputIcon} />
              <Pressable 
                style={styles.selectInput}
                onPress={() => setShowEstates(!showEstates)}
              >
                <Text style={formData.estateName ? styles.input : styles.placeholderText}>
                  {formData.estateName || "Select Estate"}
                </Text>
              </Pressable>
              <MaterialIcons 
                name={showEstates ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#045555" 
              />
            </View>
            {showEstates && (
              <View style={styles.dropdownContainer}>
                {ESTATES.map((estate, index) => (
                  <Pressable
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      handleInputChange('estateName', estate);
                      setShowEstates(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{estate}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.estateName && <Text style={styles.errorText}>{errors.estateName}</Text>}

            <View style={[styles.inputContainer, errors.address && styles.inputError]}>
              <MaterialIcons name="location-on" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full House Address"
                placeholderTextColor="#666"
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
                multiline
              />
              {errors.address && (
                <Feather name="alert-circle" size={20} color="#ff3333" style={styles.errorIcon} />
              )}
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            <View style={[styles.inputContainer, errors.ownerName && styles.inputError]}>
              <MaterialIcons name="person-outline" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="House Owner Name"
                placeholderTextColor="#666"
                value={formData.ownerName}
                onChangeText={(text) => handleInputChange('ownerName', text)}
              />
              {errors.ownerName && (
                <Feather name="alert-circle" size={20} color="#ff3333" style={styles.errorIcon} />
              )}
            </View>
            {errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}

            <View style={[styles.uploadContainer, errors.idCard && styles.inputError]}>
              <Pressable style={styles.uploadButton} onPress={pickImage}>
                <MaterialIcons name="upload-file" size={24} color="#045555" />
                <Text style={styles.uploadText}>Upload Identification Card</Text>
              </Pressable>
              {formData.idCard && (
                <Image source={{ uri: formData.idCard }} style={styles.previewImage} />
              )}
            </View>
            {errors.idCard && <Text style={styles.errorText}>{errors.idCard}</Text>}

            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#045555" />
              </Pressable>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
              <Feather name="lock" size={20} color="#045555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <Pressable 
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#045555',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topBox: {
    height: height * 0.2,
    backgroundColor: '#045555',
    borderBottomRightRadius: 50,
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
    padding: 14,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomBox: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 20,
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
  errorIcon: {
    marginLeft: 10,
  },
  registerButton: {
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
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#045555',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectInput: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    color: '#045555',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  uploadText: {
    color: '#045555',
    marginLeft: 10,
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default RegisterScreen;