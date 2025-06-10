import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    ListRenderItem,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface SecurityGuard {
  id: string;
  name: string;
  phone: string;
  email: string;
  shift: 'morning' | 'afternoon' | 'night';
  status: 'active' | 'inactive';
  accessLevel: 'full' | 'restricted';
  assignedAreas: string[];
}

interface AccessPoint {
  id: string;
  name: string;
  type: 'gate' | 'door' | 'barrier';
  status: 'active' | 'inactive';
  requiresApproval: boolean;
  allowedUsers: string[];
  schedule: {
    open: string;
    close: string;
  };
}

// Mock data for security guards
const mockGuards: SecurityGuard[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+234 123 456 7890',
    email: 'john.smith@example.com',
    shift: 'morning',
    status: 'active',
    accessLevel: 'full',
    assignedAreas: ['Main Gate', 'Clubhouse', 'Pool Area'],
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    phone: '+234 098 765 4321',
    email: 'sarah.wilson@example.com',
    shift: 'night',
    status: 'active',
    accessLevel: 'restricted',
    assignedAreas: ['Main Gate', 'Residential Block A'],
  },
];

// Mock data for access points
const mockAccessPoints: AccessPoint[] = [
  {
    id: '1',
    name: 'Main Gate',
    type: 'gate',
    status: 'active',
    requiresApproval: true,
    allowedUsers: ['residents', 'security', 'admin'],
    schedule: {
      open: '06:00',
      close: '22:00',
    },
  },
  {
    id: '2',
    name: 'Clubhouse',
    type: 'door',
    status: 'active',
    requiresApproval: false,
    allowedUsers: ['residents', 'admin'],
    schedule: {
      open: '08:00',
      close: '20:00',
    },
  },
];

const SecurityAccessScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'guards' | 'access'>('guards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddGuardModal, setShowAddGuardModal] = useState(false);
  const [showAddPointModal, setShowAddPointModal] = useState(false);
  const [guards, setGuards] = useState<SecurityGuard[]>(mockGuards);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(mockAccessPoints);
  const [newGuard, setNewGuard] = useState<Partial<SecurityGuard>>({
    name: '',
    phone: '',
    email: '',
    shift: 'morning',
    status: 'active',
    accessLevel: 'restricted',
    assignedAreas: [],
  });
  const [newPoint, setNewPoint] = useState<Partial<AccessPoint>>({
    name: '',
    type: 'gate',
    status: 'active',
    requiresApproval: true,
    allowedUsers: [],
    schedule: {
      open: '06:00',
      close: '22:00',
    },
  });

  const handleDeleteGuard = (guardId: string) => {
    Alert.alert(
      'Delete Guard',
      'Are you sure you want to delete this security guard?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGuards(prev => prev.filter(guard => guard.id !== guardId));
          },
        },
      ]
    );
  };

  const handleToggleAccessPoint = (pointId: string) => {
    setAccessPoints(prev =>
      prev.map(point =>
        point.id === pointId
          ? { ...point, status: point.status === 'active' ? 'inactive' : 'active' }
          : point
      )
    );
  };

  const handleAddGuard = () => {
    if (!newGuard.name || !newGuard.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newId = (guards.length + 1).toString();
    setGuards(prev => [
      ...prev,
      {
        id: newId,
        ...newGuard,
      } as SecurityGuard,
    ]);

    setNewGuard({
      name: '',
      phone: '',
      email: '',
      shift: 'morning',
      status: 'active',
      accessLevel: 'restricted',
      assignedAreas: [],
    });
    setShowAddGuardModal(false);
  };

  const handleAddPoint = () => {
    if (!newPoint.name || !newPoint.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newId = (accessPoints.length + 1).toString();
    setAccessPoints(prev => [
      ...prev,
      {
        id: newId,
        ...newPoint,
      } as AccessPoint,
    ]);

    setNewPoint({
      name: '',
      type: 'gate',
      status: 'active',
      requiresApproval: true,
      allowedUsers: [],
      schedule: {
        open: '06:00',
        close: '22:00',
      },
    });
    setShowAddPointModal(false);
  };

  const renderGuardCard: ListRenderItem<SecurityGuard> = ({ item: guard }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{guard.name}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  guard.status === 'active' ? '#4CAF50' : '#FF9800',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {guard.status.charAt(0).toUpperCase() + guard.status.slice(1)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteGuard(guard.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Feather name="phone" size={16} color="#666" />
          <Text style={styles.detailText}>{guard.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="mail" size={16} color="#666" />
          <Text style={styles.detailText}>{guard.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Feather name="clock" size={16} color="#666" />
          <Text style={styles.detailText}>
            {guard.shift.charAt(0).toUpperCase() + guard.shift.slice(1)} Shift
          </Text>
        </View>
      </View>

      <View style={styles.areasContainer}>
        <Text style={styles.areasTitle}>Assigned Areas:</Text>
        <View style={styles.areasList}>
          {guard.assignedAreas.map((area, index) => (
            <View key={index} style={styles.areaTag}>
              <Text style={styles.areaText}>{area}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAccessPointCard: ListRenderItem<AccessPoint> = ({
    item: point,
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{point.name}</Text>
          <View style={styles.typeTag}>
            <Feather
              name={
                point.type === 'gate'
                  ? 'git-branch'
                  : point.type === 'door'
                  ? 'square'
                  : 'minus'
              }
              size={14}
              color="#045555"
            />
            <Text style={styles.typeText}>
              {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
            </Text>
          </View>
        </View>
        <Switch
          value={point.status === 'active'}
          onValueChange={() => handleToggleAccessPoint(point.id)}
          trackColor={{ false: '#ddd', true: '#045555' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Operating Hours:</Text>
        <Text style={styles.scheduleText}>
          {point.schedule.open} - {point.schedule.close}
        </Text>
      </View>

      <View style={styles.accessContainer}>
        <Text style={styles.accessTitle}>Access Control:</Text>
        <View style={styles.accessDetails}>
          <View style={styles.approvalRow}>
            <Text style={styles.approvalText}>Requires Approval</Text>
            <View
              style={[
                styles.approvalBadge,
                {
                  backgroundColor: point.requiresApproval
                    ? '#FF9800'
                    : '#4CAF50',
                },
              ]}
            >
              <Text style={styles.approvalBadgeText}>
                {point.requiresApproval ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          <View style={styles.allowedUsers}>
            {point.allowedUsers.map((user, index) => (
              <View key={index} style={styles.userTag}>
                <Text style={styles.userTagText}>
                  {user.charAt(0).toUpperCase() + user.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
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
        <Text style={styles.headerTitle}>Security Access</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'guards' && styles.activeTab]}
            onPress={() => setActiveTab('guards')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'guards' && styles.activeTabText,
              ]}
            >
              Security Guards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'access' && styles.activeTab]}
            onPress={() => setActiveTab('access')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'access' && styles.activeTabText,
              ]}
            >
              Access Points
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'guards'
                  ? 'Search security guards...'
                  : 'Search access points...'
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              activeTab === 'guards'
                ? setShowAddGuardModal(true)
                : setShowAddPointModal(true)
            }
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>
              Add {activeTab === 'guards' ? 'Guard' : 'Point'}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'guards' ? (
          <FlatList
            data={guards.filter(guard =>
              guard.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderGuardCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={accessPoints.filter(point =>
              point.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderAccessPointCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        visible={showAddGuardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddGuardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Security Guard</Text>
              <TouchableOpacity
                onPress={() => setShowAddGuardModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newGuard.name}
                  onChangeText={(text) =>
                    setNewGuard({ ...newGuard, name: text })
                  }
                  placeholder="Enter guard name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={newGuard.phone}
                  onChangeText={(text) =>
                    setNewGuard({ ...newGuard, phone: text })
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newGuard.email}
                  onChangeText={(text) =>
                    setNewGuard({ ...newGuard, email: text })
                  }
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Shift</Text>
                <View style={styles.optionsContainer}>
                  {['morning', 'afternoon', 'night'].map((shift) => (
                    <TouchableOpacity
                      key={shift}
                      style={[
                        styles.optionButton,
                        newGuard.shift === shift && styles.selectedOption,
                      ]}
                      onPress={() =>
                        setNewGuard({ ...newGuard, shift: shift as any })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          newGuard.shift === shift && styles.selectedOptionText,
                        ]}
                      >
                        {shift.charAt(0).toUpperCase() + shift.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Access Level</Text>
                <View style={styles.optionsContainer}>
                  {['restricted', 'full'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.optionButton,
                        newGuard.accessLevel === level && styles.selectedOption,
                      ]}
                      onPress={() =>
                        setNewGuard({ ...newGuard, accessLevel: level as any })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          newGuard.accessLevel === level &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddGuard}
              >
                <Text style={styles.submitButtonText}>Add Guard</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddPointModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddPointModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Access Point</Text>
              <TouchableOpacity
                onPress={() => setShowAddPointModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newPoint.name}
                  onChangeText={(text) =>
                    setNewPoint({ ...newPoint, name: text })
                  }
                  placeholder="Enter access point name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.optionsContainer}>
                  {['gate', 'door', 'barrier'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton,
                        newPoint.type === type && styles.selectedOption,
                      ]}
                      onPress={() =>
                        setNewPoint({ ...newPoint, type: type as any })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          newPoint.type === type && styles.selectedOptionText,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Schedule</Text>
                <View style={styles.scheduleContainer}>
                  <View style={styles.scheduleInput}>
                    <Text style={styles.scheduleLabel}>Open</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={newPoint.schedule?.open}
                      onChangeText={(text) =>
                        setNewPoint({
                          ...newPoint,
                          schedule: { 
                            open: text,
                            close: newPoint.schedule?.close || '22:00'
                          },
                        })
                      }
                      placeholder="HH:MM"
                    />
                  </View>
                  <View style={styles.scheduleInput}>
                    <Text style={styles.scheduleLabel}>Close</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={newPoint.schedule?.close}
                      onChangeText={(text) =>
                        setNewPoint({
                          ...newPoint,
                          schedule: {
                            open: newPoint.schedule?.open || '06:00',
                            close: text
                          },
                        })
                      }
                      placeholder="HH:MM"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      newPoint.requiresApproval && styles.checkedBox,
                    ]}
                    onPress={() =>
                      setNewPoint({
                        ...newPoint,
                        requiresApproval: !newPoint.requiresApproval,
                      })
                    }
                  >
                    {newPoint.requiresApproval && (
                      <Feather name="check" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Requires Approval</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddPoint}
              >
                <Text style={styles.submitButtonText}>Add Access Point</Text>
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
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  areasContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  areasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  areasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  areaTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  areaText: {
    color: '#666',
    fontSize: 12,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeText: {
    color: '#045555',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  scheduleContainer: {
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scheduleText: {
    color: '#666',
    fontSize: 14,
  },
  accessContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  accessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  accessDetails: {
    gap: 8,
  },
  approvalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  approvalText: {
    color: '#666',
    fontSize: 14,
  },
  approvalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvalBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  allowedUsers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  userTag: {
    backgroundColor: '#e8f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  userTagText: {
    color: '#045555',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#045555',
  },
  optionText: {
    color: '#666',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#fff',
  },
  scheduleInput: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#045555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#045555',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecurityAccessScreen; 