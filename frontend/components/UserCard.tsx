import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RankBadge } from './RankBadge';
import { LeaderboardEntry } from '../services/types';

interface UserCardProps {
  entry: LeaderboardEntry;
}

export const UserCard: React.FC<UserCardProps> = ({ entry }) => {
  return (
    <View style={styles.card}>
      <RankBadge rank={entry.rank} size="small" />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{entry.username}</Text>
        <Text style={styles.rating}>{entry.rating} pts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
