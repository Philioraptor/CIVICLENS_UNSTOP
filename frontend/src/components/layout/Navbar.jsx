import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LayoutDashboard, MessageCircle, Bell, UserCircle, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef(null);

  // Poll notifications if logged in
  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get(`/api/notifications?userId=${user.id}`);
        setNotifications(data.slice(0, 5));
        setUnread(data.filter(n => !n.read).length);
      } catch { }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="w-7 h-7 text-civic-blue fill-civic-blue" />
          <span className="font-bold text-xl text-civic-dark tracking-tight">CivicLens</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center font-medium">
          <Link to="/map" className="nav-link flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Map
          </Link>
          <Link to="/dashboard" className="nav-link flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/feedback" className="nav-link flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Feedback
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link flex items-center gap-1.5 text-purple-600">
              <Settings className="w-4 h-4" /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(o => !o)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unread > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Notifications</div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500 text-center">No notifications yet</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className={`p-3 border-b border-gray-50 text-sm ${!n.read ? 'bg-blue-50' : ''}`}>
                          <p className="font-medium text-gray-800">{n.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User pill */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <UserCircle className="w-4 h-4 text-civic-blue" />
                <span className="text-sm font-medium text-civic-blue">{user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary flex items-center gap-2 text-sm">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-3 z-40">
          <Link to="/map" onClick={() => setMenuOpen(false)} className="nav-link py-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Map
          </Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="nav-link py-2 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/feedback" onClick={() => setMenuOpen(false)} className="nav-link py-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Feedback
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="nav-link py-2 flex items-center gap-2 text-purple-600">
              <Settings className="w-4 h-4" /> Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-100 pt-3 mt-1">
            {user ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Logged in as <strong>{user.name}</strong></p>
                <button onClick={handleLogout} className="text-red-500 font-medium text-sm flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-2 block text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
