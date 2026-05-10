import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography } from '@/constants/theme';

interface NorthHeaderProps {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  showLogo?: boolean;
}

export function NorthHeader({ 
  title, 
  leftElement, 
  rightElement, 
  showLogo = true 
}: NorthHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.leftGroup}>
          {leftElement}
          {showLogo && (
            <Image 
              source={require('@/assets/images/green_screen.png')}
              style={[styles.logo, leftElement ? { marginLeft: 12 } : null]}
              contentFit="contain"
            />
          )}
        </View>
        
        <View style={styles.centerContainer}>
          {!showLogo && title && <Text style={styles.titleText}>{title}</Text>}
        </View>

        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e8b58',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  content: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftGroup: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  centerContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 2,
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 38,
  },
  titleText: {
    fontFamily: Typography.header.bold,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
});
