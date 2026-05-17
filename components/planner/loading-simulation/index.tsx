import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, Animated, Easing, Alert, TouchableOpacity } from 'react-native';
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
  onError?: (msg: string) => void;
  onBack?: () => void;
}

export default function LoadingSimulationComponent({ config, onComplete, onError, onBack }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
        const errMsg = err?.message || (typeof err === 'string' ? err : '');
        let friendlyMsg = errMsg || 'Failed to generate route. Please try again.';
        if (friendlyMsg.toLowerCase().includes('no route found') || friendlyMsg.toLowerCase().includes('noroutefound')) {
          friendlyMsg = "hmm.. we couldnt find a plan for this...please try again with a different destination";
        }
        setErrorMsg(friendlyMsg);
        if (onError) {
          onError(friendlyMsg);
        }
      });
  }, []);

  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (errorMsg) {
    const isNoRoute = errorMsg.toLowerCase().includes("couldnt find") || errorMsg.toLowerCase().includes("could'nt find");

    return (
      <View style={styles.container}>
        <View style={[
          styles.errorContainer,
          isNoRoute && {
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(46, 139, 88, 0.08)',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(46, 139, 88, 0.25)',
          }
        ]}>
          <View style={[
            styles.errorIconContainer,
            isNoRoute && {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(46, 139, 88, 0.15)',
            }
          ]}>
            <IconSymbol 
              name={isNoRoute ? "map.fill" : "exclamationmark.triangle.fill"} 
              size={32} 
              color={isNoRoute ? theme.accent : "#ffffff"} 
            />
          </View>
          <Text style={[
            styles.errorTitle, 
            { fontFamily: Typography.header.bold },
            isNoRoute && { color: theme.primary }
          ]}>
            {isNoRoute ? "Hmm..." : "Itinerary Failed"}
          </Text>
          <Text style={[
            styles.errorText, 
            { fontFamily: Typography.body.medium },
            isNoRoute && { color: theme.secondary }
          ]}>
            {errorMsg}
          </Text>
          {onBack && (
            <TouchableOpacity 
              style={[
                styles.tryAgainButton, 
                isNoRoute && { backgroundColor: theme.accent }
              ]} 
              onPress={onBack} 
              activeOpacity={0.9}
            >
              <Text style={[
                styles.tryAgainButtonText, 
                { fontFamily: Typography.body.bold },
                isNoRoute && { color: colorScheme === 'dark' ? '#022c22' : '#ffffff' }
              ]}>
                Try Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

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
