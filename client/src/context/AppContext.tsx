
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockPlayers, mockMatches } from '@/lib/data';

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

type AppContextType = {
  players: Player[];
  matches: Match[];
  addPlayer: (player: Omit<Player, 'id' | 'wins' | 'losses' | 'pointsScored' | 'rating'>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  getPlayer: (id: string) => Player | undefined;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [matches, setMatches] = useState<Match[]>(mockMatches);

  // Load from localStorage if available
  useEffect(() => {
    const storedPlayers = localStorage.getItem('arcade-players');
    const storedMatches = localStorage.getItem('arcade-matches');
    
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
    
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('arcade-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('arcade-matches', JSON.stringify(matches));
  }, [matches]);

  const addPlayer = (player: Omit<Player, 'id' | 'wins' | 'losses' | 'pointsScored' | 'rating'>) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: player.name,
      avatar: player.avatar,
      wins: 0,
      losses: 0,
      pointsScored: 0,
      rating: 1000, // Starting ELO rating
    };
    
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      id: crypto.randomUUID(),
      ...match,
    };
    
    setMatches((prev) => [...prev, newMatch]);

    // Update player stats if match is completed
    if (match.status === 'completed' && match.winner) {
      updatePlayerStats(match);
    }
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches((prev) => 
      prev.map((match) => {
        if (match.id === id) {
          const updated = { ...match, ...updates };
          
          // If match was just completed, update player stats
          if (updates.status === 'completed' && updates.winner && match.status !== 'completed') {
            updatePlayerStats(updated);
          }
          
          return updated;
        }
        return match;
      })
    );
  };

  const updatePlayerStats = (match: Match) => {
    const { player1Id, player2Id, player1Score, player2Score, winner } = match;
    
    setPlayers((prev) => 
      prev.map((player) => {
        // Update player 1 stats
        if (player.id === player1Id) {
          return {
            ...player,
            wins: winner === player1Id ? player.wins + 1 : player.wins,
            losses: winner !== player1Id ? player.losses + 1 : player.losses,
            pointsScored: player.pointsScored + player1Score,
            rating: calculateNewRating(
              player.rating,
              prev.find(p => p.id === player2Id)?.rating || 1000,
              winner === player1Id
            )
          };
        }
        
        // Update player 2 stats
        if (player.id === player2Id) {
          return {
            ...player,
            wins: winner === player2Id ? player.wins + 1 : player.wins,
            losses: winner !== player2Id ? player.losses + 1 : player.losses,
            pointsScored: player.pointsScored + player2Score,
            rating: calculateNewRating(
              player.rating,
              prev.find(p => p.id === player1Id)?.rating || 1000,
              winner === player2Id
            )
          };
        }
        
        return player;
      })
    );
  };

  // Simple ELO rating calculation
  const calculateNewRating = (currentRating: number, opponentRating: number, won: boolean): number => {
    const kFactor = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    const actualScore = won ? 1 : 0;
    
    return Math.round(currentRating + kFactor * (actualScore - expectedScore));
  };

  const getPlayer = (id: string) => {
    return players.find(player => player.id === id);
  };

  return (
    <AppContext.Provider 
      value={{ 
        players, 
        matches, 
        addPlayer, 
        addMatch, 
        updateMatch,
        getPlayer
      }}
    >
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
