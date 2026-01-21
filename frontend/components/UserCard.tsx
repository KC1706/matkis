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
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  rating: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
});
