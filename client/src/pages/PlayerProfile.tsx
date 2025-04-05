import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Trophy, ArrowLeft, User, Star, Activity, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Match } from '@/services/api';

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getPlayer, matches } = useApp();
  const player = getPlayer(id || '');
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState({
    winRate: 0,
    averageScore: 0,
    highestScore: 0,
    longestStreak: 0
  });

  useEffect(() => {
    if (!player) return;

    // Get matches for this player
    const playerMatches = matches.filter(
      m => m.player1._id === player._id || m.player2._id === player._id
    ).sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
    
    // Take only the 5 most recent matches
    setRecentMatches(playerMatches.slice(0, 5));
    
    // Calculate stats
    if (playerMatches.length > 0) {
      // Win rate
      const winRate = player.wins / (player.wins + player.losses) * 100;
      
      // Average & highest score
      let totalScore = 0;
      let highestScore = 0;
      
      playerMatches.forEach(match => {
        const playerScore = match.player1._id === player._id ? match.player1Score : match.player2Score;
        totalScore += playerScore;
        if (playerScore > highestScore) highestScore = playerScore;
      });
      
      const averageScore = totalScore / playerMatches.length;
      
      // Calculate longest win streak
      let currentStreak = 0;
      let longestStreak = 0;
      const completedMatches = playerMatches
        .filter(m => m.status === 'completed')
        .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
      
      completedMatches.forEach(match => {
        const isWinner = (match.player1._id === player._id && match.player1Score > match.player2Score) ||
                        (match.player2._id === player._id && match.player2Score > match.player1Score);
        if (isWinner) {
          currentStreak++;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });
      
      setStats({
        winRate: Math.round(winRate),
        averageScore: Math.round(averageScore * 10) / 10,
        highestScore,
        longestStreak
      });
    }
  }, [player, matches]);

  if (!player) {
    return (
      <div className="arcade-container py-12 text-center">
        <h2 className="text-xl text-white mb-4">Giocatore non trovato</h2>
        <Link to="/players" className="arcade-button inline-flex">
          <ArrowLeft className="w-4 h-4" />
          <span>Torna ai Giocatori</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="arcade-container py-8 animate-fade-in">
      <div className="mb-8">
        <Link to="/players" className="text-white/70 hover:text-white flex items-center gap-2 font-pixel transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Torna ai Giocatori</span>
        </Link>
        
        <div className="arcade-card p-8">
          <div className="md:flex items-center gap-8">
            <div className="pixel-box md:w-48 w-full mx-auto md:mx-0 aspect-square mb-8 md:mb-0 flex-shrink-0">
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.name}`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-arcade-darker">
                  <User className="w-12 h-12 text-white/50" />
                </div>
              )}
            </div>
            
            <div className="grow">
              <h1 className="text-4xl text-white font-arcade mb-4 glow-text">{player.name}</h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-arcade-darker p-3 rounded-lg mb-2">
                    <Trophy className="w-6 h-6 mx-auto text-arcade-gold" />
                  </div>
                  <div className="text-xl font-bold text-white">{player.wins}</div>
                  <div className="text-white/60 text-sm">Vittorie</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-arcade-darker p-3 rounded-lg mb-2">
                    <Activity className="w-6 h-6 mx-auto text-arcade-red" />
                  </div>
                  <div className="text-xl font-bold text-white">{player.losses}</div>
                  <div className="text-white/60 text-sm">Sconfitte</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-arcade-darker p-3 rounded-lg mb-2">
                    <Star className="w-6 h-6 mx-auto text-arcade-yellow" />
                  </div>
                  <div className="text-xl font-bold text-white">{player.pointsScored}</div>
                  <div className="text-white/60 text-sm">Punti</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-arcade-darker p-3 rounded-lg mb-2">
                    <Award className="w-6 h-6 mx-auto text-arcade-purple" />
                  </div>
                  <div className="text-xl font-bold text-white">{player.rating}</div>
                  <div className="text-white/60 text-sm">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-arcade text-white mb-4">Statistiche Giocatore</h2>
        <div className="arcade-card p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-arcade-darker p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-arcade-green">{stats.winRate}%</div>
              <div className="text-white/60 text-sm">% Vittorie</div>
            </div>
            
            <div className="bg-arcade-darker p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-arcade-blue">{stats.averageScore}</div>
              <div className="text-white/60 text-sm">Media Punti</div>
            </div>
            
            <div className="bg-arcade-darker p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-arcade-yellow">{stats.highestScore}</div>
              <div className="text-white/60 text-sm">Punteggio Max</div>
            </div>
            
            <div className="bg-arcade-darker p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-arcade-purple">{stats.longestStreak}</div>
              <div className="text-white/60 text-sm">Serie Vittorie</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Matches */}
      <div>
        <h2 className="text-2xl font-arcade text-white mb-4">Partite Recenti</h2>
        {recentMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentMatches.map(match => {
              const isPlayer1 = match.player1._id === player._id;
              const opponent = isPlayer1 ? match.player2 : match.player1;
              const playerScore = isPlayer1 ? match.player1Score : match.player2Score;
              const opponentScore = isPlayer1 ? match.player2Score : match.player1Score;
              const playerWon = isPlayer1 ? match.player1Score > match.player2Score : match.player2Score > match.player1Score;
              
              return (
                <div 
                  key={match._id} 
                  className={cn(
                    "arcade-card p-4 border-l-4",
                    match.status === 'completed' 
                      ? playerWon 
                        ? "border-arcade-green" 
                        : "border-arcade-red"
                      : "border-arcade-blue"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="pixel-box w-12 h-12 flex-shrink-0 bg-arcade-darker">
                        {opponent.avatarUrl ? (
                          <img 
                          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(opponent.name)}&backgroundColor=0ea5e9`} 
                            alt={opponent.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${opponent.name}`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white/50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-pixel text-white">{opponent.name}</div>
                        <div className="text-sm text-white/60">
                          {new Date(match.playedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="font-arcade text-xl text-white">
                      <span className={playerWon ? "text-arcade-green" : "text-white"}>{playerScore}</span>
                      <span className="mx-2">-</span>
                      <span className={!playerWon ? "text-arcade-red" : "text-white"}>{opponentScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="arcade-card text-center py-6">
            <p className="text-white/60 font-pixel text-sm">Nessuna partita recente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
