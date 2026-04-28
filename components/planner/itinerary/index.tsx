import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './itinerary.styles';
import { ItineraryService } from './itinerary.service';
import { TripItinerary, ItineraryDay, ItineraryNode, StayOption } from './types';
import { Colors } from '@/constants/theme';

export default function ItineraryComponent() {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await ItineraryService.getItinerary();
    setItinerary(data);
    setLoading(false);
  };

  const toggleNode = (dayId: string, nodeId: string) => {
    if (!itinerary) return;
    
    setItinerary({
      ...itinerary,
      days: itinerary.days.map(day => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          nodes: day.nodes.map(node => {
            if (node.id !== nodeId || node.isFixed) return node;
            return { ...node, isSelected: !node.isSelected };
          })
        };
      })
    });
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
      // Add selected nodes cost
      day.nodes.forEach(node => {
        if (node.isSelected) cost += node.cost;
      });
      // Add selected stay cost
      const selectedStay = day.stayOptions.find(s => s.id === day.selectedStayId);
      if (selectedStay) cost += selectedStay.cost;
    });
    return cost;
  }, [itinerary]);

  const renderNode = (dayId: string, node: ItineraryNode) => (
    <TouchableOpacity
      key={node.id}
      style={[
        styles.nodeCard,
        node.isSelected && styles.nodeCardSelected,
        node.isFixed && styles.nodeCardFixed
      ]}
      onPress={() => toggleNode(dayId, node.id)}
      disabled={node.isFixed}
      activeOpacity={0.7}
    >
      <View style={styles.nodeTimeContainer}>
        <Text style={styles.nodeTime}>{node.time}</Text>
        <View style={{ width: 2, flex: 1, backgroundColor: theme.border, marginVertical: 4 }} />
      </View>
      <View style={styles.nodeContent}>
        <Text style={styles.nodeDescription}>{node.description}</Text>
        <Text style={styles.nodeDetails}>{node.type} • {node.duration}</Text>
      </View>
      <View style={styles.nodeAction}>
        {node.isFixed ? (
          <IconSymbol name="lock.fill" size={16} color={theme.tertiary} />
        ) : (
          <IconSymbol 
            name={node.isSelected ? "checkmark.circle.fill" : "circle"} 
            size={24} 
            color={node.isSelected ? theme.accent : theme.tertiary} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderStayOption = (dayId: string, stay: StayOption, isSelected: boolean) => (
    <TouchableOpacity
      key={stay.id}
      style={[styles.stayCard, isSelected && styles.stayCardSelected]}
      onPress={() => selectStay(dayId, stay.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.stayLevel}>{stay.level}</Text>
      <Text style={styles.stayName} numberOfLines={1}>{stay.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.stayCost}>PKR {stay.cost.toLocaleString()}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol name="star.fill" size={10} color="#f59e0b" />
          <Text style={{ fontSize: 10, color: theme.tertiary, marginLeft: 2 }}>{stay.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save and track Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {itinerary?.days.map(day => (
          <View key={day.id} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
            
            {/* Activities/Nodes */}
            {day.nodes.map(node => renderNode(day.id, node))}

            {/* Hotel Choices */}
            <View style={styles.staySection}>
              <Text style={[styles.label, { marginBottom: 12, marginLeft: 4 }]}>Stay Options</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stayScroll}
              >
                {day.stayOptions.map(stay => 
                  renderStayOption(day.id, stay, day.selectedStayId === stay.id)
                )}
              </ScrollView>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Cost Bar */}
      <View style={styles.costBar}>
        <View>
          <Text style={styles.costLabel}>Total Estimated Expense</Text>
          <Text style={styles.costValue}>PKR {totalCost.toLocaleString()}</Text>
        </View>
        <IconSymbol name="arrow.right.circle.fill" size={40} color={theme.accent} />
      </View>
    </SafeAreaView>
  );
}

const styles_extra = {
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
  }
};
