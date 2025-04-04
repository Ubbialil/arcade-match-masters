import { Player } from '@/services/api';
import { Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlayerCardProps {
  player: Player;
  rank?: number;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

const PlayerCard = ({ 
  player, 
  rank, 
  selected = false,
  onSelect,
  onRemove
}: PlayerCardProps) => {
  return (
    <Link 
      to={`/players/${player._id}`}
      className={`
        arcade-card relative overflow-hidden 
        transition-all duration-200 
        ${onSelect ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${selected ? 'ring-2 ring-primary' : ''}
      `}
      onClick={onSelect ? (e) => {
        e.preventDefault(); // Prevent navigation when used as a selectable card
        onSelect();
      } : undefined}
    >
      {rank && (
        <div className="absolute top-0 left-0 bg-primary px-3 py-1">
          <span className="font-pixel text-white">#{rank}</span>
        </div>
      )}
      
      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-500 transition-colors"
          aria-label="Remove player"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="flex items-center gap-4 p-4">
        <div className="pixel-box w-16 h-16 flex-shrink-0">
          <img 
            src={player.avatarUrl} 
            alt={player.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="ml-4 flex-grow">
          <h3 className="text-white font-pixel text-lg mb-1">{player.name}</h3>
          
          <div className="flex items-center text-sm">
            <div className="text-white/70 mr-4">
              <span className="font-bold text-primary">{player.wins}</span> W
            </div>
            <div className="text-white/70 mr-4">
              <span className="font-bold text-red-500">{player.losses}</span> L
            </div>
            <div className="text-white/70 mr-4">
              <span className="font-bold text-arcade-green">{player.winRate.toFixed(1)}%</span>
            </div>
            <div className="text-white/70">
              <Trophy className="h-3 w-3 inline mr-1 text-primary" />
              <span className="font-bold">{player.rating}</span>
            </div>
          </div>
          
          {/* <div className="mt-2 text-xs text-white/50">
            <div>Partite giocate: {player.matchesPlayed}</div>
            <div>Punti segnati: {player.pointsScored}</div>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;
