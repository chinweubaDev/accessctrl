import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
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

// Mock data for visitors
const mockVisitors = [
  {
    id: '1',
    name: 'Mike Wilson',
    host: 'John Doe',
    houseNumber: 'Block 5, House 15',
    purpose: 'Personal Visit',
    status: 'active',
    checkIn: '2024-06-15 10:30 AM',
    expectedDuration: '2 hours',
  },
  {
    id: '2',
    name: 'Emma Thompson',
    host: 'Sarah Johnson',
    houseNumber: 'Block 2, House 8',
    purpose: 'Delivery',
    status: 'pending',
    checkIn: '2024-06-15 11:00 AM',
    expectedDuration: '30 minutes',
  },
  // Add more mock data as needed
];

const VisitorsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [visitors, setVisitors] = useState(mockVisitors);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visitor.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visitor.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visitor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (visitorId: string, newStatus: 'active' | 'pending' | 'completed') => {
    setVisitors(prev =>
      prev.map(visitor =>
        visitor.id === visitorId
          ? { ...visitor, status: newStatus }
          : visitor
      )
    );
  };

  const handleRemoveVisitor = (visitorId: string) => {
    Alert.alert(
      'Remove Visitor',
      'Are you sure you want to remove this visitor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setVisitors(prev => prev.filter(visitor => visitor.id !== visitorId));
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#666';
      default:
        return '#666';
    }
  };

  const renderVisitorCard = ({ item: visitor }) => (
    <View style={styles.visitorCard}>
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>{visitor.name}</Text>
        <Text style={styles.visitorDetail}>Host: {visitor.host}</Text>
        <Text style={styles.visitorDetail}>{visitor.houseNumber}</Text>
        <Text style={styles.visitorDetail}>Purpose: {visitor.purpose}</Text>
        <Text style={styles.visitorDetail}>Check-in: {visitor.checkIn}</Text>
        <Text style={styles.visitorDetail}>Duration: {visitor.expectedDuration}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(visitor.status) },
            ]}
          />
          <Text style={styles.statusText}>
            {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        {visitor.status === 'pending' ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleStatusChange(visitor.id, 'active')}
            >
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRemoveVisitor(visitor.id)}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : visitor.status === 'active' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusChange(visitor.id, 'completed')}
          >
            <Text style={styles.actionButtonText}>Complete Visit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveVisitor(visitor.id)}
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
        <Text style={styles.headerTitle}>Manage Visitors</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search visitors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtons}
          >
            {['all', 'active', 'pending', 'completed'].map((status) => (
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
          data={filteredVisitors}
          renderItem={renderVisitorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.visitorsList}
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
  visitorsList: {
    padding: 20,
  },
  visitorCard: {
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
  visitorInfo: {
    marginBottom: 12,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  visitorDetail: {
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
  completeButton: {
    backgroundColor: '#045555',
  },
  removeButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default VisitorsScreen; 