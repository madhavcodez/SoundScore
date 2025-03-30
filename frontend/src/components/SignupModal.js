import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function SignupModal({ spotifyData, onComplete }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already exists when component mounts
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
          username: spotifyData.display_name.toLowerCase().replace(/\s+/g, ''),
          spotifyId: spotifyData.id,
          email: spotifyData.email,
          displayName: spotifyData.display_name
        });

        if (response.data.success) {
          if (response.data.existing) {
            // User exists, log them in automatically
            localStorage.setItem('soundscore_username', response.data.username);
            localStorage.setItem('spotify_display_name', spotifyData.display_name);
            localStorage.setItem('user_id', response.data.userId);
            onComplete(response.data.userId);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
      }
    };

    if (spotifyData?.id) {
      checkExistingUser();
    }
  }, [spotifyData, onComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !spotifyData?.id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to create account...', {
        username,
        spotifyId: spotifyData.id,
        email: spotifyData.email,
        displayName: spotifyData.display_name
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        username,
        spotifyId: spotifyData.id,
        email: spotifyData.email,
        displayName: spotifyData.display_name
      });

      console.log('Signup response:', response.data);

      if (response.data.success) {
        if (response.data.existing) {
          toast.success('Welcome back! Logging you in...');
        } else {
          toast.success('Account created successfully!');
        }
        
        localStorage.setItem('soundscore_username', response.data.username);
        localStorage.setItem('spotify_display_name', spotifyData.display_name);
        localStorage.setItem('user_id', response.data.userId);
        onComplete(response.data.userId);
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      if (error.response?.data?.error === 'username_taken') {
        toast.error('This username is already taken. Please choose a different one.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If we're checking for existing user, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C382E] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Checking your account...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C382E] to-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#8BA888] tracking-tight mb-4">
            Welcome to
            <span className="block text-white mt-2">SoundScore</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Create your account to start rating and discovering music
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                      backdrop-blur-sm border border-[#8BA888]/20">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute w-96 h-96 bg-[#8BA888]/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-[#8BA888]/5 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
          </div>

          {/* Form Content */}
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#8BA888] mb-2 text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-[#2C382E] 
                           focus:outline-none focus:ring-2 focus:ring-[#8BA888] focus:border-transparent
                           transition-all duration-200"
                  placeholder="Choose a unique username"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8BA888] to-[#6A8A67] text-white py-4 rounded-lg 
                         font-semibold text-lg hover:from-[#7A9877] hover:to-[#5A7A57] 
                         transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                         focus:outline-none focus:ring-2 focus:ring-[#8BA888] focus:ring-offset-2 
                         focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Connected Account Info */}
            <div className="mt-6 pt-6 border-t border-[#2C382E]">
              <p className="text-gray-400 text-sm text-center">
                Connected Spotify Account:
                <span className="block text-white font-medium mt-1">
                  {spotifyData.display_name} ({spotifyData.email})
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupModal; 