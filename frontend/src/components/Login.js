import React from 'react';

function Login() {
  const handleLogin = () => {
    console.log('Attempting to login with Spotify...');
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/spotify/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex justify-center items-center">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                    backdrop-blur-sm border border-[#A4C3A2]/20 max-w-md w-full">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#A4C3A2]/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#A4C3A2]">Connect with Spotify</h2>
          <button
            onClick={handleLogin}
            className="group relative w-full px-6 py-4 bg-gradient-to-r from-[#8BA888] to-[#A4C3A2] 
                     rounded-full font-bold text-white shadow-lg shadow-[#A4C3A2]/30 
                     hover:shadow-[#A4C3A2]/50 transform hover:-translate-y-0.5 
                     transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Continue with Spotify
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login; 