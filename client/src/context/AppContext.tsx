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
  updatePlayer: (id: string, data: Partial<Player>) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<void>;
  removeMatch: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const reloadPlayers = async () => {
    try {
      const playersData = await playerService.getAll();
      const playersWithAvatars = playersData.map(player => ({
        ...player,
        avatarUrl: player.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name)}&backgroundColor=0ea5e9`
      }));
      setPlayers(playersWithAvatars);
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

  const updatePlayer = async (id: string, data: Partial<Player>) => {
    const updatedPlayer = await playerService.update(id, data);
    setPlayers(prev => prev.map(p => p._id === id ? updatedPlayer : p));
  };

  const removePlayer = async (id: string) => {
    await playerService.delete(id);
    setPlayers(prev => prev.filter(p => p._id !== id));
  };

  const updateMatch = async (id: string, data: Partial<Match>) => {
    const updatedMatch = await matchService.update(id, data);
    setMatches(prev => prev.map(m => m._id === id ? updatedMatch : m));
  };

  const removeMatch = (id: string) => {
    setMatches(prev => prev.filter(m => m._id !== id));
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
      reloadPlayers,
      updatePlayer,
      removePlayer,
      updateMatch,
      removeMatch
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
