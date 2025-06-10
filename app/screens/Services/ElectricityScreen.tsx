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
interface Distributor {
  id: string;
  name: string;
  logo: ImageSourcePropType;
}

const distributors: Distributor[] = [
  { id: '1', name: 'EKEDC', logo: images.ekedc },
  { id: '2', name: 'IKEDC', logo: images.ikedc },
  { id: '3', name: 'AEDC', logo: images.aedc },
  { id: '4', name: 'PHEDC', logo: images.phedc },
];

const quickAmounts = ['1000', '2000', '5000', '10000', '20000'];

const ElectricityScreen = () => {
  const navigation = useNavigation();
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [meterInfo, setMeterInfo] = useState<{ name: string; address: string } | null>(null);

  const handleVerifyMeter = () => {
    // Implement meter verification logic
    setMeterInfo({
      name: 'John Doe',
      address: '123 Main Street, Lagos',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Electricity Bill</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Distributor Selection */}
        <Text style={styles.sectionTitle}>Select Distributor</Text>
        <View style={styles.distributorGrid}>
          {distributors.map((distributor) => (
            <TouchableOpacity
              key={distributor.id}
              style={[
                styles.distributorCard,
                selectedDistributor?.id === distributor.id && styles.distributorCardSelected,
              ]}
              onPress={() => setSelectedDistributor(distributor)}
            >
              <Image source={distributor.logo} style={styles.distributorLogo} />
              <Text style={styles.distributorName}>{distributor.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meter Number Input */}
        <Text style={styles.sectionTitle}>Meter Number</Text>
        <View style={styles.meterInputContainer}>
          <TextInput
            style={styles.meterInput}
            placeholder="Enter meter number"
            keyboardType="numeric"
            value={meterNumber}
            onChangeText={setMeterNumber}
          />
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerifyMeter}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Meter Info */}
        {meterInfo && (
          <View style={styles.meterInfoCard}>
            <Text style={styles.meterInfoTitle}>Meter Information</Text>
            <View style={styles.meterInfoRow}>
              <Text style={styles.meterInfoLabel}>Name:</Text>
              <Text style={styles.meterInfoValue}>{meterInfo.name}</Text>
            </View>
            <View style={styles.meterInfoRow}>
              <Text style={styles.meterInfoLabel}>Address:</Text>
              <Text style={styles.meterInfoValue}>{meterInfo.address}</Text>
            </View>
          </View>
        )}

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

        {/* Pay Button */}
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay Now</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  distributorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  distributorCard: {
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
  distributorCardSelected: {
    borderColor: '#045555',
    borderWidth: 2,
  },
  distributorLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  distributorName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  meterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  meterInput: {
    flex: 1,
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
  verifyButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  meterInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meterInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  meterInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  meterInfoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  meterInfoValue: {
    flex: 1,
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
  payButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ElectricityScreen; 