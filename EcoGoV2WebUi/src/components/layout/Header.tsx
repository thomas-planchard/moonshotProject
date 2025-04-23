import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, BarChart, Briefcase, Settings, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Trips', path: '/trips', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
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
        </nav>
      )}
    </header>
  );
};

export default Header;