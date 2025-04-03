import { Match } from '@/services/api';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type MatchItemProps = {
  match: Match;
  showActions?: boolean;
  onClick?: () => void;
};

const MatchItem = ({ match, showActions = false, onClick }: MatchItemProps) => {
  const matchDate = new Date(match.playedAt);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isPast = matchDate < new Date();
  
  const winner = match.player1Score > match.player2Score ? match.player1 : match.player2;

  return (
    <div 
      className="arcade-card cursor-pointer transition-transform hover:scale-[1.02] border-arcade-green/20"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-md text-xs font-pixel bg-arcade-green/20 text-arcade-green">
            Completed
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
              src={match.player1.avatarUrl} 
              alt={match.player1.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[100px] truncate">{match.player1.name}</span>
          
          {winner._id === match.player1._id && (
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
              winner._id === match.player1._id ? "text-arcade-green" : "text-white"
            )}>
              {match.player1Score}
            </span>
            <span className="text-white/50 font-pixel">vs</span>
            <span className={cn(
              "text-3xl font-digital",
              winner._id === match.player2._id ? "text-arcade-green" : "text-white"
            )}>
              {match.player2Score}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/30 mb-2">
            <img 
              src={match.player2.avatarUrl} 
              alt={match.player2.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-pixel text-center max-w-[100px] truncate">{match.player2.name}</span>
          
          {winner._id === match.player2._id && (
            <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs font-pixel">
              <Trophy className="w-3 h-3" />
              <span>Winner</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchItem;
