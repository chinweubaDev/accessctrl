import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SecuritySettingsScreen = () => {
  const navigation = useNavigation();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);

    if (compatible) {
      const enrolledTypes = await LocalAuthentication.isEnrolledAsync();
      if (enrolledTypes) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }
    }
  };

  const handleBiometricToggle = async () => {
    if (!isBiometricEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          disableDeviceFallback: true,
        });

        if (result.success) {
          setIsBiometricEnabled(true);
          Alert.alert('Success', `${biometricType} authentication enabled`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to enable biometric authentication');
      }
    } else {
      setIsBiometricEnabled(false);
    }
  };

  const securityOptions = [
    {
      id: 'biometric',
      title: `Enable ${biometricType}`,
      description: `Use ${biometricType} for quick and secure access`,
      icon: biometricType === 'Face ID' ? 'user' : 'fingerprint',
      isEnabled: isBiometricEnabled,
      onToggle: handleBiometricToggle,
      isSupported: isBiometricSupported,
    },
    {
      id: 'pin',
      title: 'Require PIN on Start',
      description: 'Ask for PIN when opening the app',
      icon: 'lock',
      isEnabled: true,
      onToggle: () => {},
      isSupported: true,
    },
    {
      id: 'session',
      title: 'Auto Logout',
      description: 'Automatically logout after 30 minutes of inactivity',
      icon: 'clock',
      isEnabled: true,
      onToggle: () => {},
      isSupported: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          {securityOptions.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <View style={styles.optionIconContainer}>
                <Feather name={option.icon as any} size={20} color="#045555" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {option.isSupported ? (
                <Switch
                  value={option.isEnabled}
                  onValueChange={option.onToggle}
                  trackColor={{ false: '#e9ecef', true: '#045555' }}
                  thumbColor="#fff"
                />
              ) : (
                <Text style={styles.notSupported}>Not supported</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Feather name="log-in" size={16} color="#045555" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Last Login</Text>
                <Text style={styles.activityTime}>Today, 10:30 AM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Feather name="map-pin" size={16} color="#045555" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Location</Text>
                <Text style={styles.activityTime}>Lagos, Nigeria</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Feather name="smartphone" size={16} color="#045555" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Device</Text>
                <Text style={styles.activityTime}>iPhone 12 Pro</Text>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  notSupported: {
    fontSize: 14,
    color: '#FF4444',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default SecuritySettingsScreen; 