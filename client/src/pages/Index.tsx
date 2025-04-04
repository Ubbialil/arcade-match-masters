import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Leaderboard from '@/components/Leaderboard';
import MatchItem from '@/components/MatchItem';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Trophy, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { matchService, Player, Match } from '@/services/api';

const Index = () => {
  const { matches, players, addMatch } = useApp();
  const [showIntro, setShowIntro] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer1, setSelectedPlayer1] = useState<Player | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<Player | null>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Recent matches
  const recentMatches = matches
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, 5);
  
  // Hide intro after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddMatch = async () => {
    if (!selectedPlayer1 || !selectedPlayer2) return;
    
    setIsLoading(true);
    try {
      await addMatch({
        player1: selectedPlayer1,
        player2: selectedPlayer2,
        player1Score,
        player2Score,
        playedAt: new Date().toISOString(),
        status: 'completed'
      });
      
      setIsModalOpen(false);
      setSelectedPlayer1(null);
      setSelectedPlayer2(null);
      setPlayer1Score(0);
      setPlayer2Score(0);
    } catch (error) {
      console.error('Error creating match:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="arcade-container py-8">
      {/* Intro animation */}
      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center">
            <div className="inline-block animate-pulse-glow rounded-xl mb-4">
              <Trophy className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-arcade text-white">
              HBS <span className="text-primary glow-text animate-blink">BBB</span> <span className="text-white glow-text animate-blink">PONG</span>
            </h1>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Leaderboard - Now takes 3 columns */}
        <div className="md:col-span-3">
          <Leaderboard />
        </div>
        
        {/* Recent Matches - Now takes 1 column and more compact */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-arcade text-white">Recent</h2>
            </div>
            
            <Link to="/matches" className="text-primary font-pixel flex items-center gap-1 neon-underline text-sm">
              <span>All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {recentMatches.length > 0 ? (
              recentMatches.map(match => (
                <MatchItem 
                  key={match._id} 
                  match={match}
                  onClick={() => {}}
                  compact={true}
                />
              ))
            ) : (
              <div className="arcade-card text-center py-6">
                <p className="text-white/60 font-pixel text-sm">No matches yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Aggiungi Match */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-arcade-dark border-arcade-purple">
          <DialogHeader>
            <DialogTitle className="text-arcade-purple">Aggiungi Match</DialogTitle>
            <DialogDescription className="text-arcade-purple/80">
              Seleziona i giocatori e inserisci il punteggio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1" className="text-arcade-purple">Giocatore 1</Label>
              <Select value={selectedPlayer1?._id} onValueChange={(value) => setSelectedPlayer1(players.find(p => p._id === value) || null)}>
                <SelectTrigger className="bg-arcade-dark border-arcade-purple text-white">
                  <SelectValue placeholder="Seleziona il primo giocatore" />
                </SelectTrigger>
                <SelectContent className="bg-arcade-dark border border-arcade-purple">
                  {players.map((player) => (
                    <SelectItem 
                      key={player._id} 
                      value={player._id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-white outline-none focus:bg-arcade-purple/20 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-arcade-purple/20 data-[highlighted]:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-black/30 border border-arcade-purple/50">
                          <img 
                            src={player.avatarUrl} 
                            alt={player.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-pixel">{player.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2" className="text-arcade-purple">Giocatore 2</Label>
              <Select value={selectedPlayer2?._id} onValueChange={(value) => setSelectedPlayer2(players.find(p => p._id === value) || null)}>
                <SelectTrigger className="bg-arcade-dark border-arcade-purple text-white">
                  <SelectValue placeholder="Seleziona il secondo giocatore" />
                </SelectTrigger>
                <SelectContent className="bg-arcade-dark border border-arcade-purple">
                  {players.map((player) => (
                    <SelectItem 
                      key={player._id} 
                      value={player._id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-white outline-none focus:bg-arcade-purple/20 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-arcade-purple/20 data-[highlighted]:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-black/30 border border-arcade-purple/50">
                          <img 
                            src={player.avatarUrl} 
                            alt={player.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-pixel">{player.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player1Score" className="text-arcade-purple">Punteggio {selectedPlayer1?.name}</Label>
                <Input
                  id="player1Score"
                  type="number"
                  min="0"
                  value={player1Score}
                  onChange={(e) => setPlayer1Score(parseInt(e.target.value) || 0)}
                  className="bg-arcade-dark border-arcade-purple text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2Score" className="text-arcade-purple">Punteggio {selectedPlayer2?.name}</Label>
                <Input
                  id="player2Score"
                  type="number"
                  min="0"
                  value={player2Score}
                  onChange={(e) => setPlayer2Score(parseInt(e.target.value) || 0)}
                  className="bg-arcade-dark border-arcade-purple text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddMatch}
              disabled={!selectedPlayer1 || !selectedPlayer2 || isLoading}
              className="bg-arcade-purple hover:bg-arcade-purple/90"
            >
              {isLoading ? 'Aggiungimento...' : 'Aggiungi Match'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
