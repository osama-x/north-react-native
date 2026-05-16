import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Config } from '@/constants/config';

const TABS_CONFIG = [
  {
    name: 'index',
    title: 'Updates',
    icon: 'bell.fill' as const,
  },
  {
    name: 'explore',
    title: 'Explore',
    icon: 'map.fill' as const,
  },
  {
    name: 'plan',
    title: 'Plan',
    icon: 'calendar.fill' as const,
  },
  ...(Config.FEATURES.ENABLE_STAYS ? [{
    name: 'stays',
    title: 'Stays',
    icon: 'bed.double.fill' as const,
  }] : []),
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person.fill' as const,
  },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.glassBorder,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            intensity={80}
            style={[StyleSheet.absoluteFill, { backgroundColor: theme.headerBg }]}
          />
        ),
      }}>
      {TABS_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name={tab.icon} color={color} />,
          }}
        />
      ))}
      
      {/* Explicitly hide stays if feature is disabled but file exists */}
      {!Config.FEATURES.ENABLE_STAYS && (
        <Tabs.Screen
          name="stays"
          options={{
            href: null,
          }}
        />
      )}
    </Tabs>
  );
}
