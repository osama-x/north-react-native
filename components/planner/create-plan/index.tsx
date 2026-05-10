import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './create-plan.styles';
import { TripConfig } from './types';
import { Colors } from '@/constants/theme';

interface Props {
  initialDestination?: string;
  onBack?: () => void;
  onContinue: (config: TripConfig) => void;
}

import { NorthHeader } from '@/components/ui/north-header';

export default function CreatePlanComponent({ initialDestination, onBack, onContinue }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];
  
  const trackRef = useRef<View>(null);
  const [trackInfo, setTrackInfo] = useState({ x: 0, width: 0 });
  const [isSliding, setIsSliding] = useState(false);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setTrackInfo({ x: pageX, width });
    });
  };

  const handleSliderChange = (event: GestureResponderEvent, type: 'duration' | 'budget') => {
    if (trackInfo.width === 0) return;
    
    setIsSliding(true);
    const { pageX } = event.nativeEvent;
    const relativeX = pageX - trackInfo.x;
    const percentage = Math.max(0, Math.min(1, relativeX / trackInfo.width));
    
    if (type === 'duration') {
      const value = Math.round(percentage * 14);
      setConfig(prev => ({ ...prev, duration: Math.max(1, value) }));
    } else {
      const min = 10000;
      const max = 500000;
      const value = Math.round((percentage * (max - min) + min) / 5000) * 5000;
      setConfig(prev => ({ ...prev, budget: value }));
    }
  };

  const stopSliding = () => {
    setIsSliding(false);
  };

  const [config, setConfig] = useState<TripConfig>({
    sourceCity: 'Islamabad',
    destinationCity: initialDestination || '',
    departureDate: new Date(),
    returnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 3,
    budget: 50000,
    travelers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    transportMode: 'Car',
  });

  const updateTravelers = (type: keyof TripConfig['travelers'], delta: number) => {
    setConfig(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: Math.max(0, prev.travelers[type] + delta),
      },
    }));
  };

  const renderCounter = (label: string, sub: string, type: keyof TripConfig['travelers']) => (
    <View style={styles.travelerRow}>
      <View style={styles.travelerInfo}>
        <Text style={styles.travelerLabel}>{label}</Text>
        <Text style={styles.travelerSub}>{sub}</Text>
      </View>
      <View style={styles.counter}>
        <TouchableOpacity 
          style={styles.counterButton} 
          onPress={() => updateTravelers(type, -1)}
        >
          <IconSymbol name="minus" size={16} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{config.travelers[type]}</Text>
        <TouchableOpacity 
          style={styles.counterButton} 
          onPress={() => updateTravelers(type, 1)}
        >
          <IconSymbol name="plus" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransportButton = (mode: TripConfig['transportMode'], icon: string) => (
    <TouchableOpacity
      style={[
        styles.transportButton,
        config.transportMode === mode && styles.transportButtonActive,
      ]}
      onPress={() => setConfig(prev => ({ ...prev, transportMode: mode }))}
    >
      <IconSymbol 
        name={icon as any} 
        size={24} 
        color={config.transportMode === mode ? theme.accent : theme.tertiary} 
      />
      <Text style={[
        styles.transportLabel,
        config.transportMode === mode && { color: theme.accent }
      ]}>By {mode}</Text>
      {config.transportMode === mode && (
        <IconSymbol name="checkmark.circle.fill" size={20} color={theme.accent} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NorthHeader 
        leftElement={
          onBack ? (
            <TouchableOpacity 
              style={{ padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12 }} 
              onPress={onBack}
            >
              <IconSymbol name="chevron.left" size={24} color="#ffffff" />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isSliding} // DISABLE SCROLLING WHILE SLIDING
      >

        <View style={styles.header}>
          <Text style={styles.phaseText}>Phase 01 — Logistics</Text>
          <Text style={styles.title}>Configure Your Expedition</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Source City</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Islamabad"
              placeholderTextColor={theme.tertiary}
              value={config.sourceCity}
              onChangeText={(text) => setConfig(prev => ({ ...prev, sourceCity: text }))}
            />
          </View>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Destination City</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Skardu"
              placeholderTextColor={theme.tertiary}
              value={config.destinationCity}
              onChangeText={(text) => setConfig(prev => ({ ...prev, destinationCity: text }))}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Departure</Text>
            <View style={styles.input}>
              <Text style={{ color: theme.primary }}>04/28/2026</Text>
            </View>
          </View>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Return (Auto)</Text>
            <View style={[styles.input, { opacity: 0.7 }]}>
              <Text style={{ color: theme.primary }}>01 May 2026</Text>
            </View>
          </View>
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.label}>Trip Duration</Text>
            <Text style={styles.sliderValue}>{config.duration} Days</Text>
          </View>
          <View 
            ref={trackRef}
            style={styles.sliderTrack}
            onLayout={onTrackLayout}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleSliderChange(e, 'duration')}
            onResponderMove={(e) => handleSliderChange(e, 'duration')}
            onResponderRelease={stopSliding}
            onResponderTerminate={stopSliding}
            onResponderTerminationRequest={() => false}
          >
            <View style={[styles.sliderFill, { width: `${(config.duration / 14) * 100}%` }]}>
              <View style={styles.sliderThumb} />
            </View>
          </View>
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.label}>Budget Ceiling</Text>
            <Text style={styles.sliderValue}>PKR {config.budget.toLocaleString()}</Text>
          </View>
          <View 
            style={styles.sliderTrack}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleSliderChange(e, 'budget')}
            onResponderMove={(e) => handleSliderChange(e, 'budget')}
            onResponderRelease={stopSliding}
            onResponderTerminate={stopSliding}
            onResponderTerminationRequest={() => false}
          >
            <View style={[styles.sliderFill, { width: `${((config.budget - 10000) / (500000 - 10000)) * 100}%` }]}>
              <View style={styles.sliderThumb} />
            </View>
          </View>
        </View>

        <Text style={styles.label}>Travelers</Text>
        <View style={styles.travelerSection}>
          {renderCounter('Adults', '12+ yrs', 'adults')}
          {renderCounter('Children', '2-12 yrs', 'children')}
          {renderCounter('Infants', '0-2 yrs', 'infants')}
        </View>

        <Text style={styles.label}>Mode of Transport</Text>
        <View style={styles.transportSection}>
          {renderTransportButton('Car', 'car.fill')}
          {renderTransportButton('Bus', 'bus.fill')}
          {renderTransportButton('Flight', 'airplane')}
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          activeOpacity={0.9}
          onPress={() => onContinue(config)}
        >
          <Text style={styles.continueButtonText}>Continue to Itinerary</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
