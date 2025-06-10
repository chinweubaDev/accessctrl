import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Transaction {
  id: string;
  type: 'airtime' | 'data' | 'electricity' | 'dues' | 'gatepass';
  title: string;
  amount: number;
  date: string;
  status: 'successful' | 'pending' | 'failed';
  reference: string;
  details?: {
    [key: string]: string;
  };
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'airtime',
    title: 'Airtime Purchase',
    amount: 1000,
    date: '2024-06-08T10:30:00',
    status: 'successful',
    reference: 'AIR123456',
    details: {
      'Phone Number': '08012345678',
      'Network': 'MTN',
    },
  },
  {
    id: '2',
    type: 'dues',
    title: 'Monthly Service Charge',
    amount: 25000,
    date: '2024-06-07T14:20:00',
    status: 'successful',
    reference: 'DUE789012',
    details: {
      'Period': 'June 2024',
      'Due Date': '2024-06-30',
    },
  },
  {
    id: '3',
    type: 'electricity',
    title: 'Electricity Bill',
    amount: 15000,
    date: '2024-06-06T09:15:00',
    status: 'failed',
    reference: 'ELE345678',
    details: {
      'Meter Number': '12345678901',
      'Units': '150.5 kWh',
    },
  },
];

const filters = ['All', 'Airtime', 'Data', 'Electricity', 'Estate Dues', 'Gate Pass'];

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'successful':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#333';
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'airtime':
        return 'phone';
      case 'data':
        return 'wifi';
      case 'electricity':
        return 'zap';
      case 'dues':
        return 'credit-card';
      case 'gatepass':
        return 'key';
      default:
        return 'help-circle';
    }
  };

  const filteredTransactions = selectedFilter === 'All'
    ? transactions
    : transactions.filter(t => t.type === selectedFilter.toLowerCase().replace(' ', ''));

  const renderFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item && styles.filterChipSelected,
      ]}
      onPress={() => setSelectedFilter(item)}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedFilter === item && styles.filterChipTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => setSelectedTransaction(item)}
    >
      <View style={styles.transactionIcon}>
        <Feather name={getTransactionIcon(item.type)} size={24} color="#045555" />
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          ₦{item.amount.toLocaleString()}
        </Text>
        <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity>
          <Feather name="download" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Filters */}
        <FlatList
          data={filters}
          renderItem={renderFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />

        {/* Transactions List or Detail */}
        {!selectedTransaction ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.transactionsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedTransaction(null)}
            >
              <Feather name="chevron-left" size={20} color="#045555" />
              <Text style={styles.backButtonText}>Back to Transactions</Text>
            </TouchableOpacity>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Feather
                    name={getTransactionIcon(selectedTransaction.type)}
                    size={32}
                    color="#045555"
                  />
                </View>
                <View style={styles.detailHeaderInfo}>
                  <Text style={styles.detailTitle}>{selectedTransaction.title}</Text>
                  <Text style={styles.detailDate}>
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailAmount}>
                <Text style={styles.detailAmountValue}>
                  ₦{selectedTransaction.amount.toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.detailStatus,
                    { color: getStatusColor(selectedTransaction.status) },
                  ]}
                >
                  {selectedTransaction.status}
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailInfo}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reference:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.reference}</Text>
                </View>

                {selectedTransaction.details && 
                  Object.entries(selectedTransaction.details).map(([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{key}:</Text>
                      <Text style={styles.detailValue}>{value}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          </ScrollView>
        )}
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
  },
  filtersList: {
    padding: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipSelected: {
    backgroundColor: '#045555',
  },
  filterChipText: {
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  transactionsList: {
    padding: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailView: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#045555',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailHeaderInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detailDate: {
    fontSize: 14,
    color: '#666',
  },
  detailAmount: {
    alignItems: 'center',
    marginBottom: 24,
  },
  detailAmountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailStatus: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 24,
  },
  detailInfo: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default TransactionHistoryScreen; 