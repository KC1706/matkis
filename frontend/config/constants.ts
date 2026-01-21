import Constants from 'expo-constants';

// API Base URL for Golang backend
// For local development: http://localhost:8080
// For production: Set EXPO_PUBLIC_API_URL to your Railway/Render backend URL
// Default: http://localhost:8080 (local development)

// IMPORTANT: Update frontend/.env file to set EXPO_PUBLIC_API_URL=http://localhost:8080
// Or uncomment the line below to hardcode the URL
const DEFAULT_API_URL = 'http://localhost:8080';

export const API_BASE_URL = 
  Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  DEFAULT_API_URL;
