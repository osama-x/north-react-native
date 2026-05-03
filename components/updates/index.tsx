import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './updates.styles';
import { UpdatesService } from './updates.service';
import { NewsItem, RoadStatus, UpdateView } from './types';
import { Colors } from '@/constants/theme';

export default function UpdatesComponent() {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [activeView, setActiveView] = useState<UpdateView>('News');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [roads, setRoads] = useState<RoadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [newsData, roadsData] = await Promise.all([
      UpdatesService.getNews(),
      UpdatesService.getRoads(),
    ]);
    setNews(newsData);
    setRoads(roadsData);
    setLoading(false);
  };

  const handleViewChange = (view: UpdateView) => {
    setActiveView(view);
    setSelectedTag('All');
  };

  const handleShare = async (item: NewsItem) => {
    try {
      await Share.share({
        title: item.title,
        message: `${item.title}\n\n${item.summary}\n\nRead more in Markhorr app.`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('All');
    const data = activeView === 'News' ? news : roads;
    data.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [news, roads, activeView]);

  const filteredNews = useMemo(() => {
    if (selectedTag === 'All') return news;
    return news.filter((item) => item.tags.includes(selectedTag));
  }, [news, selectedTag]);

  const filteredRoads = useMemo(() => {
    if (selectedTag === 'All') return roads;
    return roads.filter((item) => item.tags.includes(selectedTag));
  }, [roads, selectedTag]);

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const hasThumbnail = item.thumbnail && item.thumbnail.length > 0;
    
    return (
      <TouchableOpacity 
        style={styles.newsCard} 
        activeOpacity={0.7}
        onPress={() => setSelectedNews(item)}
      >
        <View style={styles.newsRow}>
          {hasThumbnail && (
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          )}
          <View style={[styles.newsInfo, !hasThumbnail && { marginLeft: 0 }]}>
            <Text style={styles.newsDate}>{item.dateTime}</Text>
            <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.newsSummary} numberOfLines={hasThumbnail ? 2 : 4}>
              {item.summary || item.content}
            </Text>
          </View>
        </View>
        <View style={styles.newsTagsRow}>
          {item.tags.map((tag) => (
            <Text key={tag} style={styles.newsTag}>
              #{tag}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRoadItem = ({ item }: { item: RoadStatus }) => {
    const statusColor =
      item.status === 'Open'
        ? '#2e8b58'
        : item.status === 'Caution'
        ? '#f59e0b'
        : '#ef4444';

    return (
      <View style={styles.roadCard}>
        <View style={styles.roadHeader}>
          <Text style={styles.roadLocation}>{item.location}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}20` },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.roadDetails}>{item.details}</Text>
        <View style={styles.roadFooter}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <IconSymbol name="clock.fill" size={12} color={theme.tertiary} />
            <Text style={[styles.lastUpdated, { marginLeft: 4 }]}>
              {item.lastUpdated}
            </Text>
          </View>
          <View style={styles.newsTagsRow}>
            {item.tags.map((tag) => (
              <Text key={tag} style={styles.newsTag}>
                #{tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Updates</Text>
        <TouchableOpacity style={styles.searchButton}>
          <IconSymbol name="magnifyingglass" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* View Switcher */}
      <View style={styles.viewSwitcher}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeView === 'News' && styles.switchButtonActive,
          ]}
          onPress={() => handleViewChange('News')}
        >
          <Text
            style={[
              styles.switchText,
              activeView === 'News' && styles.switchTextActive,
            ]}
          >
            News
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            activeView === 'Roads' && styles.switchButtonActive,
          ]}
          onPress={() => handleViewChange('Roads')}
        >
          <Text
            style={[
              styles.switchText,
              activeView === 'Roads' && styles.switchTextActive,
            ]}
          >
            Roads
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tag Filter */}
      <View style={styles.tagContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                selectedTag === tag && styles.tagActive,
              ]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTag === tag && styles.tagTextActive,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Updates List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={activeView === 'News' ? filteredNews : filteredRoads}
          renderItem={activeView === 'News' ? renderNewsItem : renderRoadItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={{ color: theme.tertiary }}>No updates found.</Text>
            </View>
          }
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={!!selectedNews}
        animationType="slide"
        onRequestClose={() => setSelectedNews(null)}
      >
        {selectedNews && (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedNews(null)} style={styles.detailBackButton}>
                <IconSymbol name="chevron.left" size={28} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(selectedNews)} style={styles.detailShareButton}>
                <IconSymbol name="paperplane.fill" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedNews.image && selectedNews.image.length > 0 && (
                <Image source={{ uri: selectedNews.image }} style={styles.detailImage} />
              )}
              <View style={styles.detailContentContainer}>
                <Text style={styles.detailDate}>{selectedNews.dateTime}</Text>
                <Text style={styles.detailTitle}>{selectedNews.title}</Text>
                
                <View style={styles.detailTagsRow}>
                  {selectedNews.tags.map(tag => (
                    <View key={tag} style={styles.detailTagBadge}>
                      <Text style={styles.detailTagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>

                {selectedNews.summary && (
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>{selectedNews.summary}</Text>
                  </View>
                )}

                <Text style={styles.fullContentText}>{selectedNews.content}</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
