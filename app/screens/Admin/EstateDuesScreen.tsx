import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
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

interface DuesCategory {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  description: string;
  dueDate: string;
}

interface PaymentRecord {
  id: string;
  residentName: string;
  houseNumber: string;
  category: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

// Mock data for dues categories
const mockDuesCategories: DuesCategory[] = [
  {
    id: '1',
    name: 'Monthly Service Charge',
    amount: 10000,
    frequency: 'monthly',
    description: 'Regular estate maintenance and security services',
    dueDate: 'Every 1st of the month',
  },
  {
    id: '2',
    name: 'Development Levy',
    amount: 50000,
    frequency: 'yearly',
    description: 'Estate infrastructure development and improvements',
    dueDate: 'January 31st',
  },
  // Add more mock data as needed
];

// Mock data for payment history
const mockPaymentHistory: PaymentRecord[] = [
  {
    id: '1',
    residentName: 'John Doe',
    houseNumber: 'Block 5, House 15',
    category: 'Monthly Service Charge',
    amount: 10000,
    date: '2024-06-01',
    status: 'paid',
  },
  {
    id: '2',
    residentName: 'Sarah Johnson',
    houseNumber: 'Block 2, House 8',
    category: 'Development Levy',
    amount: 50000,
    date: '2024-01-15',
    status: 'pending',
  },
  // Add more mock data as needed
];

const EstateAdmiDuesScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'categories' | 'history'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    amount: '',
    frequency: '',
    description: '',
    dueDate: '',
  });
  const [duesCategories, setDuesCategories] = useState(mockDuesCategories);
  const [paymentHistory, setPaymentHistory] = useState(mockPaymentHistory);

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.amount || !newCategory.frequency) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newId = (duesCategories.length + 1).toString();
    setDuesCategories(prev => [
      ...prev,
      {
        id: newId,
        ...newCategory,
        amount: parseFloat(newCategory.amount),
      },
    ]);

    setNewCategory({
      name: '',
      amount: '',
      frequency: '',
      description: '',
      dueDate: '',
    });
    setShowAddModal(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDuesCategories(prev =>
              prev.filter(category => category.id !== categoryId)
            );
          },
        },
      ]
    );
  };

  const renderCategoryCard = ({ item: category }: { item: DuesCategory }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteCategory(category.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.amount}>₦{category.amount.toLocaleString()}</Text>
      <Text style={styles.frequency}>
        {category.frequency.charAt(0).toUpperCase() + category.frequency.slice(1)}
      </Text>
      <Text style={styles.description}>{category.description}</Text>
      <Text style={styles.dueDate}>Due: {category.dueDate}</Text>
    </View>
  );

  const renderPaymentHistoryItem = ({ item: payment }: { item: PaymentRecord }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentInfo}>
        <Text style={styles.residentName}>{payment.residentName}</Text>
        <Text style={styles.paymentDetail}>{payment.houseNumber}</Text>
        <Text style={styles.paymentDetail}>{payment.category}</Text>
        <Text style={styles.paymentAmount}>₦{payment.amount.toLocaleString()}</Text>
        <Text style={styles.paymentDate}>{payment.date}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: payment.status === 'paid' ? '#4CAF50' : '#FF9800' },
        ]}
      >
        <Text style={styles.statusText}>
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </Text>
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
        <Text style={styles.headerTitle}>Estate Dues</Text>
        {activeTab === 'categories' && (
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Feather name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
            onPress={() => setActiveTab('categories')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'categories' && styles.activeTabText,
              ]}
            >
              Categories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.activeTabText,
              ]}
            >
              Payment History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'categories'
                  ? 'Search categories...'
                  : 'Search payments...'
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {activeTab === 'categories' ? (
          <FlatList
            data={duesCategories.filter(category =>
              category.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={paymentHistory.filter(
              payment =>
                payment.residentName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                payment.houseNumber
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )}
            renderItem={renderPaymentHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newCategory.name}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, name: text })
                  }
                  placeholder="Enter category name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount (₦) *</Text>
                <TextInput
                  style={styles.input}
                  value={newCategory.amount}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, amount: text })
                  }
                  placeholder="Enter amount"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Frequency *</Text>
                <TextInput
                  style={styles.input}
                  value={newCategory.frequency}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, frequency: text })
                  }
                  placeholder="e.g., monthly, yearly"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newCategory.description}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, description: text })
                  }
                  placeholder="Enter description"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  value={newCategory.dueDate}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, dueDate: text })
                  }
                  placeholder="e.g., Every 1st of the month"
                />
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCategory}
              >
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#045555',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#045555',
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
  listContainer: {
    padding: 20,
  },
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 8,
  },
  frequency: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paymentCard: {
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
  paymentInfo: {
    flex: 1,
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
    marginBottom: 2,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#045555',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EstateAdmiDuesScreen; 