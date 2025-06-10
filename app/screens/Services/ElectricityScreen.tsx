import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const AMOUNTS = [1000, 2000, 5000, 10000, 15000, 20000];

const PROVIDERS = [
  { id: 'ekedc', name: 'EKEDC', fullName: 'Eko Electricity Distribution Company' },
  { id: 'ikedc', name: 'IKEDC', fullName: 'Ikeja Electricity Distribution Company' },
  { id: 'aedc', name: 'AEDC', fullName: 'Abuja Electricity Distribution Company' },
  { id: 'phedc', name: 'PHEDC', fullName: 'Port Harcourt Electricity Distribution Company' },
];

interface CustomerInfo {
  name: string;
  address: string;
  meterType: string;
  lastRecharge: string;
}

type CustomerData = {
  [key: string]: CustomerInfo;
};

// Mock customer data - in production, this would come from your API
const mockCustomerData: CustomerData = {
  '12345678901': {
    name: 'John Doe',
    address: 'Block 4, House 12',
    meterType: 'Prepaid',
    lastRecharge: '2024-06-15',
  },
  '23456789012': {
    name: 'Jane Smith',
    address: 'Block 2, House 8',
    meterType: 'Prepaid',
    lastRecharge: '2024-06-14',
  },
};

const generateToken = () => {
  // This is a mock token generator - in production, you'd get this from your backend
  return Math.random().toString(36).substring(2, 15).toUpperCase();
};

const Electricity = () => {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  const validateMeterNumber = (number: string) => {
    // This is a basic validation - adjust according to your electricity provider's requirements
    return /^\d{11,13}$/.test(number);
  };

  const handleMeterNumberChange = (number: string) => {
    setMeterNumber(number);
    // In production, this would be an API call
    if (mockCustomerData[number]) {
      setCustomerInfo(mockCustomerData[number]);
    } else {
      setCustomerInfo(null);
    }
  };

  const handlePayment = () => {
    if (!selectedProvider) {
      Alert.alert('Error', 'Please select an electricity provider');
      return;
    }

    if (!validateMeterNumber(meterNumber)) {
      Alert.alert('Error', 'Please enter a valid meter number (11-13 digits)');
      return;
    }

    if (!customerInfo) {
      Alert.alert('Error', 'Invalid meter number or customer not found');
      return;
    }

    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 100) {
      Alert.alert('Error', 'Please select or enter a valid amount (minimum ₦100)');
      return;
    }

    const token = generateToken();
    setGeneratedToken(token);
    setShowSuccessModal(true);
  };

  const resetForm = () => {
    setSelectedProvider('');
    setMeterNumber('');
    setSelectedAmount(null);
    setCustomAmount('');
    setCustomerInfo(null);
    setShowSuccessModal(false);
    setGeneratedToken('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Electricity</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          <View style={styles.providersGrid}>
            {PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.selectedCard,
                ]}
                onPress={() => {
                  setSelectedProvider(provider.id);
                  setMeterNumber('');
                  setCustomerInfo(null);
                }}
              >
                <Text
                  style={[
                    styles.providerName,
                    selectedProvider === provider.id && styles.selectedText,
                  ]}
                >
                  {provider.name}
                </Text>
                <Text
                  style={[
                    styles.providerFullName,
                    selectedProvider === provider.id && styles.selectedText,
                  ]}
                >
                  {provider.fullName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meter Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter meter number"
                value={meterNumber}
                onChangeText={handleMeterNumberChange}
                keyboardType="numeric"
                maxLength={13}
              />
              {meterNumber.length > 0 && (
                <View style={[
                  styles.validationIndicator,
                  validateMeterNumber(meterNumber) ? styles.validIndicator : styles.invalidIndicator
                ]} />
              )}
            </View>
          </View>
        )}

        {customerInfo && (
          <View style={styles.customerInfoCard}>
            <Text style={styles.customerName}>{customerInfo.name}</Text>
            <Text style={styles.customerDetail}>{customerInfo.address}</Text>
            <View style={styles.customerMetaInfo}>
              <View style={styles.metaItem}>
                <Feather name="zap" size={16} color="#045555" />
                <Text style={styles.metaText}>{customerInfo.meterType}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color="#045555" />
                <Text style={styles.metaText}>
                  Last Recharge: {new Date(customerInfo.lastRecharge).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {customerInfo && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Amount</Text>
              <View style={styles.amountsGrid}>
                {AMOUNTS.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.amountCard,
                      selectedAmount === amount && styles.selectedCard,
                    ]}
                    onPress={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                  >
                    <Text
                      style={[
                        styles.amountText,
                        selectedAmount === amount && styles.selectedText,
                      ]}
                    >
                      ₦{amount.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={customAmount}
                onChangeText={(value) => {
                  setCustomAmount(value);
                  setSelectedAmount(null);
                }}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.payButton,
                (!meterNumber || (!selectedAmount && !customAmount)) && styles.disabledButton,
              ]}
              onPress={handlePayment}
              disabled={!meterNumber || (!selectedAmount && !customAmount)}
            >
              <Text style={styles.payButtonText}>
                Pay ₦{(selectedAmount || Number(customAmount) || 0).toLocaleString()}
              </Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Feather name="check-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Your Token</Text>
              <Text style={styles.tokenValue}>{generatedToken}</Text>
            </View>
            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Provider</Text>
                <Text style={styles.receiptValue}>
                  {PROVIDERS.find(p => p.id === selectedProvider)?.name}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValue}>
                  ₦{(selectedAmount || Number(customAmount)).toLocaleString()}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Meter Number</Text>
                <Text style={styles.receiptValue}>{meterNumber}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Customer</Text>
                <Text style={styles.receiptValue}>{customerInfo?.name}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={resetForm}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#045555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
    backgroundColor: '#045555',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  validationIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  validIndicator: {
    backgroundColor: '#4CAF50',
  },
  invalidIndicator: {
    backgroundColor: '#F44336',
  },
  customerInfoCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  customerMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  amountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountCard: {
    width: (width - 72) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedCard: {
    backgroundColor: '#045555',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  payButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  tokenContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tokenValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    letterSpacing: 2,
  },
  receiptDetails: {
    width: '100%',
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  doneButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerFullName: {
    fontSize: 12,
    color: '#666',
  },
});

export default Electricity; 