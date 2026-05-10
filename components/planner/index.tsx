import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './planner.styles';
import { PlannerService } from './planner.service';
import { MyPlan, FeaturedPlan } from './types';
import { Colors } from '@/constants/theme';

import { NorthHeader } from '@/components/ui/north-header';

interface Props {
  onGeneratePress?: () => void;
}

export default function PlannerComponent({ onGeneratePress }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [myPlans, setMyPlans] = useState<MyPlan[]>([]);
  const [featured, setFeatured] = useState<FeaturedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [myPlansData, featuredData] = await Promise.all([
      PlannerService.getMyPlans(),
      PlannerService.getFeaturedPlans(),
    ]);
    setMyPlans(myPlansData);
    setFeatured(featuredData);
    setLoading(false);
  };

  const renderMyPlanCard = (plan: MyPlan) => (
    <TouchableOpacity key={plan.id} style={styles.myPlanCard} activeOpacity={0.8}>
      <View>
        <Text style={styles.myPlanTitle}>{plan.title}</Text>
        <Text style={{ fontSize: 12, color: theme.tertiary, marginTop: 4 }}>
          {plan.status} • {plan.createdAt}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={theme.accent} />
    </TouchableOpacity>
  );

  const renderFeaturedCard = (plan: FeaturedPlan) => (
    <TouchableOpacity key={plan.id} style={styles.featuredCard} activeOpacity={0.8}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: theme.accent, marginBottom: 4 }}>
        {plan.duration}
      </Text>
      <Text style={styles.featuredTitle}>{plan.title}</Text>
      <Text style={styles.featuredSubtitle} numberOfLines={2}>
        {plan.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NorthHeader 
        rightElement={
          <TouchableOpacity style={styles.myPlansButton}>
            <Text style={styles.myPlansButtonText}>My Plans</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* My Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My plans</Text>
          {loading ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            myPlans.map(renderMyPlanCard)
          )}
        </View>

        {/* Featured Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured plans</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featured.map(renderFeaturedCard)}
          </ScrollView>
        </View>

        {/* Generate Button */}
        <TouchableOpacity 
          style={styles.generateButton} 
          activeOpacity={0.9}
          onPress={onGeneratePress}
        >
          <Text style={styles.generateButtonText}>generate custom trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
