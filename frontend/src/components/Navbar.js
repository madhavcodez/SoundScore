import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ userProfile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    const token = localStorage.getItem('spotify_token');
    const userId = localStorage.getItem('user_id');
    
    if (path === '/dashboard') {
      navigate(`/dashboard?access_token=${token}&userId=${userId}`);
    } else {
      navigate(path);
    }
  };

  // Get the profile image URL from the correct path in userProfile
  const profileImageUrl = userProfile?.spotifyProfile?.images?.[0]?.url || 
                         userProfile?.images?.[0]?.url || 
                         'https://via.placeholder.com/32';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#1C2820]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1C2820] font-bold text-lg">SS</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">SoundScore</span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('/dashboard')}
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#8BA888] cursor-default' : 'text-white hover:text-[#8BA888]'
              }`}
            >
              Home
            </button>
            <Link 
              to="/profile" 
              className={`text-sm font-medium transition-colors ${
                isActive('/profile') ? 'text-[#8BA888] cursor-default' : 'text-white hover:text-[#8BA888]'
              }`}
            >
              Profile
            </Link>
            <Link 
              to="/search" 
              className={`text-sm font-medium transition-colors ${
                isActive('/search') ? 'text-[#8BA888] cursor-default' : 'text-white hover:text-[#8BA888]'
              }`}
            >
              Search
            </Link>
            <Link 
              to="/friends" 
              className={`text-sm font-medium transition-colors ${
                isActive('/friends') ? 'text-[#8BA888] cursor-default' : 'text-white hover:text-[#8BA888]'
              }`}
            >
              Friends
            </Link>
          </div>

          {/* Profile Section */}
          {userProfile && (
            <button 
              onClick={() => handleNavigation('/profile')}
              className="flex items-center space-x-3 group ml-4"
            >
              <div className="relative">
                <img 
                  src={profileImageUrl}
                  alt="madhatter" 
                  className="w-8 h-8 rounded-full border-2 border-[#8BA888] group-hover:border-white transition-colors"
                />
                <div className="absolute inset-0 rounded-full bg-[#8BA888]/20 group-hover:bg-[#8BA888]/30 transition-colors"></div>
              </div>
              <span className="text-white text-sm font-medium group-hover:text-[#8BA888] transition-colors">
                madhatter
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 