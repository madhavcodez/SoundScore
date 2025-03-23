import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';

function Navbar({ userProfile }) {
  const soundscoreUsername = localStorage.getItem('soundscore_username');
  
  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('soundscore_username');
    localStorage.removeItem('spotify_display_name');
    window.location.href = '/';
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#141414]/90 backdrop-blur-md z-50 border-b border-[#2C382E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-extrabold text-[#8BA888]">
              SoundScore
            </Link>
            <nav className="ml-10 flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/friends" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Friends
              </Link>
              <Link to="/top-albums" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Top Albums
              </Link>
            </nav>
          </div>
          
          {userProfile && (
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={userProfile.images?.[0]?.url || '/default-avatar.png'}
                  alt={soundscoreUsername || userProfile.display_name}
                  className="w-8 h-8 rounded-full border border-[#8BA888]"
                />
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{soundscoreUsername}</span>
                  <span className="text-gray-400 text-sm">{userProfile.display_name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar; 