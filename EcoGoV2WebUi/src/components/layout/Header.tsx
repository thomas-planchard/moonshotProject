import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, BarChart, Briefcase, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [profileName, setProfileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      setProfileName(null);
      return;
    }
    const fetchName = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      setProfileName(snap.exists() ? snap.data().name : null);
    };
    fetchName();
  }, [user]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Trips', path: '/trips', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Account', path: '/account', icon: <User className="w-5 h-5" /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-semibold text-gray-900">EcoGo Corporate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
              }`}
            >
              {React.cloneElement(item.icon, {
                className: `w-5 h-5 ${location.pathname === item.path ? 'text-primary-500' : ''}`,
              })}
              <span>{item.name}</span>
            </Link>
          ))}
          {profileName && (
            <span className="ml-6 font-medium text-primary-700">{profileName}</span>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-primary-500 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t py-2 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 ${
                location.pathname === item.path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {React.cloneElement(item.icon, {
                className: `w-5 h-5 ${location.pathname === item.path ? 'text-primary-500' : ''}`,
              })}
              <span>{item.name}</span>
            </Link>
          ))}
          {profileName && (
            <div className="px-4 py-2 text-primary-700 font-medium">{profileName}</div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;