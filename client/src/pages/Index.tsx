import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Leaderboard from '@/components/Leaderboard';
import MatchItem from '@/components/MatchItem';
import { Link } from 'react-router-dom';
import { CircleDot, Calendar, ArrowRight, Trophy, Users } from 'lucide-react';

const Index = () => {
  const { matches } = useApp();
  const [showIntro, setShowIntro] = useState(true);
  
  // Active and recent matches
  const activeMatches = matches.filter(match => match.status === 'in-progress');
  const recentMatches = matches
    .filter(match => match.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Hide intro after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="arcade-container py-8">
      {/* Intro animation */}
      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-center">
            <div className="inline-block animate-pulse-glow rounded-xl mb-4">
              <CircleDot className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-arcade text-white">
              HBS <span className="text-primary glow-text animate-blink">BBB</span> <span className="text-white glow-text animate-blink">PONG</span>
            </h1>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-arcade text-white">
              <span className="text-primary glow-text">HBS</span> Ping Pong
            </h1>
            
            <Link 
              to="/create-match"
              className="arcade-button"
            >
              <CircleDot className="w-4 h-4" />
              <span>New Match</span>
            </Link>
          </div> */}
          
          {/* Active Matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-arcade text-white">Active Matches</h2>
              </div>
              
              <Link to="/matches" className="text-primary font-pixel flex items-center gap-1 neon-underline">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {activeMatches.length > 0 ? (
                activeMatches.map(match => (
                  <MatchItem 
                    key={match.id} 
                    match={match} 
                    showActions={true}
                    onClick={() => {}}
                  />
                ))
              ) : (
                <div className="arcade-card text-center py-8">
                  <p className="text-white/60 font-pixel mb-4">No active matches right now</p>
                  <Link to="/create-match" className="arcade-button inline-flex">
                    <CircleDot className="w-4 h-4" />
                    <span>Start a Match</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Matches */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-arcade text-white">Recent Matches</h2>
              </div>
              
              <Link to="/matches" className="text-primary font-pixel flex items-center gap-1 neon-underline">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {recentMatches.length > 0 ? (
                recentMatches.map(match => (
                  <MatchItem 
                    key={match.id} 
                    match={match}
                    onClick={() => {}}
                  />
                ))
              ) : (
                <div className="arcade-card text-center py-8">
                  <p className="text-white/60 font-pixel">No completed matches yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <Leaderboard />
          
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mt-8">
            <Link to="/players" className="arcade-card bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20 flex items-center gap-4 hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/30">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-pixel text-white">Players</h3>
                <p className="text-white/60 text-sm font-pixel">View all players</p>
              </div>
            </Link>
            
            <Link to="/matches" className="arcade-card bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20 flex items-center gap-4 hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/30">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-pixel text-white">Matches</h3>
                <p className="text-white/60 text-sm font-pixel">Match history</p>
              </div>
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
