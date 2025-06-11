import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
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
import images from '../../constants/images';

const { width } = Dimensions.get('window');

interface Network {
  id: string;
  name: string;
  logo: ImageSourcePropType;
}

interface DataPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  price: number;
}

const networks: Network[] = [
  { id: 'mtn', name: 'MTN', logo: images.mtn },
  { id: 'airtel', name: 'Airtel', logo: images.airtel },
  { id: 'glo', name: 'Glo', logo: images.glo },
  { id: '9mobile', name: '9mobile', logo: images.mobile9 },
];

const dataPlans: { [key: string]: DataPlan[] } = {
  mtn: [
    { id: 'mtn1', name: 'Daily Plan', data: '1GB', validity: '1 Day', price: 300 },
    { id: 'mtn2', name: 'Weekly Plan', data: '6GB', validity: '7 Days', price: 1500 },
    { id: 'mtn3', name: 'Monthly Lite', data: '10GB', validity: '30 Days', price: 2500 },
    { id: 'mtn4', name: 'Monthly Plus', data: '20GB', validity: '30 Days', price: 5000 },
    { id: 'mtn5', name: 'Mega Bundle', data: '40GB', validity: '30 Days', price: 10000 },
  ],
  airtel: [
    { id: 'airtel1', name: 'Daily Plan', data: '1.5GB', validity: '1 Day', price: 300 },
    { id: 'airtel2', name: 'Weekly Plus', data: '7GB', validity: '7 Days', price: 1500 },
    { id: 'airtel3', name: 'Monthly Basic', data: '15GB', validity: '30 Days', price: 3000 },
    { id: 'airtel4', name: 'Monthly Extra', data: '25GB', validity: '30 Days', price: 5000 },
    { id: 'airtel5', name: 'Mega Plan', data: '50GB', validity: '30 Days', price: 10000 },
  ],
  glo: [
    { id: 'glo1', name: 'Daily Special', data: '2GB', validity: '1 Day', price: 300 },
    { id: 'glo2', name: 'Weekly Value', data: '8GB', validity: '7 Days', price: 1500 },
    { id: 'glo3', name: 'Monthly Basic', data: '15GB', validity: '30 Days', price: 3000 },
    { id: 'glo4', name: 'Monthly Plus', data: '25GB', validity: '30 Days', price: 5000 },
    { id: 'glo5', name: 'Super Plan', data: '50GB', validity: '30 Days', price: 10000 },
  ],
  '9mobile': [
    { id: '9mobile1', name: 'Daily Plus', data: '1GB', validity: '1 Day', price: 300 },
    { id: '9mobile2', name: 'Weekly Value', data: '5GB', validity: '7 Days', price: 1500 },
    { id: '9mobile3', name: 'Monthly Lite', data: '11GB', validity: '30 Days', price: 3000 },
    { id: '9mobile4', name: 'Monthly Plus', data: '20GB', validity: '30 Days', price: 5000 },
    { id: '9mobile5', name: 'Mega Bundle', data: '40GB', validity: '30 Days', price: 10000 },
  ],
};

const quickAmounts = ['100', '200', '500', '1000', '2000', '5000'];

