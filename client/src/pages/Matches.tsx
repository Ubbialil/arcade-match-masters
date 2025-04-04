import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import MatchItem from '@/components/MatchItem';
import ScoreTracker from '@/components/ScoreTracker';
import { Plus, Calendar, AlignLeft, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Matches = () => {
  const { matches } = useApp();
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  // const [filterStatus, setFilterStatus] = useState<string>('all');
  // const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort matches
  const filteredMatches = matches
    // .filter(match => {
    //   if (filterStatus === 'all') return true;
    //   return match.status === filterStatus;
    // })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
    });
  
  const activeMatch = matches.find(m => m._id === activeMatchId);
  
  const handleMatchClick = (matchId: string) => {
    // const match = matches.find(m => m._id === matchId);
    // if (match && match.status === 'in-progress') {
      setActiveMatchId(matchId);
    // }
  };

  return (
    <div className="arcade-container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-arcade text-white flex items-center">
          <Calendar className="w-8 h-8 mr-2 text-primary" />
          <span>Matches</span>
        </h1>
      </div>
      
      {/* Current Match Tracker */}
      {activeMatchId && activeMatch && (
        <div className="mb-8 animate-scale-in">
          <ScoreTracker 
            matchId={activeMatchId}
            onFinish={() => setActiveMatchId(null)}
          />
        </div>
      )}
      
      {/* Filters - Temporarily disabled
      <div className="mb-6">
        <button
          className="flex items-center gap-2 text-white font-pixel mb-4 bg-white/5 px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            showFilters ? "transform rotate-180" : ""
          )} />
        </button>
        
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 animate-slide-in-top">
            {[
              { value: 'all', label: 'All Matches' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map(option => (
              <button
                key={option.value}
                className={cn(
                  "px-4 py-2 rounded-md font-pixel text-sm transition-colors",
                  filterStatus === option.value 
                    ? "bg-arcade-blue text-white" 
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
                onClick={() => setFilterStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      */}
      
      {/* Matches List */}
      <div className="grid grid-cols-1 gap-4 animate-slide-in-bottom">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchItem 
              key={match._id} 
              match={match}
              showActions={false}
              onClick={() => handleMatchClick(match._id)}
            />
          ))
        ) : (
          <div className="arcade-card text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-arcade-blue/30" />
            <p className="text-white/60 font-pixel text-lg mb-6">No matches found</p>
            <Link to="/create-match" className="arcade-button inline-flex">
              <Plus className="w-4 h-4" />
              <span>Create Match</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
