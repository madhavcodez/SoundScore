import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SignupModal from '../components/SignupModal';

function CompleteSignup() {
  const [spotifyData, setSpotifyData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spotifyDataParam = params.get('spotify_data');
    const accessToken = params.get('access_token');

    if (!spotifyDataParam || !accessToken) {
      navigate('/');
      return;
    }

    try {
      const parsedData = JSON.parse(decodeURIComponent(spotifyDataParam));
      setSpotifyData(parsedData);
      localStorage.setItem('spotify_token', accessToken);
    } catch (error) {
      console.error('Error parsing Spotify data:', error);
      navigate('/');
    }
  }, [navigate, location]);

  const handleSignupComplete = (userId) => {
    console.log('Signup complete, navigating to dashboard...'); // Debug log
    const accessToken = localStorage.getItem('spotify_token');
    if (!accessToken || !userId) {
      console.error('Missing access token or userId'); // Debug log
      navigate('/');
      return;
    }
    navigate(`/dashboard?access_token=${accessToken}&userId=${userId}`);
  };

  if (!spotifyData) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <SignupModal spotifyData={spotifyData} onComplete={handleSignupComplete} />;
}

export default CompleteSignup; 