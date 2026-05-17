import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './planner.styles';
import { PlannerService } from './planner.service';
import { FeaturedPlan } from './types';
import { Colors } from '@/constants/theme';
import { dbService, SavedPlanRecord } from '@/database';
import { NorthHeader } from '@/components/ui/north-header';
import { Config } from '@/constants/config';
import { GlassBackground } from '@/components/ui/glass-background';

interface Props {
  onGeneratePress?: () => void;
  onSavedPlanPress?: (planId: string) => void;
}

export default function PlannerComponent({ onGeneratePress, onSavedPlanPress }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [savedPlans, setSavedPlans] = useState<SavedPlanRecord[]>([]);
  const [featured, setFeatured] = useState<FeaturedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown menu state
  const [menuPlan, setMenuPlan] = useState<SavedPlanRecord | null>(null);
  const [menuPosition, setMenuPosition] = useState(0);

  // Confirmation delete state
  const [pendingDeletePlan, setPendingDeletePlan] = useState<SavedPlanRecord | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansData, featuredData] = await Promise.all([
        dbService.getSavedPlans(),
        PlannerService.getFeaturedPlans(),
      ]);
      setSavedPlans(plansData);
      setFeatured(featuredData);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDeletePlan = async () => {
    if (!pendingDeletePlan) return;
    try {
      await dbService.deletePlan(pendingDeletePlan.id);
      setSavedPlans(prev => prev.filter(p => p.id !== pendingDeletePlan.id));
    } catch (e) {
      console.error("Failed to delete plan:", e);
    } finally {
      setPendingDeletePlan(null);
    }
  };

  const renderSavedPlanCard = (plan: SavedPlanRecord) => (
    <View key={plan.id} style={styles.myPlanCard}>
      {/* Tappable area to open plan */}
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onPress={() => onSavedPlanPress?.(plan.id)}
      >
        <Text style={styles.myPlanTitle}>{plan.title}</Text>
        <Text style={{ fontSize: 12, color: colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)', marginTop: 4 }}>
          {new Date(plan.startDate).toLocaleDateString()} • PKR {plan.totalCost.toLocaleString()}
        </Text>
      </TouchableOpacity>

      {/* 3-dot button — opens Modal dropdown */}
      <TouchableOpacity
        style={{ padding: 8 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={(e) => {
          const { pageY } = e.nativeEvent;
          setMenuPosition(pageY);
          setMenuPlan(plan);
        }}
      >
        <IconSymbol name="ellipsis" size={20} color={colorScheme === 'dark' ? theme.secondary : 'rgba(255, 255, 255, 0.8)'} />
      </TouchableOpacity>
    </View>
  );

  const renderFeaturedCard = (plan: FeaturedPlan) => (
    <TouchableOpacity key={plan.id} style={styles.featuredCard} activeOpacity={0.8}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colorScheme === 'dark' ? theme.accent : '#fbd561', marginBottom: 4 }}>
        {plan.duration}
      </Text>
      <Text style={styles.featuredTitle}>{plan.title}</Text>
      <Text style={styles.featuredSubtitle} numberOfLines={2}>
        {plan.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GlassBackground style={styles.container}>
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
          ) : savedPlans.length > 0 ? (
            savedPlans.map(renderSavedPlanCard)
          ) : (
            <Text style={{ color: theme.tertiary, marginTop: 8 }}>No saved plans yet.</Text>
          )}
        </View>

        {/* Featured Plans Section */}
        {Config.FEATURES.ENABLE_FEATURED_PLANS && (
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
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          activeOpacity={0.9}
          onPress={onGeneratePress}
        >
          <Text style={styles.generateButtonText}>generate custom trip</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ────────────── Dropdown Menu Modal ────────────── */}
      <Modal
        visible={!!menuPlan}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuPlan(null)}
      >
        {/* Tap outside to dismiss */}
        <TouchableWithoutFeedback onPress={() => setMenuPlan(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
            {/* Stop tap propagation inside menu */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{
                position: 'absolute',
                top: menuPosition + 10,
                right: 20,
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
                borderRadius: 16,
                paddingVertical: 6,
                minWidth: 180,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 10,
                borderWidth: 1,
                borderColor: theme.border,
              }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    gap: 12,
                  }}
                  onPress={() => {
                    const plan = menuPlan;
                    setMenuPlan(null);
                    setTimeout(() => setPendingDeletePlan(plan), 200);
                  }}
                >
                  <IconSymbol name="trash" size={17} color="#ef4444" />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#ef4444' }}>Delete Plan</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ────────────── Delete Confirmation Modal ────────────── */}
      <Modal
        visible={!!pendingDeletePlan}
        animationType="slide"
        transparent
        onRequestClose={() => setPendingDeletePlan(null)}
      >
        <TouchableWithoutFeedback onPress={() => setPendingDeletePlan(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{
                backgroundColor: theme.background,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                padding: 28,
                paddingBottom: Platform.OS === 'ios' ? 48 : 28,
                alignItems: 'center',
              }}>
                <View style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  padding: 18,
                  borderRadius: 30,
                  marginBottom: 18,
                }}>
                  <IconSymbol name="trash.fill" size={32} color="#ef4444" />
                </View>
                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: theme.primary,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  Delete Plan?
                </Text>
                <Text style={{
                  fontSize: 15,
                  color: theme.tertiary,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 28,
                }}>
                  "{pendingDeletePlan?.title}" will be permanently removed. This cannot be undone.
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    }}
                    onPress={() => setPendingDeletePlan(null)}
                  >
                    <Text style={{ fontWeight: '700', fontSize: 16, color: theme.primary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      backgroundColor: '#ef4444',
                    }}
                    onPress={handleDeletePlan}
                  >
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#fff' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GlassBackground>
  );
}
