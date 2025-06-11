import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const menuItems = [
  {
    id: 'edit_profile',
    title: 'Edit Profile',
    icon: 'user',
    screen: 'EditProfile',
  },
  {
    id: 'change_password',
    title: 'Change Password',
    icon: 'lock',
    screen: 'ChangePassword',
  },
  {
    id: 'change_pin',
    title: 'Change PIN',
    icon: 'key',
    screen: 'ChangePin',
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: 'shield',
    screen: 'SecuritySettings',
  },
  {
    id: 'about',
    title: 'About',
    icon: 'info',
    screen: 'About',
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: 'log-out',
    screen: 'logout',
  },
];

const ProfileSettingsScreen = () => {
  const navigation = useNavigation();

  const handleMenuPress = (screen: string) => {
    if (screen === 'logout') {
      // Handle logout
      return;
    }
    navigation.navigate(screen as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={() => navigation.navigate('EditProfile' as never)}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Feather name="edit-2" size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@example.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather name={item.icon as any} size={20} color="#045555" />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Feather 
                name="chevron-right" 
                size={20} 
                color={item.id === 'logout' ? '#FF4444' : '#666'} 
              />
            </TouchableOpacity>
          ))}
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#045555',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileSettingsScreen; 