
import { Match } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type MatchItemProps = {
  match: Match;
  showActions?: boolean;
  onClick?: () => void;
};

const MatchItem = ({ match, showActions = false, onClick }: MatchItemProps) => {
  const { getPlayer } = useApp();
  
  const player1 = getPlayer(match.player1Id);
  const player2 = getPlayer(match.player2Id);
  
  if (!player1 || !player2) return null;
  
  const matchDate = new Date(match.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isPast = matchDate < new Date();
  
  const statusClasses = {
    'scheduled': 'bg-arcade-blue/20 text-arcade-blue',
    'in-progress': 'bg-arcade-orange/20 text-arcade-orange animate-pulse',
    'completed': 'bg-arcade-green/20 text-arcade-green'
  };
  
  const statusLabels = {
    'scheduled': 'Scheduled',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  };

  return (
    <div 
      className={cn(
        "arcade-card cursor-pointer transition-transform hover:scale-[1.02]",
        match.status === 'in-progress' ? 'border-arcade-orange/30' : '',
        match.status === 'completed' ? 'border-arcade-green/20' : ''
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("px-2 py-1 rounded-md text-xs font-pixel", statusClasses[match.status])}>
            {statusLabels[match.status]}
          </div>
        </div>
        
        <div className="flex items-center text-white/60 text-sm font-pixel gap-2">
          <Calendar className="w-3 h-3" />
          <span>{isToday ? 'Today' : format(matchDate, 'MMM d, yyyy')}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{format(matchDate, 'h:mm a')}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/30 mb-2">
            <img 
              src={player1.avatar} 
              alt={player1.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[100px] truncate">{player1.name}</span>
          
          {match.status === 'completed' && match.winner === player1.id && (
            <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs font-pixel">
              <Trophy className="w-3 h-3" />
              <span>Winner</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "text-3xl font-digital",
              match.status === 'completed' && match.winner === player1.id ? "text-arcade-green" : "text-white"
            )}>
              {match.player1Score}
            </span>
            <span className="text-white/50 font-pixel">vs</span>
            <span className={cn(
              "text-3xl font-digital",
              match.status === 'completed' && match.winner === player2.id ? "text-arcade-green" : "text-white"
            )}>
              {match.player2Score}
            </span>
          </div>
          
          {match.status === 'in-progress' && (
            <div className="text-arcade-orange text-xs font-pixel animate-pulse">
              Match in progress
            </div>
          )}
          
          {match.status === 'scheduled' && (
            <div className="text-white/50 text-xs font-pixel">
              {isPast ? 'Starting soon' : 'Upcoming match'}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/30 mb-2">
            <img 
              src={player2.avatar} 
              alt={player2.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[100px] truncate">{player2.name}</span>
          
          {match.status === 'completed' && match.winner === player2.id && (
            <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs font-pixel">
              <Trophy className="w-3 h-3" />
              <span>Winner</span>
            </div>
          )}
        </div>
      </div>
      
      {showActions && match.status === 'in-progress' && (
        <div className="mt-4 flex justify-center gap-2">
          <button className="arcade-button bg-arcade-green px-4 py-2 text-sm">
            Update Score
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-pixel transition-colors">
            End Match
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchItem;
