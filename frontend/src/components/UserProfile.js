import React from 'react';
import { Link } from 'react-router-dom';

function UserProfile({ userProfile, onLogout }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <img
          src={userProfile?.profileImage || '/default-avatar.png'}
          alt={userProfile?.displayName}
          className="w-8 h-8 rounded-full border border-[#8BA888]/20"
        />
        <span className="text-white">{userProfile?.displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-xl border border-[#2C382E] py-1">
          <div className="px-4 py-2 border-b border-[#2C382E]">
            <p className="text-sm text-white font-medium">{userProfile?.displayName}</p>
            <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
          </div>

          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2C382E] hover:text-white"
          >
            Your Profile
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2C382E] hover:text-white"
          >
            Settings
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2C382E] hover:text-red-300"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile; 