import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CompleteSignup from './pages/CompleteSignup';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Friends from './pages/Friends';
import AlbumDetails from './pages/AlbumDetails';
import Lists from './pages/Lists';
import CreateList from './pages/CreateList';
import EditList from './pages/EditList';
import ViewList from './pages/ViewList';
import { Toaster } from 'react-hot-toast';

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First try to get from URL (for initial login)
        const urlToken = new URLSearchParams(window.location.search).get('access_token');
        const urlUserId = new URLSearchParams(window.location.search).get('userId');

        // Then try to get from localStorage
        const storedToken = localStorage.getItem('spotify_token');
        const storedUserId = localStorage.getItem('user_id');

        // Use URL params if available, otherwise use stored values
        const token = urlToken || storedToken;
        const userId = urlUserId || storedUserId;

        if (!token || !userId) {
          setIsLoading(false);
          return;
        }

        // If we got new values from URL, store them
        if (urlToken && urlUserId) {
          localStorage.setItem('spotify_token', urlToken);
          localStorage.setItem('user_id', urlUserId);
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Clear stored values if there's an error
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('user_id');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA888]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2C382E',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#8BA888',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4b4b',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              userProfile ? (
                <Dashboard userProfile={userProfile} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/complete-signup" element={<CompleteSignup />} />
          <Route 
            path="/profile" 
            element={
              userProfile ? (
                <Navigate to={`/profile/${userProfile._id}`} replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              userProfile ? (
                <Profile userProfile={userProfile} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/search" 
            element={
              userProfile ? (
                <Search userProfile={userProfile} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/friends" 
            element={
              userProfile ? (
                <Friends userProfile={userProfile} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/album/:id" element={<AlbumDetails />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/lists/new" element={<CreateList />} />
          <Route path="/lists/:id" element={<ViewList />} />
          <Route path="/lists/:id/edit" element={<EditList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
