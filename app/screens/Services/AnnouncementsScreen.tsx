import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  image?: string;
  isImportant?: boolean;
}

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Estate General Meeting',
    content: 'The annual general meeting will be held on July 15th, 2024 at the community center. All residents are required to attend.',
    category: 'Meeting',
    date: '2024-06-01',
    isImportant: true,
  },
  {
    id: '2',
    title: 'Road Maintenance Notice',
    content: 'Road maintenance work will commence on Block A from June 10th to June 15th. Please use alternative routes during this period.',
    category: 'Maintenance',
    date: '2024-06-05',
  },
  {
    id: '3',
    title: 'New Security Measures',
    content: 'New security protocols will be implemented starting July 1st. All residents will receive new access cards.',
    category: 'Security',
    date: '2024-06-08',
    isImportant: true,
  },
];

const categories = ['All', 'Meeting', 'Maintenance', 'Security', 'Events'];

const AnnouncementsScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = selectedCategory === 'All'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.categoryChipSelected,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item && styles.categoryChipTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <TouchableOpacity
      style={styles.announcementCard}
      onPress={() => setSelectedAnnouncement(item)}
    >
      <View style={styles.announcementHeader}>
        <View style={styles.announcementMeta}>
          <Text style={styles.announcementCategory}>{item.category}</Text>
          <Text style={styles.announcementDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        {item.isImportant && (
          <View style={styles.importantBadge}>
            <Text style={styles.importantBadgeText}>Important</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementPreview} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Announcements List or Detail */}
        {!selectedAnnouncement ? (
          <FlatList
            data={filteredAnnouncements}
            renderItem={renderAnnouncement}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.announcementsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedAnnouncement(null)}
            >
              <Feather name="chevron-left" size={20} color="#045555" />
              <Text style={styles.backButtonText}>Back to Announcements</Text>
            </TouchableOpacity>

            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailCategory}>
                  {selectedAnnouncement.category}
                </Text>
                <Text style={styles.detailDate}>
                  {new Date(selectedAnnouncement.date).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.detailTitle}>{selectedAnnouncement.title}</Text>
              
              {selectedAnnouncement.image && (
                <Image
                  source={{ uri: selectedAnnouncement.image }}
                  style={styles.detailImage}
                />
              )}
              
              <Text style={styles.detailContent}>
                {selectedAnnouncement.content}
              </Text>
            </View>
          </ScrollView>
        )}
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
    backgroundColor: '#045555',
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
  categoriesList: {
    padding: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipSelected: {
    backgroundColor: '#045555',
  },
  categoryChipText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  announcementsList: {
    padding: 20,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementCategory: {
    color: '#045555',
    fontWeight: '600',
    marginRight: 12,
  },
  announcementDate: {
    color: '#666',
  },
  importantBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importantBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  announcementPreview: {
    color: '#666',
    lineHeight: 20,
  },
  detailView: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#045555',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailCategory: {
    color: '#045555',
    fontWeight: '600',
  },
  detailDate: {
    color: '#666',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailContent: {
    color: '#333',
    lineHeight: 24,
    fontSize: 16,
  },
});

export default AnnouncementsScreen; 