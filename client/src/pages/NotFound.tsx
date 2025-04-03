
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="arcade-card max-w-md w-full text-center p-8 animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-arcade-red/20">
          <AlertTriangle className="w-10 h-10 text-arcade-red" />
        </div>
        
        <h1 className="text-4xl font-arcade text-white mb-4 glow-text">404</h1>
        <p className="text-xl text-white/70 font-pixel mb-6">Game Over! Page not found</p>
        
        <Link to="/" className="arcade-button inline-flex">
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
