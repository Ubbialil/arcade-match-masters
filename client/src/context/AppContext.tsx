import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Match, playerService, matchService } from '@/services/api';

export type Player = {
  id: string;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  pointsScored: number;
  rating: number;
};

export type Match = {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  winner?: string;
};

interface AppContextType {
  players: Player[];
  matches: Match[];
  addPlayer: (player: Player) => void;
  getPlayer: (id: string) => Player | undefined;
  addMatch: (match: Match) => void;
  getMatch: (id: string) => Match | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, matchesData] = await Promise.all([
          playerService.getAll(),
          matchService.getAll()
        ]);

        // Aggiungi dati aggiuntivi ai giocatori per la visualizzazione
        const playersWithStats = playersData.map(player => ({
          ...player,
          rating: 1000,
          wins: 0,
          losses: 0,
          pointsScored: 0,
          avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name)}&backgroundColor=0ea5e9`
        }));

        setPlayers(playersWithStats);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  const getPlayer = (id: string) => {
    return players.find(player => player._id === id);
  };

  const addMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
  };

  const getMatch = (id: string) => {
    return matches.find(match => match._id === id);
  };

  return (
    <AppContext.Provider value={{
      players,
      matches,
      addPlayer,
      getPlayer,
      addMatch,
      getMatch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
