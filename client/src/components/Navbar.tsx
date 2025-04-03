import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Trophy, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
      <div className="arcade-container">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/80 animate-pulse-glow">
              <CircleDot className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl md:text-2xl font-arcade text-white">
              HBS <span className="text-primary glow-text">PING</span> <span className="text-white glow-text">PONG</span>
            </span>
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex items-center gap-1">
              {[
                { path: '/', label: 'Leaderboard', icon: <Trophy /> },
                { path: '/players', label: 'Players', icon: <Users /> },
                { path: '/matches', label: 'Matches', icon: <Calendar /> },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300",
                      isActive(item.path) 
                        ? "bg-primary/20 text-primary neon-underline primary-glow" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.icon}
                    <span className="font-pixel">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/create-match"
                  className="arcade-button ml-2"
                >
                  <CircleDot className="w-4 h-4" />
                  <span>New Match</span>
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="md:hidden">
            <ul className="flex items-center gap-1">
              {[
                { path: '/', label: 'Leaderboard', icon: <Trophy /> },
                { path: '/players', label: 'Players', icon: <Users /> },
                { path: '/matches', label: 'Matches', icon: <Calendar /> },
                { path: '/create-match', label: 'New Match', icon: <CircleDot /> },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300",
                      isActive(item.path) 
                        ? "bg-primary/20 text-primary primary-glow" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
