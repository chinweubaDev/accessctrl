import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Payment {
  id: string;
  residentName: string;
  houseNumber: string;
  amount: number;
  type: 'Estate Dues' | 'Development Levy' | 'Security Fee' | 'Other';
  date: string;
  status: 'successful' | 'pending' | 'failed';
  reference: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    residentName: 'John Doe',
    houseNumber: 'Block 5, House 15',
    amount: 25000,
    type: 'Estate Dues',
    date: '2024-06-15 10:30 AM',
    status: 'successful',
    reference: 'PAY-123456789',
  },
  {
    id: '2',
    residentName: 'Sarah Johnson',
    houseNumber: 'Block 2, House 8',
    amount: 50000,
    type: 'Development Levy',
    date: '2024-06-14 02:15 PM',
    status: 'pending',
    reference: 'PAY-987654321',
  },
];

const PaymentHistoryScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'successful' | 'pending' | 'failed'>('all');
  const [payments, setPayments] = useState(mockPayments);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#FF4444';
      default:
        return '#666';
    }
  };

  const generateReceipt = (payment: Payment) => {
    const receipt = `PAYMENT RECEIPT
Reference: ${payment.reference}
Date: ${payment.date}
Resident: ${payment.residentName}
House Number: ${payment.houseNumber}
Amount: ₦${payment.amount.toLocaleString()}
Type: ${payment.type}
Status: ${payment.status.toUpperCase()}`;

    Share.share({
      message: receipt,
      title: `Payment Receipt - ${payment.reference}`,
    });
  };

  const handleUpdateStatus = (paymentId: string, newStatus: Payment['status']) => {
    setPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: newStatus }
          : payment
      )
    );
  };

  const renderPaymentCard = ({ item: payment }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View>
          <Text style={styles.residentName}>{payment.residentName}</Text>
          <Text style={styles.paymentDetail}>{payment.houseNumber}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(payment.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.amount}>₦{payment.amount.toLocaleString()}</Text>
        <Text style={styles.paymentType}>{payment.type}</Text>
        <Text style={styles.paymentReference}>Ref: {payment.reference}</Text>
        <Text style={styles.paymentDate}>{payment.date}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.receiptButton]}
          onPress={() => generateReceipt(payment)}
        >
          <Feather name="download" size={16} color="#045555" />
          <Text style={styles.receiptButtonText}>Receipt</Text>
        </TouchableOpacity>

        {payment.status === 'pending' && (
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleUpdateStatus(payment.id, 'successful')}
            >
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleUpdateStatus(payment.id, 'failed')}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search payments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtons}
          >
            {['all', 'successful', 'pending', 'failed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.activeFilterButton,
                ]}
                onPress={() => setFilterStatus(status as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.activeFilterButtonText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.paymentsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
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
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    paddingRight: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
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
  activeFilterButton: {
    backgroundColor: '#045555',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  paymentsList: {
    padding: 20,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  residentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentDetail: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 4,
  },
  paymentType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentReference: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptButton: {
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
  },
  receiptButtonText: {
    color: '#045555',
    fontWeight: '600',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PaymentHistoryScreen; 