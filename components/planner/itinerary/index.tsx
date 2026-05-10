import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './itinerary.styles';
import { ItineraryService, formatTime } from './itinerary.service';
import { TripItinerary, ItineraryDay, ItineraryNode, StayOption } from './types';
import { Colors } from '@/constants/theme';

import { NorthHeader } from '@/components/ui/north-header';
import { Config } from '@/constants/config';
import { Slider } from '@/components/ui/slider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  onSave?: (totalCost: number, itinerary: TripItinerary) => void;
  onBack?: () => void;
}

export default function ItineraryComponent({ onSave, onBack }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
  const [menuConfig, setMenuConfig] = useState<{ dayId: string; groupId: string; x: number; y: number } | null>(null);
  const [activeSliderDayId, setActiveSliderDayId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
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
      if (Config.FEATURES.ENABLE_STAYS) {
        const selectedStay = day.stayOptions.find(s => s.id === day.selectedStayId);
        if (selectedStay) cost += selectedStay.cost;
      }
    });
    return cost;
  }, [itinerary]);

  const renderNode = (dayId: string, node: ItineraryNode) => (
    <View key={node.id} style={styles.mustHaveCard}>
      <View style={styles.cardHeader}>
        <View style={styles.timeTag}>
          <Text style={styles.timeText}>{node.time}</Text>
        </View>
        <Text style={styles.durationText}>{node.duration}</Text>
      </View>
      <Text style={styles.cardTitle}>{node.title}</Text>
      {node.summary && <Text style={styles.cardSummary}>{node.summary}</Text>}
      {node.type === 'Travel' && node.arrivalTime && node.toLocation && (
        <Text style={styles.arrivalNote}>
          You will arrive at {node.toLocation} at {node.arrivalTime}
        </Text>
      )}
    </View>
  );

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

  const renderStayOption = (dayId: string, stay: StayOption, isSelected: boolean) => (
    <TouchableOpacity
      key={stay.id}
      style={[styles.stayCard, isSelected && styles.stayCardSelected]}
      onPress={() => selectStay(dayId, stay.id)}
      activeOpacity={0.8}
    >
      {stay.image && <Image source={{ uri: stay.image }} style={styles.stayImage} />}
      <View style={styles.stayInfo}>
        <Text style={styles.stayName} numberOfLines={1}>{stay.name}</Text>
        <Text style={styles.stayPrice}>PKR {stay.cost.toLocaleString()}</Text>
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={10} color="#f59e0b" />
          <Text style={styles.ratingText}>{stay.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.saveButtonText}>Save and Track</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
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

                  {Config.FEATURES.ENABLE_STAYS && (
                    <>
                      <Text style={styles.sectionTitle}>Stay Options</Text>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 8 }}
                      >
                        {day.stayOptions.map(stay => 
                          renderStayOption(day.id, stay, day.selectedStayId === stay.id)
                        )}
                      </ScrollView>
                    </>
                  )}
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

      <View style={styles.costBar}>
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
      </View>
    </View>
  );
}
