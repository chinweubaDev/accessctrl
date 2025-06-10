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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'emergency' | 'maintenance' | 'event';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface NewAnnouncement {
  title: string;
  content: string;
  category: 'general' | 'emergency' | 'maintenance' | 'event';
  priority: 'high' | 'medium' | 'low';
}

// Mock data for announcements
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Estate General Meeting',
    content: 'Annual general meeting will be held on Saturday, July 1st, 2024 at the estate hall. All residents are required to attend.',
    category: 'general',
    date: '2024-06-15',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Scheduled Power Maintenance',
    content: 'There will be a scheduled power maintenance on Monday, June 20th, from 10 AM to 2 PM. Please plan accordingly.',
    category: 'maintenance',
    date: '2024-06-14',
    priority: 'medium',
  },
];

const EstateAdminAnnouncementsScreen = () => {
  const navigation = useNavigation();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<NewAnnouncement>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
  });

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newId = (announcements.length + 1).toString();
    const currentDate = new Date().toISOString().split('T')[0];

    setAnnouncements(prev => [
      {
        id: newId,
        ...newAnnouncement,
        date: currentDate,
      },
      ...prev,
    ]);

    setNewAnnouncement({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
    });
    setShowAddModal(false);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    Alert.alert(
      'Delete Announcement',
      'Are you sure you want to delete this announcement?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAnnouncements(prev =>
              prev.filter(announcement => announcement.id !== announcementId)
            );
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return 'alert-circle';
      case 'maintenance':
        return 'tool';
      case 'event':
        return 'calendar';
      default:
        return 'bell';
    }
  };

  const renderAnnouncementCard: ListRenderItem<Announcement> = ({ item: announcement }) => (
    <View style={styles.announcementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Feather
            name={getCategoryIcon(announcement.category)}
            size={20}
            color="#045555"
          />
          <Text style={styles.title}>{announcement.title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteAnnouncement(announcement.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{announcement.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{announcement.date}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(announcement.priority) },
          ]}
        >
          <Text style={styles.priorityText}>
            {announcement.priority.charAt(0).toUpperCase() +
              announcement.priority.slice(1)}
          </Text>
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
        <Text style={styles.headerTitle}>Announcements</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search announcements..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <FlatList
          data={announcements.filter(
            announcement =>
              announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderAnnouncementCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
              <Text style={styles.modalTitle}>New Announcement</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={newAnnouncement.title}
                  onChangeText={text =>
                    setNewAnnouncement({ ...newAnnouncement, title: text })
                  }
                  placeholder="Enter announcement title"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Content *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newAnnouncement.content}
                  onChangeText={text =>
                    setNewAnnouncement({ ...newAnnouncement, content: text })
                  }
                  placeholder="Enter announcement content"
                  multiline
                  numberOfLines={6}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryButtons}>
                  {['general', 'emergency', 'maintenance', 'event'].map(
                    (category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          newAnnouncement.category === category &&
                            styles.activeCategoryButton,
                        ]}
                        onPress={() =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            category: category as NewAnnouncement['category'],
                          })
                        }
                      >
                        <Feather
                          name={getCategoryIcon(category)}
                          size={16}
                          color={
                            newAnnouncement.category === category
                              ? '#fff'
                              : '#045555'
                          }
                        />
                        <Text
                          style={[
                            styles.categoryButtonText,
                            newAnnouncement.category === category &&
                              styles.activeCategoryButtonText,
                          ]}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityButtons}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor:
                            newAnnouncement.priority === priority
                              ? getPriorityColor(priority)
                              : 'transparent',
                          borderColor: getPriorityColor(priority),
                        },
                      ]}
                      onPress={() =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          priority: priority as NewAnnouncement['priority'],
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          {
                            color:
                              newAnnouncement.priority === priority
                                ? '#fff'
                                : getPriorityColor(priority),
                          },
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAnnouncement}
              >
                <Text style={styles.addButtonText}>Post Announcement</Text>
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
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
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
  announcementCard: {
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
 
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
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
    height: 120,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#045555',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  activeCategoryButton: {
    backgroundColor: '#045555',
  },
  categoryButtonText: {
    color: '#045555',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
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

export default EstateAdminAnnouncementsScreen; 