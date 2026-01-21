import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/constants';
import { LeaderboardResponse, SearchResponse } from './types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Network Error:', error.request);
        } else {
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async getLeaderboard(page: number = 1, limit: number = 50): Promise<LeaderboardResponse> {
    const response = await this.client.get<LeaderboardResponse>('/api/leaderboard', {
      params: { page, limit },
    });
    return response.data;
  }

  async searchUsers(query: string): Promise<SearchResponse> {
    const response = await this.client.get<SearchResponse>('/api/search', {
      params: { q: query },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
