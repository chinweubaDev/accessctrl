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

interface DueCategory {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: 'successful' | 'pending' | 'failed';
}

const dueCategories: DueCategory[] = [
  {
    id: '1',
    name: 'Monthly Service Charge',
    amount: 25000,
    dueDate: '2024-07-01',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Security Levy',
    amount: 15000,
    dueDate: '2024-07-01',
    status: 'paid',
  },
  {
    id: '3',
    name: 'Infrastructure Development',
    amount: 50000,
    dueDate: '2024-06-15',
    status: 'overdue',
  },
];

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'Security Levy',
    amount: 15000,
    date: '2024-06-01',
    status: 'successful',
  },
  {
    id: '2',
    type: 'Monthly Service Charge',
    amount: 25000,
    date: '2024-05-01',
    status: 'successful',
  },
  {
    id: '3',
    type: 'Infrastructure Development',
    amount: 50000,
    date: '2024-04-15',
    status: 'successful',
  },
];

const EstateDuesScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<DueCategory | null>(null);

  const getStatusColor = (status: DueCategory['status'] | Transaction['status']) => {
    switch (status) {
      case 'paid':
      case 'successful':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'overdue':
      case 'failed':
        return '#F44336';
      default:
        return '#333';
    }
  };

  const renderDueCategory = ({ item }: { item: DueCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory?.id === item.id && styles.categoryCardSelected,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.amount}>₦{item.amount.toLocaleString()}</Text>
      <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>₦{item.amount.toLocaleString()}</Text>
        <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estate Dues</Text>
        <TouchableOpacity>
          <Feather name="help-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Due Categories */}
        <Text style={styles.sectionTitle}>Outstanding Dues</Text>
        <FlatList
          data={dueCategories}
          renderItem={renderDueCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Pay Button */}
        {selectedCategory && (
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>
              Pay ₦{selectedCategory.amount.toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardSelected: {
    borderColor: '#045555',
    borderWidth: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsSection: {
    flex: 1,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
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
});

export default EstateDuesScreen; 