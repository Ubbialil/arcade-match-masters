
import { useApp } from '@/context/AppContext';
import { Trophy, Medal, Award, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { players } = useApp();
  
  // Sort players by wins and then by rating
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.rating - a.rating;
  });

  return (
    <div className="w-full arcade-card animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-arcade text-white">Leaderboard</h2>
      </div>
      
      <div className="overflow-hidden rounded-md border border-arcade-blue/20">
        <div className="bg-white/5 p-3 grid grid-cols-8 gap-4 text-sm font-pixel text-white/70 border-b border-arcade-blue/20">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-3 md:col-span-2">Player</div>
          <div className="col-span-1 text-center hidden md:block">W</div>
          <div className="col-span-1 text-center hidden md:block">L</div>
          <div className="col-span-1 text-center">W/L</div>
          <div className="col-span-2 md:col-span-1 text-center">Win %</div>
          <div className="col-span-1 text-center">Rating</div>
        </div>
        
        <div className="divide-y divide-arcade-blue/10">
          {sortedPlayers.slice(0, 10).map((player, index) => {
            const winPercentage = player.wins + player.losses > 0 
              ? Math.round((player.wins / (player.wins + player.losses)) * 100) 
              : 0;
              
            return (
              <Link 
                to="/players" 
                key={player.id}
                className={cn(
                  "grid grid-cols-8 gap-4 p-3 hover:bg-arcade-blue/5 transition-colors",
                  index === 0 ? "bg-yellow-500/10" : 
                  index === 1 ? "bg-slate-400/5" : 
                  index === 2 ? "bg-amber-700/10" : ""
                )}
              >
                <div className="col-span-1 flex justify-center items-center">
                  {index === 0 ? (
                    <Medal className="w-5 h-5 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="w-5 h-5 text-slate-400" />
                  ) : index === 2 ? (
                    <Medal className="w-5 h-5 text-amber-700" />
                  ) : (
                    <span className="text-white/40 font-pixel text-center">{index + 1}</span>
                  )}
                </div>
                
                <div className="col-span-3 md:col-span-2 flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black/30">
                    <img 
                      src={player.avatar} 
                      alt={player.name} 
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-base text-white font-pixel truncate">
                    {player.name}
                  </span>
                </div>
                
                <div className="col-span-1 text-center hidden md:flex items-center justify-center font-pixel text-green-400">
                  {player.wins}
                </div>
                
                <div className="col-span-1 text-center hidden md:flex items-center justify-center font-pixel text-red-400">
                  {player.losses}
                </div>
                
                <div className="col-span-1 text-center flex items-center justify-center font-pixel">
                  <span className="text-green-400">{player.wins}</span>
                  <span className="text-white/50 mx-1">/</span>
                  <span className="text-red-400">{player.losses}</span>
                </div>
                
                <div className="col-span-2 md:col-span-1 text-center flex items-center justify-center">
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-arcade-blue rounded-full"
                      style={{ width: `${winPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-white/70 font-pixel text-sm">
                    {winPercentage}%
                  </span>
                </div>
                
                <div className="col-span-1 text-center flex items-center justify-center gap-1 font-pixel text-arcade-blue">
                  <TrendingUp className="w-3 h-3" />
                  <span>{player.rating}</span>
                </div>
              </Link>
            );
          })}
          
          {sortedPlayers.length === 0 && (
            <div className="p-8 text-center text-white/60 font-pixel">
              <Zap className="w-8 h-8 mx-auto mb-2 text-arcade-blue/50" />
              <p>No player data yet. Start playing matches!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
