import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isLeaderboardActive = pathname === '/leaderboard';
  const isSearchActive = pathname === '/search';

  // Hide bottom nav on index screen
  if (pathname === '/') {
    return null;
  }

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navButton, isLeaderboardActive && styles.navButtonActive, styles.navButtonLeft]}
        onPress={() => router.push('/leaderboard')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navButtonText, isLeaderboardActive && styles.navButtonTextActive]}>
          Leaderboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, isSearchActive && styles.navButtonActive, styles.navButtonRight]}
        onPress={() => router.push('/search')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navButtonText, isSearchActive && styles.navButtonTextActive]}>
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLeft: {
    marginRight: 6,
  },
  navButtonRight: {
    marginLeft: 6,
  },
  navButtonActive: {
    backgroundColor: '#2196F3',
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextActive: {
    color: '#ffffff',
  },
});
