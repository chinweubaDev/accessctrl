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

const providers = [
  { id: 'dstv', name: 'DSTV' },
  { id: 'gotv', name: 'GOTV' },
  { id: 'startimes', name: 'StarTimes' },
];

const plans = {
  dstv: [
    { id: 'premium', name: 'Premium', price: 24500 },
    { id: 'compact-plus', name: 'Compact Plus', price: 16600 },
    { id: 'compact', name: 'Compact', price: 10500 },
  ],
  gotv: [
    { id: 'gotv-max', name: 'GOtv Max', price: 4850 },
    { id: 'gotv-jolli', name: 'GOtv Jolli', price: 3300 },
    { id: 'gotv-jinja', name: 'GOtv Jinja', price: 2250 },
  ],
  startimes: [
    { id: 'nova', name: 'Nova', price: 1200 },
    { id: 'basic', name: 'Basic', price: 2100 },
    { id: 'smart', name: 'Smart', price: 2800 },
  ],
};

interface CustomerInfo {
  name: string;
  provider: string;
  address: string;
  lastSub: string;
  status: string;
  lastPayment: string;
}

interface CustomerDatabase {
  [key: string]: CustomerInfo;
}

const mockCustomerData: CustomerDatabase = {
  // DSTV Customers
  '1234567890': {
    name: 'John Smith',
    provider: 'dstv',
    address: 'Block 5, House 15',
    lastSub: 'Premium',
    status: 'Active',
    lastPayment: '2024-05-15',
  },
  '9876543210': {
    name: 'Sarah Johnson',
    provider: 'dstv',
    address: 'Block 2, House 8',
    lastSub: 'Compact Plus',
    status: 'Expired',
    lastPayment: '2024-04-20',
  },
  // GOTV Customers
  '5432109876': {
    name: 'Michael Brown',
    provider: 'gotv',
    address: 'Block 1, House 3',
    lastSub: 'GOtv Max',
    status: 'Active',
    lastPayment: '2024-05-10',
  },
  // StarTimes Customers
  '98765432101': {
    name: 'Emma Wilson',
    provider: 'startimes',
    address: 'Block 3, House 7',
    lastSub: 'Smart',
    status: 'Active',
    lastPayment: '2024-05-12',
  },
};

const CableTV = () => {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const validateSmartCard = (number: string) => {
    if (!selectedProvider || !number) return false;
    
    const isValidLength = selectedProvider === 'startimes' 
      ? number.length === 11 
      : number.length === 10;
    
    return isValidLength && /^\d+$/.test(number);
  };

  const handleSmartCardChange = (number: string) => {
    setSmartCardNumber(number);
    setCustomerInfo(null);
    
    console.log('Smart Card Number:', number);
    console.log('Selected Provider:', selectedProvider);
    console.log('Is Valid:', validateSmartCard(number));
    
    // Only proceed if we have a valid number
    if (number.length === (selectedProvider === 'startimes' ? 11 : 10)) {
      console.log('Customer Data:', mockCustomerData[number]);
      const customer = mockCustomerData[number];
      
      if (customer && customer.provider === selectedProvider) {
        console.log('Setting Customer Info:', customer);
        setCustomerInfo(customer);
      }
    }
  };

  const resetForm = () => {
    setSmartCardNumber('');
    setSelectedPlan(null);
    setSelectedProvider('');
    setShowSuccessModal(false);
  };

  const handlePayment = () => {
    if (!selectedProvider) {
      Alert.alert('Error', 'Please select a provider');
      return;
    }

    if (!validateSmartCard(smartCardNumber)) {
      Alert.alert('Error', 'Please enter a valid smart card number');
      return;
    }

    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }
    setCustomerInfo(null);

    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cable TV</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          <View style={styles.providersGrid}>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.selectedCard,
                ]}
                onPress={() => {
                  setSelectedProvider(provider.id);
                  setSelectedPlan(null);
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
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smart Card Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter smart card number"
                value={smartCardNumber}
                onChangeText={handleSmartCardChange}
                keyboardType="numeric"
                maxLength={selectedProvider === 'startimes' ? 11 : 10}
              />
              {smartCardNumber.length > 0 && (
                <View style={[
                  styles.validationIndicator,
                  validateSmartCard(smartCardNumber) ? styles.validIndicator : styles.invalidIndicator
                ]} />
              )}
            </View>
          </View>
        )}

        {customerInfo && (
          <View style={styles.customerInfoCard}>
            <Text style={styles.customerName}>{customerInfo.name}</Text>
            <Text style={styles.customerDetail}>{customerInfo.address}</Text>
          
          </View>
        )}

        {selectedProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Plan</Text>
            <View style={styles.plansContainer}>
              {plans[selectedProvider as keyof typeof plans].map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan?.id === plan.id && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Text
                    style={[
                      styles.planName,
                      selectedPlan?.id === plan.id && styles.selectedText,
                    ]}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    style={[
                      styles.planPrice,
                      selectedPlan?.id === plan.id && styles.selectedText,
                    ]}
                  >
                    ₦{plan.price.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedProvider && selectedPlan && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay ₦{selectedPlan.price.toLocaleString()}</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
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
            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Provider</Text>
                <Text style={styles.receiptValue}>
                  {providers.find(p => p.id === selectedProvider)?.name}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Plan</Text>
                <Text style={styles.receiptValue}>{selectedPlan?.name}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValue}>₦{selectedPlan?.price.toLocaleString()}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Smart Card Number</Text>
                <Text style={styles.receiptValue}>{smartCardNumber}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date</Text>
                <Text style={styles.receiptValue}>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
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
    padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
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
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    width: (width - 64) / 3,
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
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
  },
  input: {
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
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  planPrice: {
    fontSize: 16,
    color: '#045555',
    fontWeight: '600',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CableTV; 