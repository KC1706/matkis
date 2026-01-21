import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { apiService } from '../services/api';
import { SearchResult } from '../services/types';
import { SearchBar } from '../components/SearchBar';
import { RankBadge } from '../components/RankBadge';
import { BottomNavigation } from '../components/BottomNavigation';

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
          <Image
            source={require('../assets/sreach/Frame 185.png')}
            style={styles.errorIllustration}
            resizeMode="contain"
          />
        </View>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../assets/sreach/Frame 185.png')}
            style={styles.errorIllustration}
            resizeMode="contain"
          />
         
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('../assets/sreach/Frame 182.png')}
          style={styles.emptyIllustration}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Search by Name</Text>
          <Text style={styles.subtitle}>Ex. Rahul</Text>
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
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 14,
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e8ecf0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultRow: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  rankColumn: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameColumn: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  ratingColumn: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  usernameText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  ratingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIllustration: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
  errorIllustration: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 24,
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 12,
  },
});
