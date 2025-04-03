import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Match } from '@/context/AppContext';
import { ChevronUp, ChevronDown, AlertCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type ScoreTrackerProps = {
  matchId: string;
  onFinish: () => void;
};

const ScoreTracker = ({ matchId, onFinish }: ScoreTrackerProps) => {
  const { matches, updateMatch, getPlayer } = useApp();
  const match = matches.find(m => m.id === matchId);
  
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  
  // Sync with match data
  useEffect(() => {
    if (match) {
      setPlayer1Score(match.player1Score);
      setPlayer2Score(match.player2Score);
    }
  }, [match]);
  
  if (!match) return <div>Match not found</div>;
  
  const player1 = getPlayer(match.player1Id);
  const player2 = getPlayer(match.player2Id);
  
  if (!player1 || !player2) return <div>Players not found</div>;
  
  const incrementPlayer1 = () => {
    const newScore = player1Score + 1;
    setPlayer1Score(newScore);
    updateMatch(matchId, { player1Score: newScore });
  };
  
  const decrementPlayer1 = () => {
    if (player1Score > 0) {
      const newScore = player1Score - 1;
      setPlayer1Score(newScore);
      updateMatch(matchId, { player1Score: newScore });
    }
  };
  
  const incrementPlayer2 = () => {
    const newScore = player2Score + 1;
    setPlayer2Score(newScore);
    updateMatch(matchId, { player2Score: newScore });
  };
  
  const decrementPlayer2 = () => {
    if (player2Score > 0) {
      const newScore = player2Score - 1;
      setPlayer2Score(newScore);
      updateMatch(matchId, { player2Score: newScore });
    }
  };
  
  const finishMatch = () => {
    setIsFinishModalOpen(false);
    onFinish();
  };

  return (
    <div className="w-full arcade-card">
      <h2 className="text-xl font-arcade text-white mb-4 text-center">Match Score Tracker</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Player 1 */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/30 mb-2">
            <img 
              src={player1.avatar} 
              alt={player1.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[180px] mb-3 truncate">{player1.name}</span>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={decrementPlayer1}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            
            <div className="w-20 h-20 flex items-center justify-center bg-arcade-blue/20 rounded-md border border-arcade-blue/30">
              <span className="text-4xl font-digital text-white glow-text">{player1Score}</span>
            </div>
            
            <button 
              className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={incrementPlayer1}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="text-white/50 font-pixel text-xl">VS</div>
        
        {/* Player 2 */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/30 mb-2">
            <img 
              src={player2.avatar} 
              alt={player2.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[180px] mb-3 truncate">{player2.name}</span>
          
          <div className="flex items-center gap-3">
            <button 
              className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={decrementPlayer2}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            
            <div className="w-20 h-20 flex items-center justify-center bg-arcade-blue/20 rounded-md border border-arcade-blue/30">
              <span className="text-4xl font-digital text-white glow-text">{player2Score}</span>
            </div>
            
            <button 
              className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={incrementPlayer2}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setIsFinishModalOpen(true)}
          className="px-6 py-2 bg-arcade-blue text-white rounded-md hover:bg-arcade-blue/80 transition-colors flex items-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          <span>Fine Partita</span>
        </button>
      </div>
      
      {isFinishModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-arcade-dark p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-arcade text-white mb-4 text-center">Conferma Fine Partita</h3>
            <p className="text-white/80 text-center mb-6">
              Sei sicuro di voler terminare la partita?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsFinishModalOpen(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={finishMatch}
                className="px-4 py-2 bg-arcade-blue text-white rounded-md hover:bg-arcade-blue/80 transition-colors"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreTracker;
