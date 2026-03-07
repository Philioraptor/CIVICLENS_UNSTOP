import { Link } from 'react-router-dom';
import { Map, LayoutDashboard, MessageSquarePlus, LogIn } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Map className="w-8 h-8 text-civic-blue" />
            <span className="font-bold text-xl text-civic-dark tracking-tight">CivicLens</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/map" className="flex items-center space-x-1 text-gray-600 hover:text-civic-blue transition-colors">
              <Map className="w-4 h-4" />
              <span>Map</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-civic-blue transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/feedback" className="flex items-center space-x-1 text-gray-600 hover:text-civic-blue transition-colors">
              <MessageSquarePlus className="w-4 h-4" />
              <span>Feedback</span>
            </Link>
            <Link to="/login" className="btn-primary flex items-center space-x-2">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
