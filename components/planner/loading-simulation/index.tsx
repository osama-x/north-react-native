import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './loading.styles';
import { Colors } from '@/constants/theme';

interface Step {
  id: number;
  text: string;
}

const STEPS: Step[] = [
  { id: 0, text: 'Analyzing route from Origin to Destination...' },
  { id: 1, text: 'Calculating fuel costs for mountain terrain...' },
  { id: 2, text: 'Finding best hotel options for each stop...' },
  { id: 3, text: 'Optimizing daily schedule for sightseeing...' },
  { id: 4, text: 'Estimating food & activity expenses...' },
];

interface Props {
  onComplete: () => void;
}

export default function LoadingSimulationComponent({ onComplete }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];

  const [currentStep, setCurrentStep] = useState(0);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Rotation animation for the spinner
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Step progression simulation
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderStep = (step: Step) => {
    const isSuccess = currentStep > step.id;
    const isActive = currentStep === step.id;

    return (
      <View key={step.id} style={styles.stepRow}>
        <View style={[
          styles.stepIcon,
          isSuccess && styles.stepIconSuccess,
          isActive && styles.stepIconActive
        ]}>
          {isSuccess ? (
            <IconSymbol name="checkmark" size={14} color="#ffffff" />
          ) : isActive ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={14} color={theme.accent} />
            </Animated.View>
          ) : null}
        </View>
        <Text style={[
          styles.stepText,
          isActive && styles.stepTextActive,
          isSuccess && styles.stepTextSuccess
        ]}>
          {step.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol name="sparkles" size={48} color={theme.accent} />
      </View>
      
      <Text style={styles.title}>Crafting Your Itinerary</Text>
      <Text style={styles.subtitle}>Our AI is planning the perfect trip for you</Text>

      <View style={styles.stepsContainer}>
        {STEPS.map(renderStep)}
      </View>
    </View>
  );
}
