import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Resident {
  id: string;
  name: string;
  houseNumber: string;
  status: 'active' | 'pending';
  phone: string;
  email: string;
  moveInDate: string;
}

// Mock data for residents
const mockResidents: Resident[] = [
  {
    id: '1',
    name: 'John Doe',
    houseNumber: 'Block 5, House 15',
    status: 'active',
    phone: '+234 123 456 7890',
    email: 'john@example.com',
    moveInDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    houseNumber: 'Block 2, House 8',
    status: 'pending',
    phone: '+234 098 765 4321',
    email: 'sarah@example.com',
    moveInDate: '2024-02-20',
  },
  // Add more mock data as needed
];

const ResidentsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');
  const [residents, setResidents] = useState(mockResidents);

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || resident.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (residentId: string, newStatus: 'active' | 'pending') => {
    setResidents(prev =>
      prev.map(resident =>
        resident.id === residentId
          ? { ...resident, status: newStatus }
          : resident
      )
    );
  };

  const handleRemoveResident = (residentId: string) => {
    Alert.alert(
      'Remove Resident',
      'Are you sure you want to remove this resident?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setResidents(prev => prev.filter(resident => resident.id !== residentId));
          },
        },
      ]
    );
  };

  const renderResidentCard = ({ item: resident }: { item: Resident }) => (
    <View style={styles.residentCard}>
      <View style={styles.residentInfo}>
        <Text style={styles.residentName}>{resident.name}</Text>
        <Text style={styles.residentDetail}>{resident.houseNumber}</Text>
        <Text style={styles.residentDetail}>{resident.phone}</Text>
        <Text style={styles.residentDetail}>{resident.email}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: resident.status === 'active' ? '#4CAF50' : '#FF9800' },
            ]}
          />
          <Text style={styles.statusText}>
            {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        {resident.status === 'pending' ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleStatusChange(resident.id, 'active')}
            >
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRemoveResident(resident.id)}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveResident(resident.id)}
          >
            <Text style={styles.actionButtonText}>Remove</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Manage Residents</Text>
        <TouchableOpacity>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search residents..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'all' && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === 'all' && styles.activeFilterButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'active' && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus('active')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === 'active' && styles.activeFilterButtonText,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterStatus === 'pending' && styles.activeFilterButton,
              ]}
              onPress={() => setFilterStatus('pending')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === 'pending' && styles.activeFilterButtonText,
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={filteredResidents}
          renderItem={renderResidentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.residentsList}
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
  residentsList: {
    padding: 20,
  },
  residentCard: {
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
  residentInfo: {
    marginBottom: 12,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  residentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF4444',
  },
  removeButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ResidentsScreen; 