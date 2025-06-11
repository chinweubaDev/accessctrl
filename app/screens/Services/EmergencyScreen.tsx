import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  icon: string;
  phone: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Estate Security',
    role: 'Security Team',
    icon: 'shield-check',
    phone: '08012345678',
  },
  {
    id: '2',
    name: 'Medical Emergency',
    role: 'Estate Clinic',
    icon: 'medical-bag',
    phone: '08023456789',
  },
  {
    id: '3',
    name: 'Fire Service',
    role: 'Emergency Response',
    icon: 'fire-truck',
    phone: '08034567890',
  },
  {
    id: '4',
    name: 'Estate Manager',
    role: 'Management',
    icon: 'account-tie',
    phone: '08045678901',
  },
];

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const [isActivated, setIsActivated] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isActivated) {
        startPulseAnimation();
      }
    });
  };

  const handlePanicButton = () => {
    if (!isActivated) {
      setIsActivated(true);
      Vibration.vibrate([0, 500, 200, 500]);
      startPulseAnimation();
      Alert.alert(
        'Emergency Alert Activated',
        'Security team has been notified. Stay calm, help is on the way.',
        [
          {
            text: 'Cancel Alert',
            onPress: () => {
              setIsActivated(false);
              Vibration.cancel();
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Alert.alert(
      'Emergency Call',
      `Calling ${contact.name}...`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            // Implement actual call functionality
            console.log(`Calling ${contact.phone}`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Panic Button */}
        <View style={styles.panicButtonContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isActivated ? '#ff4444' : '#045555',
              },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.panicButton,
              isActivated && styles.panicButtonActive,
            ]}
            onPress={handlePanicButton}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={48}
              color="#fff"
            />
            <Text style={styles.panicButtonText}>
              {isActivated ? 'ALERT ACTIVATED' : 'PANIC BUTTON'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Emergency Instructions</Text>
          <Text style={styles.instructionsText}>
            1. Press the panic button in case of immediate danger{'\n'}
            2. Security team will be notified instantly{'\n'}
            3. Stay calm and find a safe location{'\n'}
            4. Wait for the response team to arrive
          </Text>
        </View>

        {/* Emergency Contacts */}
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.contactsGrid}>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleEmergencyCall(contact)}
            >
              <MaterialCommunityIcons
                name={contact.icon as any}
                size={32}
                color="#045555"
              />
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRole}>{contact.role}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#045555',
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
    padding: 20,
  },
  panicButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 200,
  },
  pulseCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.3,
  },
  panicButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#045555',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panicButtonActive: {
    backgroundColor: '#ff4444',
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactRole: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmergencyScreen; 