import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, Animated, Easing, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './loading.styles';
import { Colors, Typography } from '@/constants/theme';
import { PlannerService } from '../planner.service';
import { TripConfig } from '../create-plan/types';
import { TripItinerary } from '../itinerary/types';

const STEPS = [
  { id: 0, text: 'Analyzing route from origin to destination...' },
  { id: 1, text: 'Calculating driving time for mountain terrain...' },
  { id: 2, text: 'Finding optimal stops along the way...' },
  { id: 3, text: 'Scheduling activities for each day...' },
  { id: 4, text: 'Finalizing your personalized itinerary...' },
];

interface Props {
  config: TripConfig;
  onComplete: (itinerary: TripItinerary) => void;
  onError: (msg: string) => void;
}

export default function LoadingSimulationComponent({ config, onComplete, onError }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [currentStep, setCurrentStep] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  const itineraryRef = useRef<TripItinerary | null>(null);
  const apiDoneRef = useRef(false);
  const stepsDoneRef = useRef(false);

  // ── Spinner ───────────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // ── Step progression (visual) ─────────────────────────────────────────────
  useEffect(() => {
    const STEP_MS = 900;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          stepsDoneRef.current = true;
          // If API already returned, complete now
          if (apiDoneRef.current && itineraryRef.current) {
            setTimeout(() => onComplete(itineraryRef.current!), 400);
          }
          return prev;
        }
        return prev + 1;
      });
    }, STEP_MS);
    return () => clearInterval(interval);
  }, []);

  // ── API call (parallel to animation) ────────────────────────────────────
  useEffect(() => {
    PlannerService.findRoute(config)
      .then(itinerary => {
        itineraryRef.current = itinerary;
        apiDoneRef.current = true;
        // If steps already finished, complete now
        if (stepsDoneRef.current) {
          setTimeout(() => onComplete(itinerary), 400);
        }
      })
      .catch(err => {
        console.error('findRoute error:', err);
        onError(err?.message ?? 'Failed to generate route. Please try again.');
      });
  }, []);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol name="sparkles" size={48} color={theme.accent} />
      </View>
      <Text style={[styles.title, { fontFamily: Typography.header.bold }]}>Crafting Your Itinerary</Text>
      <Text style={[styles.subtitle, { fontFamily: Typography.body.medium }]}>
        Planning {config.sourceCity} → {config.destinationCity}
      </Text>
      <View style={styles.stepsContainer}>
        {STEPS.map(step => {
          const isSuccess = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={[styles.stepIcon, isSuccess && styles.stepIconSuccess, isActive && styles.stepIconActive]}>
                {isSuccess ? (
                  <IconSymbol name="checkmark.circle.fill" size={14} color="#ffffff" />
                ) : isActive ? (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <IconSymbol name="arrow.triangle.2.circlepath" size={14} color={theme.accent} />
                  </Animated.View>
                ) : null}
              </View>
              <Text style={[
                styles.stepText,
                { fontFamily: Typography.body.medium },
                isActive && [styles.stepTextActive, { fontFamily: Typography.body.bold }],
                isSuccess && styles.stepTextSuccess,
              ]}>
                {step.text}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
