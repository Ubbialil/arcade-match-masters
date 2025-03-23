
import { useState } from 'react';
import { Player } from '@/context/AppContext';
import { Trophy, TrendingUp, Target, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlayerCardProps = {
  player: Player;
  rank?: number;
  highlight?: boolean;
};

const PlayerCard = ({ player, rank, highlight = false }: PlayerCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const winPercentage = player.wins + player.losses > 0 
    ? Math.round((player.wins / (player.wins + player.losses)) * 100) 
    : 0;
    
  const totalMatches = player.wins + player.losses;

  return (
    <div 
      className={cn(
        "arcade-card transition-all duration-300",
        highlight ? "ring-2 ring-arcade-pink/50" : "",
        isHovering ? "translate-y-[-5px]" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Rank badge (if provided) */}
      {rank !== undefined && (
        <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center rounded-full bg-arcade-darker border-2 border-arcade-blue/50 font-pixel text-white">
          {rank}
        </div>
      )}

      <div className="flex flex-col items-center mb-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 bg-gradient-to-b from-arcade-blue/20 to-arcade-purple/20 p-1">
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-full h-full object-cover rounded-full"
          />
          {/* Champion badge */}
          {rank === 1 && (
            <div className="absolute top-0 right-0 bg-yellow-500 rounded-full p-1">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="text-xl text-white font-pixel text-center">{player.name}</h3>
        
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-4 h-4 text-arcade-blue" />
          <span className="text-arcade-blue font-pixel">{player.rating}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-md p-3 flex flex-col items-center">
          <div className="text-green-400 font-pixel text-2xl">{player.wins}</div>
          <div className="text-white/70 text-sm font-pixel">Wins</div>
        </div>
        
        <div className="bg-white/5 rounded-md p-3 flex flex-col items-center">
          <div className="text-red-400 font-pixel text-2xl">{player.losses}</div>
          <div className="text-white/70 text-sm font-pixel">Losses</div>
        </div>
      </div>
      
      <div className="mt-4 bg-white/5 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-sm font-pixel">Win Rate</span>
          <span className="text-white font-pixel">{winPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-arcade-blue rounded-full transition-all duration-500"
            style={{ width: `${winPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-arcade-orange" />
          <div className="text-white/70 text-sm font-pixel">{totalMatches} Matches</div>
        </div>
        
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-arcade-yellow" />
          <div className="text-white/70 text-sm font-pixel">{player.pointsScored} Points</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
