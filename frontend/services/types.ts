export interface LeaderboardEntry {
  rank: number;
  username: string;
  rating: number;
  user_id: number;
}

export interface SearchResult {
  global_rank: number;
  username: string;
  rating: number;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  page: number;
  limit: number;
}

export interface SearchResponse {
  data: SearchResult[];
}
