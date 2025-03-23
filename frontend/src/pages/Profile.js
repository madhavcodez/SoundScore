import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Section from '../components/Section';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('access_token');
      const userId = urlParams.get('userId');

      if (!token || !userId) {
        window.location.href = '/';
        return;
      }

      try {
        const [userResponse, ratingsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}/ratings`)
        ]);

        setUserProfile(userResponse.data);
        setUserRatings(ratingsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      <Navbar userProfile={userProfile} />
      
      <div className="pt-20 px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <img
            src={userProfile?.images?.[0]?.url || '/default-avatar.png'}
            alt={userProfile?.display_name}
            className="w-24 h-24 rounded-full border-2 border-[#8BA888]"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{userProfile?.display_name}</h1>
            <p className="text-gray-400">Member since {new Date(userProfile?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Recent Ratings</h2>
            <Section albums={userRatings.slice(0, 10)} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Stats</h2>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Total Ratings</p>
                  <p className="text-2xl font-bold text-white">{userRatings.length}</p>
                </div>
                <div>
                  <p className="text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {(userRatings.reduce((acc, curr) => acc + curr.rating, 0) / userRatings.length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 