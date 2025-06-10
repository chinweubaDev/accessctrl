import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Image,
    ImageSourcePropType,
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
interface Network {
  id: string;
  name: string;
  logo: ImageSourcePropType;
}

const networks: Network[] = [
    { id: '1', name: 'MTN', logo: images.mtn },
  { id: '2', name: 'Airtel', logo: images.airtel },
  { id: '3', name: 'Glo', logo: images.glo },
  { id: '4', name: '9mobile', logo: images.mobile9 },
];

const quickAmounts = ['100', '200', '500', '1000', '2000', '5000'];

const AirtimeDataScreen = () => {
  const navigation = useNavigation();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isData, setIsData] = useState(false);

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
            onPress={() => setIsData(false)}
          >
            <Text style={[styles.toggleText, !isData && styles.toggleTextActive]}>Airtime</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isData && styles.toggleActive]}
            onPress={() => setIsData(true)}
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
              onPress={() => setSelectedNetwork(network)}
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

        {/* Purchase Button */}
        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.purchaseButtonText}>Purchase Now</Text>
        </TouchableOpacity>
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
});

export default AirtimeDataScreen; 