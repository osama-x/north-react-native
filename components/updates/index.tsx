import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NewsItem, RoadStatus, UpdateView } from './types';
import { UpdatesService } from './updates.service';
import { createStyles } from './updates.styles';

import { GlassBackground } from '@/components/ui/glass-background';
import { NorthHeader } from '@/components/ui/north-header';

export default function UpdatesComponent() {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [activeView, setActiveView] = useState<UpdateView>('News');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [roads, setRoads] = useState<RoadStatus[]>([]);
  const [topTags, setTopTags] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const PAGE_SIZE = 5;

  // Search state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData(1);
  }, []);

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setIsSearching(true);
    const results = await UpdatesService.getTagSuggestions(searchQuery);
    setSuggestions(results);
    setIsSearching(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchData(1, false, true); // Pass isRefresh = true
    setRefreshing(false);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setIsSearchVisible(false);
    setSearchQuery('');
    setSuggestions([]);
    // Reset pagination and fetch
    setPage(1);
    setHasMore(true);
    fetchData(1);
  };

  const fetchData = async (pageNum: number, isMore = false, isRefresh = false) => {
    if (isMore) {
      setIsFetchingMore(true);
    } else if (!isRefresh) {
      setLoading(true);
    }

    try {
      const [newsData, roadsData, tagsData] = await Promise.all([
        UpdatesService.getNews(pageNum, PAGE_SIZE),
        pageNum === 1 ? UpdatesService.getRoads() : Promise.resolve([]),
        pageNum === 1 ? UpdatesService.getTopTags() : Promise.resolve([]),
      ]);

      if (newsData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isMore) {
        setNews(prev => [...prev, ...newsData]);
      } else {
        setNews(newsData);
        if (pageNum === 1) {
          setRoads(roadsData);
          if (tagsData.length > 0) setTopTags(tagsData);
        }
      }
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || isFetchingMore || loading || activeView !== 'News') return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  const handleViewChange = (view: UpdateView) => {
    setActiveView(view);
    setSelectedTag('All');
    // Reset pagination when switching views
    if (view === 'News') {
      setPage(1);
      setHasMore(true);
      fetchData(1);
    }
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

  // We no longer derive tags from content, but use the fetched topTags
  // const allTags = useMemo(() => { ... });

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
    <GlassBackground style={styles.container}>
      <NorthHeader
        rightElement={
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setIsSearchVisible(true)}
          >
            <IconSymbol name="magnifyingglass" size={22} color="#ffffff" />
          </TouchableOpacity>
        }
      />

      {/* Search Bar Overlay */}
      {isSearchVisible && (
        <View style={styles.searchBar}>
          <TouchableOpacity
            style={styles.closeSearchButton}
            onPress={() => {
              setIsSearchVisible(false);
              setSearchQuery('');
              setSuggestions([]);
            }}
          >
            <IconSymbol name="chevron.left" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tags..."
            placeholderTextColor={theme.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {isSearching && <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 10 }} />}
        </View>
      )}

      {/* Suggestions List */}
      {isSearchVisible && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.suggestionItem}
              onPress={() => handleSelectTag(tag)}
            >
              <IconSymbol name="magnifyingglass" size={16} color={theme.tertiary} />
              <Text style={styles.suggestionText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
          {topTags.map((tag) => (
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
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : null
          }
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
          <View style={[styles.container, { backgroundColor: theme.background }]}>
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

                <Text style={styles.fullContentText}>{selectedNews.content}</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </GlassBackground>
  );
}
