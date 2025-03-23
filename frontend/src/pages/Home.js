import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const handleSpotifyLogin = () => {
    console.log('Attempting to login with Spotify...');
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/spotify/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2C382E] to-[#1a1a1a] flex items-center justify-center">
      <div className="w-full max-w-6xl px-4 text-center">
        {/* Hero Section */}
        <div className="mb-16 space-y-6">
          <h1 className="text-7xl font-bold text-[#8BA888] tracking-tight">
            Your Music Journey,
            <span className="block text-white mt-2">Rated & Shared</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join a community of music enthusiasts. Rate albums, discover new artists, and share your musical taste with friends.
          </p>
          
          {/* Centered CTA Button */}
          <div className="mt-12">
            <button
              onClick={handleSpotifyLogin}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#8BA888] to-[#A4C3A2] 
                       rounded-full font-bold text-white shadow-lg shadow-[#A4C3A2]/30 
                       hover:shadow-[#A4C3A2]/50 transform hover:-translate-y-1 
                       transition-all duration-500"
            >
              <span className="relative z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <svg className="w-6 h-6 mr-2 transform group-hover:rotate-12 transition-transform duration-500" 
                     fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Continue with Spotify
              </span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Rate Your Collection */}
          <div className="bg-[#2C382E]/50 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform duration-300
                       border border-[#8BA888]/10 hover:border-[#8BA888]/20">
            <div className="w-12 h-12 rounded-full bg-[#8BA888]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#8BA888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#8BA888] mb-2">Rate Your Collection</h3>
            <p className="text-gray-400">Build your musical profile by rating albums and sharing your thoughts.</p>
          </div>

          {/* Connect with Friends */}
          <div className="bg-[#2C382E]/50 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform duration-300
                       border border-[#8BA888]/10 hover:border-[#8BA888]/20">
            <div className="w-12 h-12 rounded-full bg-[#8BA888]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#8BA888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#8BA888] mb-2">Connect with Friends</h3>
            <p className="text-gray-400">Share recommendations and discover music through your network.</p>
          </div>

          {/* Get Personalized Picks */}
          <div className="bg-[#2C382E]/50 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform duration-300
                       border border-[#8BA888]/10 hover:border-[#8BA888]/20">
            <div className="w-12 h-12 rounded-full bg-[#8BA888]/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#8BA888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#8BA888] mb-2">Get Personalized Picks</h3>
            <p className="text-gray-400">Receive tailored recommendations based on your taste.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
