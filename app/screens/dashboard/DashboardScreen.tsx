import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  GatePass: undefined;
  EstateDues: undefined;
  AirtimeData: undefined;
  Emergency: undefined;
  Announcements: undefined;
  Electricity: undefined;
  ProfileSettings: undefined;
  SubmitComplaint: undefined;
  TransactionHistory: undefined;
  Notifications: undefined;
  Dashboard: undefined;
  SecurityDashboard: undefined;
  EstateAdminDashboard: undefined;
  ApproveVisitors: undefined;
  ViewComplaints: undefined;
  ManageSecurity: undefined;
  SendNotice: undefined;
  PaymentHistory: undefined;
  GenerateReports: undefined;
  CableTV: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface QuickService {
  id: string;
  name: string;
  icon: string;
  iconFamily: 'Feather' | 'MaterialCommunityIcons';
  screen: keyof RootStackParamList;
}

const QUICK_SERVICES: QuickService[] = [
  {
    id: '1',
    name: 'Gate Pass',
    icon: 'key',
    iconFamily: 'Feather',
    screen: 'GatePass',
  },
  {
    id: '2',
    name: 'Estate Dues',
    icon: 'credit-card',
    iconFamily: 'Feather',
    screen: 'EstateDues',
  },
  {
    id: '3',
    name: 'Airtime/Data',
    icon: 'phone',
    iconFamily: 'Feather',
    screen: 'AirtimeData',
  },
  {
    id: '4',
    name: 'Emergency',
    icon: 'alert-circle',
    iconFamily: 'Feather',
    screen: 'Emergency',
  },
  {
    id: '5',
    name: 'Announcements',
    icon: 'bell',
    iconFamily: 'Feather',
    screen: 'Announcements',
  },
  {
    id: '6',
    name: 'Electricity',
    icon: 'zap',
    iconFamily: 'Feather',
    screen: 'Electricity',
  },
  {
    id: '7',
    name: 'Submit Complaint',
    icon: 'message-square',
    iconFamily: 'Feather',
    screen: 'SubmitComplaint',
  },
  {
    id: '8',
    name: 'Cable TV',
    icon: 'tv',
    iconFamily: 'Feather',
    screen: 'CableTV',
  },
];

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState(50000); 
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderIcon = (service: QuickService) => {
    if (service.iconFamily === 'Feather') {
      return <Feather name={service.icon as any} size={24} color="#045555" />;
    }
    return <MaterialCommunityIcons name={service.icon as any} size={24} color="#045555" />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={['#045555']}
            progressBackgroundColor="#fff"
          />
        }
      >
        {/* Top Box */}
        <View style={styles.topBox}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Hello, Simeon 👋</Text>
              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Feather name="bell" size={24} color="#fff" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProfileSettings')}
              >
                <Feather name="user" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>
                ₦{showBalance ? balance.toLocaleString() : '****'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Feather name={showBalance ? 'eye-off' : 'eye'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.fundButton}
            activeOpacity={0.7}
          >
            <Text style={styles.fundButtonText}>Fund Account</Text>
            <AntDesign name="plus" size={20} color="#045555" />
          </TouchableOpacity>
        </View>

        {/* Bottom Box */}
        <View style={styles.bottomBox}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <View style={styles.servicesGrid}>
            {QUICK_SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(service.screen)}
              >
                <View style={styles.serviceIconContainer}>
                  {renderIcon(service)}
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.recentTransactions}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('TransactionHistory')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {/* Add your transaction list items here */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#045555',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  topBox: {
    backgroundColor: '#045555',
    padding: 20,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  eyeButton: {
    padding: 5,
  },
  fundButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  fundButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#045555',
    marginRight: 8,
  },
  bottomBox: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: height * 0.6,
    paddingBottom: 100, // Add extra padding at bottom for better scroll
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  serviceCard: {
    width: (width - 80) / 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  recentTransactions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#045555',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default DashboardScreen; 