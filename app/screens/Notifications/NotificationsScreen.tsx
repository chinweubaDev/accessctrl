import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock data - replace with your actual data
const mockNotifications = [
  {
    id: '1',
    title: 'New Announcement',
    message: 'Monthly community meeting scheduled for next week',
    timestamp: '2024-06-15T10:00:00Z',
    type: 'announcement',
    isRead: false,
  },
  {
    id: '2',
    title: 'Maintenance Update',
    message: 'Water supply maintenance completed successfully',
    timestamp: '2024-06-15T08:30:00Z',
    type: 'maintenance',
    isRead: true,
  },
  {
    id: '3',
    title: 'Security Alert',
    message: 'Please ensure all vehicles are properly parked',
    timestamp: '2024-06-14T15:20:00Z',
    type: 'security',
    isRead: false,
  },
  {
    id: '4',
    title: 'Payment Reminder',
    message: 'Estate dues for June are now due',
    timestamp: '2024-06-14T09:00:00Z',
    type: 'payment',
    isRead: false,
  },
  {
    id: '5',
    title: 'Event Update',
    message: 'Weekend cleanup drive cancelled due to weather',
    timestamp: '2024-06-13T14:15:00Z',
    type: 'event',
    isRead: true,
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bell';
      case 'maintenance':
        return 'tool';
      case 'security':
        return 'shield';
      case 'payment':
        return 'credit-card';
      case 'event':
        return 'calendar';
      default:
        return 'bell';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const groupNotificationsByDate = () => {
    const groups: { [key: string]: typeof mockNotifications } = {};
    notifications.forEach(notification => {
      const date = formatDate(notification.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {hasUnreadNotifications && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupNotificationsByDate()).map(([date, items]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {items.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.unreadItem,
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  !notification.isRead && styles.unreadIcon,
                ]}>
                  <Feather
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={!notification.isRead ? '#045555' : '#666'}
                  />
                </View>
                <View style={styles.contentContainer}>
                  <Text style={[
                    styles.title,
                    !notification.isRead && styles.unreadText,
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.message}>{notification.message}</Text>
                  <Text style={styles.time}>
                    {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
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
    alignItems: 'center',
    paddingVertical:20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 16,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  markAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
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
  unreadItem: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#045555',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadIcon: {
    backgroundColor: 'rgba(4, 85, 85, 0.1)',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: '#045555',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#045555',
    marginLeft: 8,
  },
});

export default NotificationsScreen; 