import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import PlayerCard from '@/components/PlayerCard';
import { Plus, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playerService, Player } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Players = () => {
  const { players, addPlayer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sort players by rating
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  
  // Filter players based on search
  const filteredPlayers = sortedPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;
    
    setIsLoading(true);
    try {
      const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(newPlayerName)}&backgroundColor=0ea5e9`;
      const newPlayer = await playerService.create({
        name: newPlayerName,
        email: `${newPlayerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        password: 'password123', // In un'app reale, questo dovrebbe essere gestito in modo sicuro
        avatarUrl
      });
      
      addPlayer(newPlayer);
      setNewPlayerName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Errore durante l\'aggiunta del giocatore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="arcade-container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-arcade text-white flex items-center">
          <Users className="w-8 h-8 mr-2 text-primary" />
          <span>Players</span>
        </h1>
        
        <button 
          className="arcade-button"
          onClick={() => setIsModalOpen(true)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player, index) => (
          <PlayerCard 
            key={player._id} 
            player={player} 
            rank={index + 1}
          />
        ))}
        
        {filteredPlayers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-arcade-blue/30" />
            <p className="text-white/60 font-pixel text-lg mb-6">No players found</p>
          </div>
        )}
      </div>
      
      {/* Modal Aggiungi Giocatore */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-arcade-dark border-arcade-purple">
          <DialogHeader>
            <DialogTitle className="text-arcade-purple">Aggiungi Giocatore</DialogTitle>
            <DialogDescription className="text-arcade-purple/80">
              Inserisci il nome del nuovo giocatore
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-arcade-purple">Nome</Label>
              <Input
                id="name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nome del giocatore"
                className="bg-arcade-dark border-arcade-purple text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim() || isLoading}
              className="bg-arcade-purple hover:bg-arcade-purple/90"
            >
              {isLoading ? 'Aggiungimento...' : 'Aggiungi Giocatore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Players;
