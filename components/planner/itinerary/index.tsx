import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from 'react-native';
import { FOOD_TIERS, ItineraryService, formatTime } from './itinerary.service';
import { createStyles } from './itinerary.styles';
import { ItineraryDay, ItineraryNode, StayOption, TripItinerary } from './types';

import { NorthHeader } from '@/components/ui/north-header';
import { Slider } from '@/components/ui/slider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  onSave?: (totalCost: number, itinerary: TripItinerary) => void;
  onBack?: () => void;
  initialItinerary?: TripItinerary;
}

export default function ItineraryComponent({ onSave, onBack, initialItinerary }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [itinerary, setItinerary] = useState<TripItinerary | null>(initialItinerary ?? null);
  const [loading, setLoading] = useState(!initialItinerary);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
  const [showFloatingCost, setShowFloatingCost] = useState(false);
  const costBarAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const shouldShow = y > 180;
    if (shouldShow !== showFloatingCost) {
      setShowFloatingCost(shouldShow);
      Animated.timing(costBarAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 350,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }).start();
    }
  };

  const formatCompactCost = (value: number): string => {
    if (value >= 100000) {
      const lacs = value / 100000;
      const formatted = lacs % 1 === 0 ? lacs.toFixed(0) : parseFloat(lacs.toFixed(2)).toString();
      return `${formatted} lac${lacs > 1 ? 's' : ''}`;
    } else if (value >= 1000) {
      const k = value / 1000;
      const formatted = k % 1 === 0 ? k.toFixed(0) : parseFloat(k.toFixed(2)).toString();
      return `${formatted}K`;
    }
    return value.toString();
  };
  const [menuConfig, setMenuConfig] = useState<{ dayId: string; groupId: string; x: number; y: number } | null>(null);
  const [activeSliderDayId, setActiveSliderDayId] = useState<string | null>(null);

  useEffect(() => {
    if (initialItinerary) {
      // Pre-collapse all days except the first
      const initialCollapsed: Record<string, boolean> = {};
      initialItinerary.days.forEach((day, index) => {
        initialCollapsed[day.id] = index !== 0;
      });
      setCollapsedDays(initialCollapsed);
    } else {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await ItineraryService.getItinerary();
    setItinerary(JSON.parse(JSON.stringify(data)));

    const initialCollapsed: Record<string, boolean> = {};
    data.days.forEach((day, index) => {
      initialCollapsed[day.id] = index !== 0;
    });
    setCollapsedDays(initialCollapsed);
    setLoading(false);
  };

  const toggleDay = (dayId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const recalculateDayTimes = (day: ItineraryDay): ItineraryDay => {
    let currentMin = day.departureTimeMin;

    const newNodes = day.nodes.map(node => {
      if (node.type === 'ActivityGroup') {
        const groupStartTime = formatTime(currentMin);
        const newItems = node.items?.map(item => {
          const itemNode = {
            ...item,
            time: formatTime(currentMin),
            arrivalTime: formatTime(currentMin + (item.timeRequiredMin || 0))
          };
          if (item.isSelected && !item.isHidden) {
            currentMin += item.timeRequiredMin || 0;
          }
          return itemNode;
        });
        return {
          ...node,
          time: groupStartTime,
          items: newItems,
        };
      } else {
        const newNode = {
          ...node,
          time: formatTime(currentMin),
          arrivalTime: formatTime(currentMin + (node.timeRequiredMin || 0))
        };
        if (node.isSelected && !node.isHidden) {
          currentMin += node.timeRequiredMin || 0;
        }
        return newNode;
      }
    });

    return { ...day, nodes: newNodes };
  };

  const setDepartureTime = (dayId: string, timeMin: number) => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = { ...day, departureTimeMin: timeMin };
        return recalculateDayTimes(updatedDay);
      })
    });
  };

  const toggleSubItem = (dayId: string, groupId: string, itemId: string) => {
    if (!itinerary) return;

    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = {
          ...day,
          nodes: day.nodes.map(node => {
            if (node.id !== groupId || !node.items) return node;
            return {
              ...node,
              items: node.items.map(item => {
                if (item.id !== itemId) return item;
                return { ...item, isSelected: !item.isSelected };
              })
            };
          })
        };
        return recalculateDayTimes(updatedDay);
      })
    });
  };

  const hideSubItem = (dayId: string, groupId: string, itemId: string) => {
    if (!itinerary) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = {
          ...day,
          nodes: day.nodes.map(node => {
            if (node.id !== groupId || !node.items) return node;
            return {
              ...node,
              items: node.items.map(item => {
                if (item.id !== itemId) return item;
                return { ...item, isHidden: true, isSelected: false };
              })
            };
          })
        };
        return recalculateDayTimes(updatedDay);
      })
    });
  };

  const resetActivityGroup = (dayId: string, groupId: string) => {
    if (!itinerary) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = {
          ...day,
          nodes: day.nodes.map(node => {
            if (node.id !== groupId || !node.originalItems) return node;
            return {
              ...node,
              items: JSON.parse(JSON.stringify(node.originalItems))
            };
          })
        };
        return recalculateDayTimes(updatedDay);
      })
    });
    setMenuConfig(null);
  };

  const selectStay = (dayId: string, stayId: string) => {
    if (!itinerary) return;

    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        return { ...day, selectedStayId: stayId };
      })
    });
  };

  const totalCost = useMemo(() => {
    if (!itinerary) return 0;
    let cost = 0;
    itinerary.days.forEach(day => {
      day.nodes.forEach(node => {
        if (node.type !== 'ActivityGroup') {
          if (node.isSelected && !node.isHidden) cost += node.cost;
        } else {
          node.items?.forEach(item => {
            if (item.isSelected && !item.isHidden) cost += item.cost;
          });
        }
      });
      // Always include the selected stay cost
      const selectedStay = day.stayOptions.find(s => s.id === day.selectedStayId);
      if (selectedStay) cost += selectedStay.cost;
    });
    return cost;
  }, [itinerary]);

  const renderNode = (dayId: string, node: ItineraryNode) => {
    const isFood = node.id.endsWith('-food') && node.foodTier && node.adults !== undefined;
    let costDisplay = '';

    if (isFood) {
      const tier = node.foodTier!;
      const adults = node.adults ?? 2;
      const children = node.children ?? 0;
      const factor = adults + children * 0.5;
      const low = Math.round(factor * FOOD_TIERS[tier].perPersonMin);
      const high = Math.round(factor * FOOD_TIERS[tier].perPersonMax);
      const paxText = `${adults} ${adults === 1 ? 'adult' : 'adults'}${children > 0 ? `, ${children} ${children === 1 ? 'child' : 'children'}` : ''}`;
      costDisplay = `Cost: PKR ${low.toLocaleString()} – ${high.toLocaleString()} (For ${paxText})`;
    } else {
      costDisplay = `Cost: PKR ${node.cost.toLocaleString()}`;
    }

    return (
      <View key={node.id} style={styles.mustHaveCard}>
        <View style={styles.cardHeader}>
          <View style={styles.timeTag}>
            <Text style={styles.timeText}>{node.time}</Text>
          </View>
          <Text style={styles.durationText}>{node.duration}</Text>
        </View>
        <Text style={styles.cardTitle}>{node.title}</Text>
        {node.description ? (
          <Text style={styles.cardSummary}>{node.description}</Text>
        ) : node.summary ? (
          <Text style={styles.cardSummary}>{node.summary}</Text>
        ) : null}
        {node.type === 'Travel' && node.arrivalTime && node.toLocation && (
          <Text style={styles.arrivalNote}>
            You will arrive at {node.toLocation} at {node.arrivalTime}
          </Text>
        )}
        {node.cost > 0 && node.type !== 'Travel' && (
          <Text style={[styles.durationText, { color: theme.accent, fontWeight: '700', marginTop: 8 }]}>
            {costDisplay}
          </Text>
        )}
      </View>
    );
  };

  const renderOptionalItem = (dayId: string, groupId: string, node: ItineraryNode) => {
    if (node.isHidden) return null;

    return (
      <View
        key={node.id}
        style={[styles.optionalCard, node.isSelected && styles.optionalCardSelected]}
      >
        <View style={styles.optionalInfo}>
          <Text style={styles.optionalTitle}>{node.title}</Text>
          <Text style={styles.optionalDetails}>{node.time} • {node.duration}</Text>
          {node.cost > 0 && (
            <Text style={[styles.optionalDetails, { color: theme.accent, fontWeight: '700' }]}>
              Cost: PKR {node.cost.toLocaleString()}
            </Text>
          )}
          {node.type === 'Travel' && node.arrivalTime && node.toLocation && (
            <Text style={styles.arrivalNote}>
              You will arrive at {node.toLocation} at {node.arrivalTime}
            </Text>
          )}
        </View>
        <View style={styles.activityActions}>
          <TouchableOpacity
            style={[styles.addButton, node.isSelected && styles.addedButton]}
            onPress={() => toggleSubItem(dayId, groupId, node.id)}
          >
            <Text style={node.isSelected ? styles.addedButtonText : styles.addButtonText}>
              {node.isSelected ? 'Added' : 'Add'}
            </Text>
          </TouchableOpacity>

          {!node.isSelected && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => hideSubItem(dayId, groupId, node.id)}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const TIER_BADGE_COLORS: Record<string, string> = {
    Budget: '#16a34a',
    'Mid-range': '#d97706',
    Luxury: '#9333ea',
  };

  const renderStayOption = (dayId: string, stay: StayOption, isSelected: boolean) => {
    const lo = Math.round(stay.cost * 0.9);
    const hi = Math.round(stay.cost * 1.1);
    const badgeColor = TIER_BADGE_COLORS[stay.level] ?? theme.accent;
    return (
      <TouchableOpacity
        key={stay.id}
        style={[styles.stayCard, isSelected && styles.stayCardSelected]}
        onPress={() => selectStay(dayId, stay.id)}
        activeOpacity={0.8}
      >
        {/* Tier badge */}
        <View style={[styles.stayTierBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.stayTierText}>{stay.level.toUpperCase()}</Text>
        </View>

        {/* Name + checkmark row */}
        <View style={styles.stayNameRow}>
          <Text style={styles.stayName} numberOfLines={1}>{stay.name}</Text>
          {isSelected && (
            <View style={[styles.stayCheck, { backgroundColor: badgeColor }]}>
              <IconSymbol name="checkmark" size={10} color="#fff" />
            </View>
          )}
        </View>

        {/* Price range */}
        <Text style={[styles.stayPrice, { color: badgeColor }]}>
          PKR {lo.toLocaleString()} – {hi.toLocaleString()}
        </Text>
        <Text style={styles.stayPriceNote}>est. per night (up to 4 persons)</Text>

        {/* Description */}
        {stay.description && (
          <Text style={styles.stayDescription} numberOfLines={4}>
            {stay.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const openMenu = (dayId: string, groupId: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;

    setMenuConfig({
      dayId,
      groupId,
      x: pageX - 130, // Narrower menu
      y: pageY + 10
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.accent} />
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
        rightElement={
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => itinerary && onSave?.(totalCost, itinerary)}
          >
            <Text style={styles.saveButtonText} numberOfLines={1}>Save and Track</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Standout Cost Breakdown Card at the top of the plan list */}
        {itinerary && (
          <View style={styles.costBreakdownCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>Estimated Cost</Text>
              <Text style={styles.breakdownRange}>
                Rs. {formatCompactCost(Math.round(totalCost * 0.9))} - {formatCompactCost(Math.round(totalCost * 1.1))}
              </Text>
            </View>
            <View style={styles.breakdownGrid}>
              {/* Travel */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="car.fill" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Travel</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(totalCost * 0.4))}</Text>
                </View>
              </View>

              {/* Accommodation */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="bed.double.fill" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Stay</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(totalCost * 0.35))}</Text>
                </View>
              </View>

              {/* Food */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="fork.knife" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Food</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(totalCost * 0.15))}</Text>
                </View>
              </View>

              {/* Others */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="ellipsis" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Others</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(totalCost * 0.1))}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {itinerary?.days.map(day => {
          const isCollapsed = collapsedDays[day.id];

          return (
            <View key={day.id} style={styles.dayContainer}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggleDay(day.id)}
                activeOpacity={0.7}
              >
                <View style={styles.dayTitleContainer}>
                  <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </View>
                <IconSymbol
                  name={isCollapsed ? "chevron.down" : "chevron.up"}
                  size={20}
                  color={theme.tertiary}
                />
              </TouchableOpacity>

              {!isCollapsed && (
                <View style={styles.dayContent}>
                  <View style={{ marginBottom: 16, backgroundColor: 'rgba(46, 139, 88, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}
                      onPress={() => setActiveSliderDayId(activeSliderDayId === day.id ? null : day.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: theme.primary }}>Departure Time</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: theme.primary }}>
                          {formatTime(day.departureTimeMin)}
                        </Text>
                        <IconSymbol name={activeSliderDayId === day.id ? "chevron.up" : "chevron.down"} size={16} color={theme.tertiary} />
                      </View>
                    </TouchableOpacity>

                    {activeSliderDayId === day.id && (
                      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Slider
                          value={day.departureTimeMin}
                          min={0}
                          max={1410} // 11:30 PM max
                          step={30}
                          onValueChange={(val) => setDepartureTime(day.id, val)}
                        />
                      </View>
                    )}
                  </View>

                  {day.nodes.map((node) => {
                    if (node.type === 'ActivityGroup') {
                      return (
                        <View key={node.id}>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{node.title || 'Activities'}</Text>
                            <TouchableOpacity onPress={(e) => openMenu(day.id, node.id, e)}>
                              <IconSymbol name="ellipsis" size={24} color={theme.primary} />
                            </TouchableOpacity>
                          </View>
                          {node.items?.map(item => renderOptionalItem(day.id, node.id, item))}
                        </View>
                      );
                    }
                    return renderNode(day.id, node);
                  })}

                  {/* Stay Options — always shown */}
                  <Text style={styles.sectionTitle}>Stay Options</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 10, paddingRight: 8 }}
                  >
                    {day.stayOptions.map(stay =>
                      renderStayOption(day.id, stay, day.selectedStayId === stay.id)
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={!!menuConfig}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuConfig(null)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuConfig(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}>
            {menuConfig && (
              <View
                style={[
                  styles.dropdownMenu,
                  {
                    position: 'absolute',
                    top: menuConfig.y,
                    left: menuConfig.x,
                    width: 140, // More compact width
                    padding: 4, // Tighter padding
                  }
                ]}
              >
                <TouchableOpacity
                  style={[styles.dropdownItem, { padding: 8 }]} // More compact item
                  onPress={() => resetActivityGroup(menuConfig.dayId, menuConfig.groupId)}
                >
                  <Text style={[styles.dropdownText, { marginLeft: 0 }]}>Reset Activities</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Floating Cost Bar */}
      {itinerary && (
        <Animated.View
          pointerEvents={showFloatingCost ? "auto" : "none"}
          style={[
            styles.costBar,
            {
              opacity: costBarAnim,
              transform: [
                {
                  translateY: costBarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 0],
                  })
                }
              ]
            }
          ]}
        >
          <View>
            <Text style={styles.costLabel}>Total Estimated Expense</Text>
            <Text style={styles.costValue}>PKR {totalCost.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => itinerary && onSave?.(totalCost, itinerary)}
          >
            <IconSymbol name="arrow.right.circle.fill" size={48} color={theme.accent} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
