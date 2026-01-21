import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          href: null, // Hide from tabs - using custom nav
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null, // Hide from tabs - using custom nav
        }}
      />
    </Tabs>
  );
}
