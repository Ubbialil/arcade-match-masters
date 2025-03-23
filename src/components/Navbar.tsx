
import { Link, useLocation } from 'react-router-dom';
import { Gamepad, Users, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full backdrop-blur-md border-b border-arcade-blue/20 sticky top-0 z-50">
      <div className="arcade-container">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-arcade-blue to-arcade-purple animate-pulse-glow">
              <Gamepad className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl md:text-2xl font-arcade text-white">
              HBS <span className="text-arcade-blue glow-text">PING</span> <span className="text-arcade-pink glow-text">PONG</span>
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
                        ? "bg-arcade-blue/20 text-arcade-blue neon-underline primary-glow" 
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
                  <Gamepad className="w-4 h-4" />
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
                { path: '/create-match', label: 'New Match', icon: <Gamepad /> },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-md transition-all duration-300",
                      isActive(item.path) 
                        ? "bg-arcade-blue/20 text-arcade-blue primary-glow" 
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
