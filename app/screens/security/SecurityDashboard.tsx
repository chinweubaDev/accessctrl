import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for visitors
const mockVisitors = [
  {
    id: '1',
    name: 'John Smith',
    code: 'VS1234',
    host: 'House 45A',
    status: 'checked-in',
    time: '10:30 AM',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    code: 'VS5678',
    host: 'House 12B',
    status: 'pending',
    time: '11:00 AM',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    code: 'VS9012',
    host: 'House 78C',
    status: 'checked-out',
    time: '09:45 AM',
  },
];

type RootStackParamList = {
  ProfileSettings: undefined;
  // add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SecurityDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchCode, setSearchCode] = useState('');
  const [visitors, setVisitors] = useState(mockVisitors);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    setSearchCode(data);
    handleVerifyCode(data);
  };

  const handleVerifyCode = (code: string = searchCode) => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter or scan a visitor code');
      return;
    }

    const visitor = visitors.find(v => v.code === code.toUpperCase());
    if (visitor) {
      Alert.alert(
        'Visitor Found',
        `Name: ${visitor.name}\nHost: ${visitor.host}\nStatus: ${visitor.status}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: visitor.status === 'checked-in' ? 'Check Out' : 'Check In',
            onPress: () => handleCheckInOut(visitor.id),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Invalid visitor code');
    }
  };

  const handleCheckInOut = (visitorId: string) => {
    setVisitors(prevVisitors =>
      prevVisitors.map(visitor =>
        visitor.id === visitorId
          ? {
              ...visitor,
              status: visitor.status === 'checked-in' ? 'checked-out' : 'checked-in',
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
            }
          : visitor
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return '#4CAF50';
      case 'checked-out':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Security Dashboard</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettings')}
        >
          <Feather name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter visitor code"
              value={searchCode}
              onChangeText={setSearchCode}
              autoCapitalize="characters"
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <Feather name="camera" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => handleVerifyCode()}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {visitors.filter(v => v.status === 'checked-in').length}
            </Text>
            <Text style={styles.statLabel}>Active Visitors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {visitors.filter(v => v.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {visitors.filter(v => v.status === 'checked-out').length}
            </Text>
            <Text style={styles.statLabel}>Checked Out</Text>
          </View>
        </View>

        <View style={styles.visitorsList}>
          <Text style={styles.sectionTitle}>Recent Visitors</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {visitors.map((visitor) => (
              <TouchableOpacity
                key={visitor.id}
                style={styles.visitorCard}
                onPress={() => handleCheckInOut(visitor.id)}
              >
                <View style={styles.visitorInfo}>
                  <Text style={styles.visitorName}>{visitor.name}</Text>
                  <Text style={styles.visitorHost}>{visitor.host}</Text>
                  <Text style={styles.visitorTime}>{visitor.time}</Text>
                </View>
                <View style={styles.visitorStatus}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(visitor.status) },
                    ]}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(visitor.status) },
                  ]}>
                    {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Modal
          visible={showScanner}
          onRequestClose={() => setShowScanner(false)}
          animationType="slide"
        >
          <SafeAreaView style={styles.scannerContainer}>
            <View style={styles.scannerHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowScanner(false)}
              >
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.scannerTitle}>Scan Visitor Code</Text>
              <View style={{ width: 24 }} />
            </View>
            {hasPermission === null ? (
              <Text style={styles.scannerText}>Requesting camera permission...</Text>
            ) : hasPermission === false ? (
              <Text style={styles.scannerText}>No access to camera</Text>
            ) : (
              <View style={styles.scanner}>
                <BarCodeScanner
                  onBarCodeScanned={handleBarCodeScanned}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.scannerOverlay}>
                  <View style={styles.scannerTarget} />
                </View>
              </View>
            )}
            <Text style={styles.scannerInstructions}>
              Position the barcode within the frame to scan
            </Text>
          </SafeAreaView>
        </Modal>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
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
  searchIcon: {
    padding: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  visitorsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  visitorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  visitorHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  visitorTime: {
    fontSize: 12,
    color: '#999',
  },
  visitorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#045555',
  },
  closeButton: {
    padding: 4,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanner: {
    flex: 1,
    overflow: 'hidden',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerTarget: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  scannerInstructions: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#045555',
  },
});

export default SecurityDashboard; 