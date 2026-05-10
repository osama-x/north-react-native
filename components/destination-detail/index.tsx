import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './detail.styles';
import { DestinationDetailService } from './detail.service';
import { DestinationDetail, StayOption } from './types';
import { Colors } from '@/constants/theme';
import { NewsItem } from '../updates/types';
import { Config } from '@/constants/config';

interface Props {
  destinationId: string;
  onBack: () => void;
  onPlanPress?: (destinationName: string) => void;
}

import { NorthHeader } from '@/components/ui/north-header';

export default function DestinationDetailComponent({ destinationId, onBack, onPlanPress }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [detail, setDetail] = useState<DestinationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [destinationId]);

  const loadData = async () => {
    setLoading(true);
    const data = await DestinationDetailService.getDetail(destinationId);
    setDetail(data);
    setLoading(false);
  };

  const renderStayCard = (stay: StayOption) => (
    <TouchableOpacity key={stay.id} style={styles.stayCard} activeOpacity={0.8}>
      <Text style={styles.stayType}>{stay.type}</Text>
      <Text style={styles.stayName}>{stay.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.stayPrice}>{stay.priceRange}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol name="star.fill" size={12} color="#f59e0b" />
          <Text style={[styles.stayPrice, { marginLeft: 4 }]}>{stay.rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={{ marginTop: 12, paddingVertical: 8, backgroundColor: theme.accent + '20', borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 13 }}>Check Availability</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNewsItem = (item: NewsItem) => (
    <TouchableOpacity key={item.id} style={styles.newsItem} activeOpacity={0.7}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDate}>{item.dateTime}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.tertiary }}>Destination not found.</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.accent }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NorthHeader 
        leftElement={
          <TouchableOpacity 
            style={{ padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12 }} 
            onPress={onBack}
          >
            <IconSymbol name="chevron.left" size={24} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroName}>{detail.name}</Text>
          <Text style={styles.heroRegion}>{detail.region}</Text>
          <View style={styles.ratingBadge}>
            <IconSymbol name="star.fill" size={16} color="#ffffff" />
            <Text style={styles.ratingText}>{detail.rating} (Top Rated)</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{detail.summary}</Text>
          </View>

          {/* Make a Plan Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.planCard} 
              activeOpacity={0.9}
              onPress={() => onPlanPress?.(detail.name)}
            >
              <View style={styles.planContent}>
                <Text style={styles.planTitle}>Make a Plan</Text>
                <Text style={styles.planSubtitle}>Create a personalized itinerary for {detail.name}</Text>
              </View>
              <View style={styles.planButton}>
                <IconSymbol name="plus" size={24} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Stay Options Section */}
          {Config.FEATURES.ENABLE_STAYS && (
            <View style={styles.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>Stay Options</Text>
                <Text style={{ color: theme.tertiary, fontSize: 12 }}>Powered by Agoda</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {detail.stays.map(renderStayCard)}
              </ScrollView>
            </View>
          )}

          {/* Related News Section */}
          {detail.news.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Latest Updates</Text>
              {detail.news.map(renderNewsItem)}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
