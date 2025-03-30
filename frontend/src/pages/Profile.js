import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Section from '../components/Section';
import Navbar from '../components/Navbar';
import AlbumSearchModal from '../components/AlbumSearchModal';
import ReviewModal from '../components/ReviewModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedAlbumSlot, setSelectedAlbumSlot] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [topAlbums, setTopAlbums] = useState([]);
  const isOwnProfile = userId === new URLSearchParams(window.location.search).get('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from our backend
        const userDataResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
        
        // Get all ratings for this user
        const ratingsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/ratings/user/${userId}`);
        
        // Get album details for each rating
        const ratingsWithAlbums = await Promise.all(
          ratingsResponse.data.ratings.map(async (rating) => {
            try {
              const token = localStorage.getItem('spotify_token');
              if (!token) {
                throw new Error('No Spotify token found');
              }

              const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${rating.albumId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              return {
                ...rating,
                albumImageUrl: albumResponse.data.images[0]?.url || 'https://via.placeholder.com/150',
                albumName: albumResponse.data.name,
                artistName: albumResponse.data.artists[0]?.name,
                id: rating.albumId
              };
            } catch (error) {
              console.error('Error fetching album details:', error);
              return {
                ...rating,
                albumImageUrl: 'https://via.placeholder.com/150',
                albumName: 'Unknown Album',
                artistName: 'Unknown Artist',
                id: rating.albumId
              };
            }
          })
        );
        
        setUserProfile(userDataResponse.data);
        setUserRatings(ratingsWithAlbums);
        
        // Initialize top albums from user profile
        const topAlbumsWithDetails = await Promise.all(
          (userDataResponse.data.topAlbums || []).map(async (topAlbum) => {
            try {
              const token = localStorage.getItem('spotify_token');
              const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${topAlbum.albumId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              return {
                ...topAlbum,
                albumImageUrl: albumResponse.data.images[0]?.url || 'https://via.placeholder.com/150',
                albumName: albumResponse.data.name,
                artistName: albumResponse.data.artists[0]?.name
              };
            } catch (error) {
              console.error('Error fetching album details:', error);
              return null;
            }
          })
        );
        
        setTopAlbums(topAlbumsWithDetails.filter(Boolean));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleAddAlbum = (slotIndex) => {
    setSelectedAlbumSlot(slotIndex);
    setShowSearchModal(true);
  };

  const handleAlbumSelected = async (album) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/${userId}/top-albums`, {
        albumId: album.id,
        position: selectedAlbumSlot
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state
      const newTopAlbums = [...topAlbums];
      newTopAlbums[selectedAlbumSlot] = {
        albumId: album.id,
        position: selectedAlbumSlot,
        albumImageUrl: album.images[0]?.url,
        albumName: album.name,
        artistName: album.artists[0].name
      };
      setTopAlbums(newTopAlbums);
      
      setShowSearchModal(false);
      setSelectedAlbumSlot(null);
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(topAlbums);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setTopAlbums(updatedItems);

    try {
      const token = localStorage.getItem('spotify_token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/top-albums`, {
        topAlbums: updatedItems
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating album positions:', error);
    }
  };

  const handleRatingSubmit = async (albumId, rating, review) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId,
        rating,
        review,
        userId,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh user data
      const userDataResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
      setUserProfile(userDataResponse.data);
      setUserRatings(userDataResponse.data.ratings);
      
      setSelectedReview(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="animate-pulse">
          <div className="h-64 bg-[#2C382E]"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-32 w-32 rounded-full bg-[#2C382E] mb-4"></div>
            <div className="h-8 w-48 bg-[#2C382E] mb-4"></div>
            <div className="h-4 w-32 bg-[#2C382E]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get recent ratings (sorted by timestamp)
  const recentRatings = [...userRatings]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      {/* Global Ambient Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      <Navbar userProfile={userProfile} />
      
      {/* Profile Header */}
      <div className="relative pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <img 
              src={userProfile?.spotifyProfile?.images?.[0]?.url || 'https://via.placeholder.com/128'} 
              alt={userProfile?.spotifyProfile?.display_name} 
              className="w-32 h-32 rounded-full border-4 border-[#8BA888]"
            />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">madhatter</h1>
              <p className="text-[#8BA888]">
                {userProfile?.spotifyProfile?.display_name} • Member since {new Date(userProfile?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Top 6 Albums */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Top 6 Albums</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="top-albums" direction="horizontal">
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar"
                >
                  {Array(6).fill(null).map((_, index) => {
                    const album = topAlbums[index];
                    return (
                      <Draggable 
                        key={album?.albumId || `empty-${index}`}
                        draggableId={album?.albumId || `empty-${index}`}
                        index={index}
                        isDragDisabled={!isOwnProfile}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex-shrink-0 w-48"
                          >
                            {album ? (
                              <div className="bg-[#2C382E]/30 rounded-lg p-4">
                                <img 
                                  src={album.albumImageUrl} 
                                  alt={album.albumName} 
                                  className="w-40 h-40 rounded-lg mb-3"
                                />
                                <div className="text-white font-medium truncate">{album.albumName}</div>
                                <div className="text-[#8BA888] text-sm truncate">{album.artistName}</div>
                              </div>
                            ) : (
                              <div 
                                className="bg-[#2C382E]/10 rounded-lg p-4 h-[280px] flex items-center justify-center cursor-pointer hover:bg-[#2C382E]/20 transition-colors"
                                onClick={() => isOwnProfile && handleAddAlbum(index)}
                              >
                                <div className="text-center">
                                  <div className="text-[#8BA888] text-4xl mb-2">+</div>
                                  <div className="text-[#8BA888] text-sm">Add Album</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Recent Ratings */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Ratings</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
            {recentRatings.map((rating, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                <div 
                  className="bg-[#2C382E]/30 rounded-lg p-4 h-full cursor-pointer hover:bg-[#2C382E]/50 transition-colors"
                  onClick={() => setSelectedReview(rating)}
                >
                  <div className="flex items-start space-x-4">
                    <img 
                      src={rating.albumImageUrl} 
                      alt={rating.albumName} 
                      className="w-24 h-24 rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium truncate">{rating.albumName}</div>
                      <div className="text-[#8BA888] text-sm truncate">{rating.artistName}</div>
                      <div className="flex items-center mt-2">
                        <div className="text-yellow-400">★</div>
                        <div className="text-white ml-1">{rating.rating}</div>
                      </div>
                      <div className="text-[#8BA888] text-sm mt-2 line-clamp-3">{rating.review}</div>
                      <div className="text-[#8BA888] text-xs mt-2">
                        {new Date(rating.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSearchModal && (
        <AlbumSearchModal
          onClose={() => {
            setShowSearchModal(false);
            setSelectedAlbumSlot(null);
          }}
          onSelect={handleAlbumSelected}
        />
      )}

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}

export default Profile; 