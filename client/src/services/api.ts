import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Player {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  rating?: number;
  wins?: number;
  losses?: number;
  pointsScored?: number;
}

export interface Match {
  _id: string;
  player1: Player;
  player2: Player;
  player1Score: number;
  player2Score: number;
  playedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const playerService = {
  create: async (data: Omit<Player, '_id' | 'createdAt' | 'updatedAt' | 'rating' | 'wins' | 'losses' | 'pointsScored'>) => {
    const response = await api.post<Player>('/players', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Player[]>('/players');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Player>(`/players/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Player>) => {
    const response = await api.put<Player>(`/players/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/players/${id}`);
    return response.data;
  }
};

export const matchService = {
  create: async (data: Omit<Match, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Match>('/matches', data);
    return response.data;
  },

  getAll: async (): Promise<Match[]> => {
    const response = await api.get('/matches');
    return response.data;
  },

  getById: async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  getByPlayer: async (playerId: string) => {
    const response = await api.get<Match[]>(`/matches/player/${playerId}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Match>) => {
    const response = await api.put<Match>(`/matches/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/matches/${id}`);
  }
}; 