import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Gamepad, CalendarDays, Clock, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CreateMatch = () => {
  const { players, addMatch } = useApp();
  const navigate = useNavigate();
  
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [player1Score, setPlayer1Score] = useState('');
  const [player2Score, setPlayer2Score] = useState('');
  const [matchDate, setMatchDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [matchTime, setMatchTime] = useState(format(new Date(), 'HH:mm'));
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Filtra i giocatori abilitati
  const enabledPlayers = players.filter(player => !player.disabled);
  
  // Reset errors when inputs change
  useEffect(() => {
    setErrors({});
  }, [player1Id, player2Id, matchDate, matchTime, player1Score, player2Score]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!player1Id) {
      newErrors.player1 = 'Select Player 1';
    }
    
    if (!player2Id) {
      newErrors.player2 = 'Select Player 2';
    }
    
    if (player1Id && player2Id && player1Id === player2Id) {
      newErrors.player2 = 'Players must be different';
    }
    
    if (!matchDate) {
      newErrors.date = 'Select a date';
    }
    
    if (!matchTime) {
      newErrors.time = 'Select a time';
    }

    if (!player1Score || !player2Score) {
      newErrors.score = 'Inserisci i punteggi';
    } else if (player1Score === player2Score) {
      newErrors.score = 'Il pareggio non è permesso';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create match date
      const dateTime = new Date(`${matchDate}T${matchTime}`);
      
      // Trova i giocatori selezionati
      const player1 = enabledPlayers.find(p => p._id === player1Id);
      const player2 = enabledPlayers.find(p => p._id === player2Id);
      
      if (!player1 || !player2) {
        toast.error('Uno o entrambi i giocatori non sono stati trovati');
        return;
      }
      
      // Create new match
      await addMatch({
        player1,
        player2,
        player1Score: parseInt(player1Score),
        player2Score: parseInt(player2Score),
        playedAt: dateTime.toISOString(),
        status: 'completed'
      });
      
      toast.success('Match created successfully!');
      navigate('/matches');
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Failed to create match. Please try again.');
    }
  };

  return (
    <div className="arcade-container py-8">
      {/* <button 
        className="flex items-center gap-1 text-arcade-blue font-pixel mb-8 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </button> */}
      
      <div className="arcade-card max-w-2xl mx-auto animate-scale-in">
        <div className="flex items-center gap-2 mb-6">
          <Gamepad className="w-6 h-6 text-arcade-blue" />
          <h1 className="text-2xl font-arcade text-white">Create New Match</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Player 1 Selection */}
            <div>
              <label className="block text-white/70 font-pixel mb-2">Player 1</label>
              <div className="relative">
                <select
                  value={player1Id}
                  onChange={(e) => setPlayer1Id(e.target.value)}
                  className={cn(
                    "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 appearance-none",
                    errors.player1 
                      ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                      : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                  )}
                >
                  <option value="" className="bg-arcade-dark text-white">Select Player 1</option>
                  {enabledPlayers.map(player => (
                    <option key={player._id} value={player._id} className="bg-arcade-dark text-white">
                      {player.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronLeft className="w-5 h-5 text-white/50 transform rotate-270" />
                </div>
                {errors.player1 && (
                  <p className="mt-1 text-arcade-red text-sm font-pixel flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.player1}
                  </p>
                )}
              </div>
            </div>
            
            {/* Player 2 Selection */}
            <div>
              <label className="block text-white/70 font-pixel mb-2">Player 2</label>
              <div className="relative">
                <select
                  value={player2Id}
                  onChange={(e) => setPlayer2Id(e.target.value)}
                  className={cn(
                    "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 appearance-none",
                    errors.player2 
                      ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                      : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                  )}
                >
                  <option value="" className="bg-arcade-dark text-white">Select Player 2</option>
                  {enabledPlayers
                    .filter(player => player._id !== player1Id)
                    .map(player => (
                      <option key={player._id} value={player._id} className="bg-arcade-dark text-white">
                        {player.name}
                      </option>
                    ))
                  }
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronLeft className="w-5 h-5 text-white/50 transform rotate-270" />
                </div>
                {errors.player2 && (
                  <p className="mt-1 text-arcade-red text-sm font-pixel flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.player2}
                  </p>
                )}
              </div>
            </div>
            
            {/* Player 1 Score */}
            <div>
              <label className="block text-white/70 font-pixel mb-2">Player 1 Score</label>
              <input
                type="number"
                min="0"
                value={player1Score}
                onChange={(e) => setPlayer1Score(e.target.value)}
                className={cn(
                  "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2",
                  errors.score 
                    ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                    : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                )}
              />
            </div>
            
            {/* Player 2 Score */}
            <div>
              <label className="block text-white/70 font-pixel mb-2">Player 2 Score</label>
              <input
                type="number"
                min="0"
                value={player2Score}
                onChange={(e) => setPlayer2Score(e.target.value)}
                className={cn(
                  "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2",
                  errors.score 
                    ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                    : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                )}
              />
            </div>
            
            {/* Match Date */}
            <div>
              <label className="block text-white/70 font-pixel mb-2 flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>Match Date</span>
              </label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className={cn(
                  "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2",
                  errors.date 
                    ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                    : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                )}
              />
              {errors.date && (
                <p className="mt-1 text-arcade-red text-sm font-pixel flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.date}
                </p>
              )}
            </div>
            
            {/* Match Time */}
            <div>
              <label className="block text-white/70 font-pixel mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Match Time</span>
              </label>
              <input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className={cn(
                  "bg-white/5 border text-white font-pixel w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2",
                  errors.time 
                    ? "border-arcade-red/50 focus:ring-arcade-red/50" 
                    : "border-arcade-blue/20 focus:ring-arcade-blue/50"
                )}
              />
              {errors.time && (
                <p className="mt-1 text-arcade-red text-sm font-pixel flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.time}
                </p>
              )}
            </div>
          </div>
          
          {errors.score && (
            <div className="mb-6 text-center">
              <p className="text-arcade-red text-sm font-pixel flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.score}
              </p>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="arcade-button px-8 py-3"
            >
              <Gamepad className="w-5 h-5" />
              <span>Create Match</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
