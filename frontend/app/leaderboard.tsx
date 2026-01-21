import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { apiService } from '../services/api';
import { LeaderboardEntry } from '../services/types';
import { UserCard } from '../components/UserCard';
import { usePolling } from '../hooks/usePolling';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadLeaderboard = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setError(null);
      if (!append) {
        setLoading(true);
      }

      const response = await apiService.getLeaderboard(pageNum, 50);
      
      if (append) {
        setEntries(prev => [...prev, ...response.data]);
      } else {
        setEntries(response.data);
      }

      setHasMore(response.data.length === 50);
      setPage(pageNum);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load leaderboard';
      setError(errorMessage);
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Polling for live updates
  usePolling(() => {
    if (!loading && !refreshing) {
      loadLeaderboard(1, false);
    }
  }, 3000, false); // Poll every 3 seconds, don't run immediately

  useEffect(() => {
    loadLeaderboard(1, false);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadLeaderboard(1, false);
  }, [loadLeaderboard]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !refreshing) {
      loadLeaderboard(page + 1, true);
    }
  }, [loading, hasMore, page, loadLeaderboard, refreshing]);

  const renderItem = ({ item }: { item: LeaderboardEntry }) => (
    <UserCard entry={item} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  };

  if (loading && entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  if (error && entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadLeaderboard(1, false)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
      </View>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
