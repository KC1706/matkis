import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  debounceMs = 300,
  placeholder = 'Search users...',
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      } else {
        onSearch('');
      }
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isSearching && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#666" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  loader: {
    marginLeft: 8,
  },
});
