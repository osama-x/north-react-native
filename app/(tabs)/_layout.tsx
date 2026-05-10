import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
];

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
        }
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
      {/* Explicitly hide stays if the file exists to ensure it doesn't show up in bottom nav */}
      <Tabs.Screen
        name="stays"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
