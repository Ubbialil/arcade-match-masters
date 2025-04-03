
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PlayerCard from '@/components/PlayerCard';
import { Plus, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Players = () => {
  const { players, addPlayer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Sort players by rating
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  
  // Filter players based on search
  const filteredPlayers = sortedPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      // Generate a random avatar using DiceBear API
      const randomColor = ['0ea5e9', 'd946ef', '8b5cf6', 'f97316', '4ade80'][
        Math.floor(Math.random() * 5)
      ];
      
      const avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(newPlayerName)}&backgroundColor=${randomColor}`;
      
      addPlayer({
        name: newPlayerName.trim(),
        avatar
      });
      
      setNewPlayerName('');
      setShowAddPlayer(false);
    }
  };

  return (
    <div className="arcade-container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-arcade text-white flex items-center">
          <Users className="w-8 h-8 mr-2 text-arcade-purple" />
          <span>Players</span>
        </h1>
        
        <button 
          className="arcade-button"
          onClick={() => setShowAddPlayer(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Player</span>
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="relative mb-8 max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/50" />
        </div>
        <input
          type="text"
          placeholder="Search players..."
          className="bg-white/5 border border-arcade-blue/20 text-white font-pixel w-full py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-arcade-blue/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Players grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-in-bottom">
        {filteredPlayers.map((player, index) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            rank={index + 1}
            highlight={index === 0}
          />
        ))}
        
        {filteredPlayers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-arcade-blue/30" />
            <p className="text-white/60 font-pixel text-lg mb-6">No players found</p>
            <button 
              className="arcade-button"
              onClick={() => setShowAddPlayer(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add Player</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
          <div className="arcade-card max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-arcade text-white mb-4">Add New Player</h3>
            
            <div className="mb-4">
              <label className="block text-white/70 font-pixel mb-2">Player Name</label>
              <input
                type="text"
                className="bg-white/5 border border-arcade-blue/20 text-white font-pixel w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-arcade-blue/50"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-pixel transition-colors"
                onClick={() => setShowAddPlayer(false)}
              >
                Cancel
              </button>
              <button 
                className={cn(
                  "arcade-button",
                  !newPlayerName.trim() ? "opacity-50 cursor-not-allowed" : ""
                )}
                onClick={handleAddPlayer}
                disabled={!newPlayerName.trim()}
              >
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
