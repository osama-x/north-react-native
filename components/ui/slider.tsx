import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, LayoutChangeEvent, GestureResponderEvent, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
}

export function Slider({ value, min, max, step, onValueChange }: SliderProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const trackRef = useRef<View>(null);
  const [trackInfo, setTrackInfo] = useState({ x: 0, width: 0 });

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setTrackInfo({ x: pageX, width });
    });
  };

  const handleSliderChange = (event: GestureResponderEvent) => {
    if (trackInfo.width === 0) return;
    
    const { pageX } = event.nativeEvent;
    const relativeX = pageX - trackInfo.x;
    const percentage = Math.max(0, Math.min(1, relativeX / trackInfo.width));
    
    let rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));
    
    if (finalValue !== value) {
      onValueChange(finalValue);
    }
  };

  const percentage = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return (
    <View 
      ref={trackRef}
      style={[
        styles.sliderTrack, 
        { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
      ]}
      onLayout={onTrackLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleSliderChange}
      onResponderMove={handleSliderChange}
      onResponderTerminationRequest={() => false}
    >
      <View style={[styles.sliderFill, { width: `${percentage * 100}%`, backgroundColor: theme.accent }]}>
        <View style={[styles.sliderThumb, { borderColor: theme.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    // @ts-ignore - web support
    touchAction: 'none',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    marginRight: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
