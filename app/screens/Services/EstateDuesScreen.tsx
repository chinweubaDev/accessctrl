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
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const dues = [
  {
    id: '1',
    title: 'Monthly Service Charge',
    amount: 15000,
    dueDate: '2024-07-01',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Security Levy',
    amount: 25000,
    dueDate: '2024-07-01',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Infrastructure Development',
    amount: 50000,
    dueDate: '2024-12-31',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Waste Management',
    amount: 5000,
    dueDate: '2024-07-01',
    status: 'paid',
  },
  {
    id: '5',
    title: 'Street Lighting',
    amount: 10000,
    dueDate: '2024-07-01',
    status: 'paid',
  },
];

const EstateDuesScreen = () => {
  const navigation = useNavigation();
  const [selectedDues, setSelectedDues] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const toggleDueSelection = (dueId: string) => {
    setSelectedDues(prev =>
      prev.includes(dueId)
        ? prev.filter(id => id !== dueId)
        : [...prev, dueId]
    );
  };

  const handlePayment = () => {
    if (selectedDues.length === 0) {
      Alert.alert('Error', 'Please select at least one due to pay');
      return;
    }

    const totalAmount = dues
      .filter(due => selectedDues.includes(due.id))
      .reduce((sum, due) => sum + due.amount, 0);

    setPaymentAmount(totalAmount);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSelectedDues([]);
  };

  const pendingDues = dues.filter(due => due.status === 'pending');
  const paidDues = dues.filter(due => due.status === 'paid');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estate Dues</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {pendingDues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Dues</Text>
            {pendingDues.map((due) => (
              <TouchableOpacity
                key={due.id}
                style={styles.dueCard}
                onPress={() => toggleDueSelection(due.id)}
              >
                <View style={styles.dueInfo}>
                  <Text style={styles.dueTitle}>{due.title}</Text>
                  <Text style={styles.dueAmount}>₦{due.amount.toLocaleString()}</Text>
                  <Text style={styles.dueDate}>Due: {new Date(due.dueDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.checkbox}>
                  {selectedDues.includes(due.id) && (
                    <Feather name="check" size={20} color="#045555" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedDues.length > 0 && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>
              Pay ₦{dues
                .filter(due => selectedDues.includes(due.id))
                .reduce((sum, due) => sum + due.amount, 0)
                .toLocaleString()}
            </Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {paidDues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paid Dues</Text>
            {paidDues.map((due) => (
              <View key={due.id} style={[styles.dueCard, styles.paidCard]}>
                <View style={styles.dueInfo}>
                  <Text style={styles.dueTitle}>{due.title}</Text>
                  <Text style={styles.dueAmount}>₦{due.amount.toLocaleString()}</Text>
                  <Text style={styles.dueDate}>Paid on {new Date().toLocaleDateString()}</Text>
                </View>
                <View style={styles.paidBadge}>
                  <Feather name="check-circle" size={20} color="#4CAF50" />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Feather name="check-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount Paid</Text>
                <Text style={styles.receiptValue}>₦{paymentAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Items</Text>
                <Text style={styles.receiptValue}>{selectedDues.length} items</Text>
              </View>
              <View style={styles.selectedItems}>
                {dues.filter(due => selectedDues.includes(due.id)).map(due => (
                  <View key={due.id} style={styles.selectedItemRow}>
                    <Text style={styles.selectedItemText}>{due.title}</Text>
                    <Text style={styles.selectedItemAmount}>₦{due.amount.toLocaleString()}</Text>
                  </View>
                ))}
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
              onPress={handleCloseModal}
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
  dueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  paidCard: {
    opacity: 0.8,
  },
  dueInfo: {
    flex: 1,
  },
  dueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dueAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#045555',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paidBadge: {
    marginLeft: 12,
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
  selectedItems: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  selectedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#666',
  },
  selectedItemAmount: {
    fontSize: 14,
    fontWeight: '500',
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

export default EstateDuesScreen; 