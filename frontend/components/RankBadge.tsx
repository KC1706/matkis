import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RankBadgeProps {
  rank: number;
  size?: 'small' | 'medium' | 'large';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'medium' }) => {
  const getRankColor = () => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#666';
  };

  const sizeStyles = {
    small: { fontSize: 12, padding: 4, minWidth: 30 },
    medium: { fontSize: 16, padding: 6, minWidth: 40 },
    large: { fontSize: 20, padding: 8, minWidth: 50 },
  };

  return (
    <View style={[styles.badge, sizeStyles[size], { backgroundColor: getRankColor() }]}>
      <Text style={[styles.rankText, { fontSize: sizeStyles[size].fontSize }]}>
        {rank}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