const AirtimeDataScreen = () => {
  const navigation = useNavigation();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isData, setIsData] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setSelectedPlan(null);
  };

  const resetForm = () => {
    setSelectedNetwork(null);
    setAmount('');
    setPhoneNumber('');
    setSelectedPlan(null);
    setShowSuccessModal(false);
  };

  const handlePurchase = () => {
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy {isData ? 'Data' : 'Airtime'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Toggle Button */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !isData && styles.toggleActive]}
            onPress={() => {
              setIsData(false);
              setSelectedPlan(null);
            }}
          >
            <Text style={[styles.toggleText, !isData && styles.toggleTextActive]}>Airtime</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isData && styles.toggleActive]}
            onPress={() => {
              setIsData(true);
              setAmount('');
            }}
          >
            <Text style={[styles.toggleText, isData && styles.toggleTextActive]}>Data Bundle</Text>
          </TouchableOpacity>
        </View>

        {/* Network Selection */}
        <Text style={styles.sectionTitle}>Select Network</Text>
        <View style={styles.networkGrid}>
          {networks.map((network) => (
            <TouchableOpacity
              key={network.id}
              style={[
                styles.networkCard,
                selectedNetwork?.id === network.id && styles.networkCardSelected,
              ]}
              onPress={() => handleNetworkSelect(network)}
            >
              <Image source={network.logo} style={styles.networkLogo} />
              <Text style={styles.networkName}>{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone Number Input */}
        <Text style={styles.sectionTitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {!isData ? (
          <>
            {/* Amount Section */}
            <Text style={styles.sectionTitle}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Quick Amounts */}
            <View style={styles.quickAmounts}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount)}
                >
                  <Text style={styles.quickAmountText}>₦{quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : selectedNetwork ? (
          <View style={styles.dataPlansContainer}>
            <Text style={styles.sectionTitle}>Select Data Plan</Text>
            {dataPlans[selectedNetwork.id].map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.dataPlanCard,
                  selectedPlan?.id === plan.id && styles.selectedDataPlan,
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View>
                  <Text style={[
                    styles.dataPlanName,
                    selectedPlan?.id === plan.id && styles.selectedDataPlanText
                  ]}>
                    {plan.name}
                  </Text>
                  <View style={styles.dataPlanDetails}>
                    <View style={styles.detailItem}>
                      <Feather 
                        name="database" 
                        size={14} 
                        color={selectedPlan?.id === plan.id ? '#fff' : '#666'} 
                      />
                      <Text style={[
                        styles.detailText,
                        selectedPlan?.id === plan.id && styles.selectedDataPlanText
                      ]}>
                        {plan.data}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Feather 
                        name="clock" 
                        size={14} 
                        color={selectedPlan?.id === plan.id ? '#fff' : '#666'} 
                      />
                      <Text style={[
                        styles.detailText,
                        selectedPlan?.id === plan.id && styles.selectedDataPlanText
                      ]}>
                        {plan.validity}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[
                  styles.dataPlanPrice,
                  selectedPlan?.id === plan.id && styles.selectedDataPlanText
                ]}>
                  ₦{plan.price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <TouchableOpacity 
          style={[
            styles.purchaseButton,
            (!phoneNumber || (!amount && !selectedPlan)) && styles.purchaseButtonDisabled
          ]}
          disabled={!phoneNumber || (!amount && !selectedPlan)}
          onPress={handlePurchase}
        >
          <Text style={styles.purchaseButtonText}>
            Purchase {isData ? `${selectedPlan?.data} for ₦${selectedPlan?.price.toLocaleString()}` : `₦${amount} Airtime`}
          </Text>
        </TouchableOpacity>
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
            <Text style={styles.successTitle}>Purchase Successful!</Text>
            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Network</Text>
                <Text style={styles.receiptValue}>{selectedNetwork?.name}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Phone Number</Text>
                <Text style={styles.receiptValue}>{phoneNumber}</Text>
              </View>
              {isData ? (
                <>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Data Plan</Text>
                    <Text style={styles.receiptValue}>{selectedPlan?.data}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Validity</Text>
                    <Text style={styles.receiptValue}>{selectedPlan?.validity}</Text>
                  </View>
                </>
              ) : null}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount</Text>
                <Text style={styles.receiptValue}>
                  ₦{isData ? selectedPlan?.price.toLocaleString() : amount}
                </Text>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#045555',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  networkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  networkCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  networkCardSelected: {
    borderColor: '#045555',
    borderWidth: 2,
  },
  networkLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  networkName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickAmountButton: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAmountText: {
    color: '#045555',
    fontWeight: '500',
  },
  dataPlansContainer: {
    marginTop: 20,
  },
  dataPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  selectedDataPlan: {
    backgroundColor: '#045555',
  },
  dataPlanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedDataPlanText: {
    color: '#fff',
  },
  dataPlanDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  dataPlanPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#045555',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#ccc',
  },
  purchaseButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default AirtimeDataScreen; 