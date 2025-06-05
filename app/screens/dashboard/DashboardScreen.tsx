import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
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

const QUICK_SERVICES = [
  {
    id: '1',
    name: 'GatePass',
    icon: 'send',
    iconFamily: 'Feather',
  },
  {
    id: '2',
    name: 'Pay Bills',
    icon: 'receipt',
    iconFamily: 'MaterialCommunityIcons',
  },
  {
    id: '3',
    name: 'Buy Airtime',
    icon: 'phone',
    iconFamily: 'Feather',
  },
  {
    id: '4',
    name: 'Submit Complaint',
    icon: 'trending-up',
    iconFamily: 'Feather',
  },
];

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState(50000); // This would come from your backend
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderIcon = (service: typeof QUICK_SERVICES[0]) => {
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
              <Text style={styles.greeting}>Hello, John 👋</Text>
              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
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
              <TouchableOpacity activeOpacity={0.7}>
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
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recentTransactions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
});

export default DashboardScreen; 