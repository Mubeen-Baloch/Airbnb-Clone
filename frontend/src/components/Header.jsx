import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle scroll effect for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-glass-lg' 
          : 'bg-transparent'
      }`}
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md -z-10"></div>
      
      <div className="container-responsive">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo with animations */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow-lg transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                {/* Floating particles around logo */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-bounce-gentle opacity-60"></div>
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce-gentle opacity-60" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-300 rounded-full animate-bounce-gentle opacity-60" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
            </div>
            
            <span className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
              StayEase
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link text-lg ${
                isActiveRoute('/') 
                  ? 'text-rose-600 font-semibold' 
                  : 'text-gray-700 hover:text-rose-600'
              } transition-all duration-300 relative group`}
            >
              <span className="relative z-10">Explore</span>
              {isActiveRoute('/') && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-scale-in"></div>
              )}
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/create-listing" 
                  className="relative group overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Listing
                  </span>
                  
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
                
                <Link 
                  to="/my-listings" 
                  className={`nav-link text-lg ${
                    isActiveRoute('/my-listings') 
                      ? 'text-rose-600 font-semibold' 
                      : 'text-gray-700 hover:text-rose-600'
                  } transition-all duration-300`}
                >
                  My Listings
                </Link>
                
                <Link 
                  to="/wishlist" 
                  className={`nav-link text-lg ${
                    isActiveRoute('/wishlist') 
                      ? 'text-rose-600 font-semibold' 
                      : 'text-gray-700 hover:text-rose-600'
                  } transition-all duration-300`}
                >
                  Wishlist
                </Link>
              </>
            )}
          </nav>

          {/* Enhanced User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-110">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    {/* Online status indicator */}
                    <div className="absolute -bottom-1 -right-1 status-online"></div>
                  </div>
                  
                  <span className="hidden sm:block text-gray-700 font-medium group-hover:text-rose-600 transition-colors duration-300">
                    {user.name}
                  </span>
                  
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isMenuOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu with glassmorphism */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-glass-lg border border-white/30 py-3 z-50 animate-fade-in-up">
                    {/* Menu header */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="nav-link text-lg font-medium hover:text-rose-600 transition-all duration-300"
                >
                  Sign In
                </Link>
                
                <Link 
                  to="/register" 
                  className="relative group overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10">Get Started</span>
                  
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/20 animate-fade-in-down">
          <div className="container-responsive py-6 space-y-4">
            <Link 
              to="/" 
              className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/create-listing" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Listing
                </Link>
                
                <Link 
                  to="/my-listings" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Listings
                </Link>
                
                <Link 
                  to="/wishlist" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                
                <Link 
                  to="/profile" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            )}
            
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                
                <Link 
                  to="/register" 
                  className="block text-lg font-medium text-gray-700 hover:text-rose-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 