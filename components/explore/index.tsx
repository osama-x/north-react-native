import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GlassBackground } from '@/components/ui/glass-background';
import { createStyles } from './explore.styles';
import { ExploreService } from './explore.service';
import { FeaturedPlan, Destination } from './types';
import { Colors } from '@/constants/theme';
import { NorthHeader } from '@/components/ui/north-header';
import { Config } from '@/constants/config';

interface Props {
  onDestinationPress?: (id: string) => void;
}

export default function ExploreComponent({ onDestinationPress }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [plans, setPlans] = useState<FeaturedPlan[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const plansData = await ExploreService.getFeaturedPlans();
    const destData = await ExploreService.getDestinations();
    setPlans(plansData);
    setDestinations(destData);
    setLoading(false);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    const filtered = await ExploreService.getDestinations(text);
    setDestinations(filtered);
  };

  const renderPlanCard = (plan: FeaturedPlan) => (
    <TouchableOpacity key={plan.id} style={styles.planCard} activeOpacity={0.9}>
      <Text style={styles.planDuration}>{plan.duration}</Text>
      <Text style={styles.planTitle} numberOfLines={2}>{plan.title}</Text>
      <Text style={styles.planDescription} numberOfLines={2}>{plan.description}</Text>
    </TouchableOpacity>
  );

  const renderDestinationCard = (dest: Destination) => (
    <TouchableOpacity 
      key={dest.id} 
      style={styles.destinationCard} 
      activeOpacity={0.8}
      onPress={() => onDestinationPress?.(dest.id)}
    >
      <Image 
        source={{ uri: dest.image }} 
        style={styles.destinationImage}
        resizeMode="cover"
      />
      <View style={styles.imageOverlay}>
        <IconSymbol name="star.fill" size={12} color="#f59e0b" />
        <Text style={[styles.ratingText, { color: '#ffffff', marginLeft: 4 }]}>{dest.rating}</Text>
      </View>
      
      <View style={styles.destinationContent}>
        <Text style={styles.destinationName}>{dest.name}</Text>
        <Text style={styles.destinationTagline}>{dest.tagline}</Text>
        <View style={styles.ratingRow}>
          <IconSymbol name="mappin.and.ellipse" size={14} color={theme.accent} />
          <Text style={[styles.ratingText, { color: theme.tertiary, fontSize: 13 }]}>{dest.region}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GlassBackground style={styles.container}>
      <NorthHeader 
        rightElement={
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <IconSymbol 
              name={showSearch ? "xmark" : "magnifyingglass"} 
              size={22} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        {showSearch && (
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={theme.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations..."
              placeholderTextColor={theme.tertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        )}

        {/* Featured Plans */}
        {Config.FEATURES.ENABLE_FEATURED_PLANS && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured plans</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.moreText}>more</Text>
                <IconSymbol name="arrow.right" size={16} color={theme.accent} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.planScroll}
            >
              {plans.map(renderPlanCard)}
            </ScrollView>
          </View>
        )}

        {/* Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destinations</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={theme.accent} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.destinationGrid}>
              {destinations.map(renderDestinationCard)}
            </View>
          )}
          {!loading && destinations.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: theme.tertiary }}>No destinations found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </GlassBackground>
  );
}
