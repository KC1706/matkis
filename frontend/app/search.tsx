import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { apiService } from '../services/api';
import { SearchResult } from '../services/types';
import { SearchBar } from '../components/SearchBar';
import { RankBadge } from '../components/RankBadge';

export default function SearchScreen() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await apiService.searchUsers(query);
      setResults(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to search users');
      setResults([]);
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderItem = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultRow}>
      <View style={styles.rankColumn}>
        <Text style={styles.rankText}>{item.global_rank}</Text>
      </View>
      <View style={styles.usernameColumn}>
        <Text style={styles.usernameText}>{item.username}</Text>
      </View>
      <View style={styles.ratingColumn}>
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.rankColumn}>
        <Text style={styles.headerText}>Global Rank</Text>
      </View>
      <View style={styles.usernameColumn}>
        <Text style={styles.headerText}>Username</Text>
      </View>
      <View style={styles.ratingColumn}>
        <Text style={styles.headerText}>Rating</Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#666" />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Enter a username to search</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Users</Text>
      </View>
      <SearchBar onSearch={handleSearch} />
      {results.length > 0 && renderHeader()}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.username}-${index}`}
        ListEmptyComponent={renderEmpty}
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
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  resultRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankColumn: {
    width: 100,
    alignItems: 'center',
  },
  usernameColumn: {
    flex: 1,
    paddingLeft: 16,
  },
  ratingColumn: {
    width: 80,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  usernameText: {
    fontSize: 16,
    color: '#333',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
