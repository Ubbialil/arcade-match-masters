import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Match, playerService, matchService } from '@/services/api';

interface AppContextType {
  players: Player[];
  matches: Match[];
  addPlayer: (player: Player) => void;
  getPlayer: (id: string) => Player | undefined;
  addMatch: (match: Omit<Match, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getMatch: (id: string) => Match | undefined;
  reloadMatches: () => Promise<void>;
  reloadPlayers: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const reloadPlayers = async () => {
    try {
      const playersData = await playerService.getAll();
      const playersWithStats = playersData.map(player => ({
        ...player,
        rating: 1000,
        wins: 0,
        losses: 0,
        pointsScored: 0,
        avatarUrl: player.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name)}&backgroundColor=0ea5e9`
      }));
      setPlayers(playersWithStats);
    } catch (error) {
      console.error('Error reloading players:', error);
    }
  };

  const reloadMatches = async () => {
    try {
      const matchesData = await matchService.getAll();
      setMatches(matchesData);
    } catch (error) {
      console.error('Error reloading matches:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          reloadPlayers(),
          reloadMatches()
        ]);
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

  const addMatch = async (match: Omit<Match, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await matchService.create(match);
      await Promise.all([
        reloadMatches(),
        reloadPlayers() // Ricarica anche i player per aggiornare le statistiche
      ]);
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
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
      getMatch,
      reloadMatches,
      reloadPlayers
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
