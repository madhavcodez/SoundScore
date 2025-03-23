import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AlbumSearch from '../components/AlbumSearch';
import RatingModal from '../components/RatingModal';
import Section from '../components/Section';
import FloatingAddButton from '../components/FloatingAddButton';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [recentRatings, setRecentRatings] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topListenedAlbums, setTopListenedAlbums] = useState([]);
  const [fullyListenedAlbums, setFullyListenedAlbums] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [completedAlbums, setCompletedAlbums] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedAlbums, setSuggestedAlbums] = useState([]);
  const [readyToRate, setReadyToRate] = useState([]);
  const navigate = useNavigate();

  // Create refs for all rows
  const trendingRowRef = React.useRef(null);
  const ratingsRowRef = React.useRef(null);
  const topArtistsRowRef = React.useRef(null);
  const recommendedRowRef = React.useRef(null);
  const recentlyPlayedRef = React.useRef(null);

  const fetchData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const userId = urlParams.get('userId');
    
    if (!token || !userId) {
      navigate('/');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    try {
      // Fetch user data from our backend
      const userDataResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
      setUserRatings(userDataResponse.data.ratings);

      // Fetch all data in parallel
      const [userResponse, recentlyPlayedResponse, newReleasesResponse, topTracksResponse] = await Promise.all([
        axios.get('https://api.spotify.com/v1/me', { headers }),
        axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=20', { headers }),
        axios.get('https://api.spotify.com/v1/browse/new-releases?limit=20', { headers }),
        axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', { headers })
      ]);

      setUserProfile(userResponse.data);
      setTrendingAlbums(newReleasesResponse.data.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artist: album.artists[0].name,
        imageUrl: album.images[0].url
      })));

      // Process recently played tracks
      const uniqueRecentAlbums = new Map();
      recentlyPlayedResponse.data.items.forEach(item => {
        const album = item.track.album;
        if (!uniqueRecentAlbums.has(album.id)) {
          uniqueRecentAlbums.set(album.id, {
            id: album.id,
            name: album.name,
            artist: album.artists[0].name,
            imageUrl: album.images[0].url
          });
        }
      });
      setRecentlyPlayed(Array.from(uniqueRecentAlbums.values()));

      // Set ready to rate albums
      const ratedAlbumIds = new Set(userRatings.map(rating => rating.albumId));
      const readyToRateAlbums = Array.from(uniqueRecentAlbums.values())
        .filter(album => !ratedAlbumIds.has(album.id))
        .slice(0, 10);
      setReadyToRate(readyToRateAlbums);

      // Get user's top artists for recommendations
      const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers,
        params: { limit: 5, time_range: 'short_term' }
      });

      // Get recommendations based on top artists
      const artistIds = topArtistsResponse.data.items.map(artist => artist.id).join(',');
      const recommendationsResponse = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers,
        params: {
          seed_artists: artistIds,
          limit: 20
        }
      });

      // Process recommendations
      const suggestions = recommendationsResponse.data.tracks.map(track => ({
        id: track.album.id,
        name: track.album.name,
        artist: track.album.artists[0].name,
        imageUrl: track.album.images[0].url
      }));

      // Filter out duplicates and set suggested albums
      const uniqueSuggestions = Array.from(new Set(suggestions.map(a => a.id)))
        .map(id => suggestions.find(a => a.id === id));

      setSuggestedAlbums(uniqueSuggestions);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Expose handleRatingSubmit to window
  useEffect(() => {
    window.handleRatingSubmit = handleRatingSubmit;
    return () => {
      delete window.handleRatingSubmit;
    };
  }, []);

  const scrollRow = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Loading Skeleton Component
  const SkeletonRow = () => (
    <div className="relative">
      <div className="h-8 w-48 bg-[#2C382E] rounded animate-pulse mb-4"></div>
      <div className="flex space-x-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-none w-48">
            <div className="aspect-square bg-[#2C382E] rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 bg-[#2C382E] rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-3 bg-[#2C382E] rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Empty Ratings Component
  const EmptyRatings = () => (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">Your Recent Ratings</h2>
      <div className="flex items-center justify-center h-64 bg-[#2C382E]/20 rounded-lg">
        <div className="text-center">
          <p className="text-[#8BA888] mb-4">No ratings yet</p>
          <Link 
            to="/rate"
            className="inline-flex items-center px-4 py-2 bg-[#2C382E] rounded-full 
                     hover:bg-[#3C4A3E] transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Rating
          </Link>
        </div>
      </div>
    </div>
  );

  // Album Row Component with Click Handling
  const AlbumRow = ({ title, items, rowRef, type = 'album' }) => (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="group relative">
        <button 
          onClick={() => scrollRow('left', rowRef)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full 
                     text-[#A4C3A2] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-black/70 -translate-x-1/2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div ref={rowRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/${type}/${item.id}`)}
              className="flex-none w-48 transform transition-transform duration-300 
                       hover:scale-105 cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-[#2C382E]/30">
                <img 
                  src={type === 'album' ? item.images[0].url : 
                       type === 'artist' ? item.images[0].url : 
                       item.album.images[0].url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium truncate">{item.name}</h3>
              <p className="text-sm text-[#8BA888] truncate">
                {type === 'album' ? item.artists[0].name :
                 type === 'artist' ? 'Artist' :
                 item.artists[0].name}
              </p>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scrollRow('right', rowRef)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full 
                     text-[#A4C3A2] opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-black/70 translate-x-1/2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Album card component with hover effect
  const AlbumCard = ({ album, showAddButton = false }) => (
    <div className="relative group">
      <div className="relative w-48 h-48 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <img 
          src={album.imageUrl} 
          alt={album.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            {showAddButton ? (
              <button
                onClick={() => {
                  setSelectedAlbum(album);
                  setShowRatingModal(true);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-full"
              >
                Add Rating
              </button>
            ) : (
              <div className="text-white text-center">
                <div className="text-xl font-bold">{album.averageRating.toFixed(1)}</div>
                <div className="text-sm">{album.totalRatings} ratings</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-white">
        <div className="font-semibold truncate">{album.name}</div>
        <div className="text-sm text-gray-400 truncate">{album.artist}</div>
      </div>
    </div>
  );

  // Add the handleRatingSubmit function
  const handleRatingSubmit = async (albumId, rating, review) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId,
        rating,
        review,
        userId,
        timestamp: new Date().toISOString()
      });

      // Show success message
      toast.success('Rating submitted successfully!');
      
      // Refresh the album lists after rating
      fetchData();
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-8 px-8">
        <div className="space-y-12">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Toaster position="top-center" />
      <Navbar userProfile={userProfile} />
      
      <div className="pt-20 px-8 pb-8 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <AlbumSearch onResults={setSearchResults} />
        </div>

        {/* Album Sections */}
        <div className="space-y-12">
          {searchResults.length > 0 && (
            <Section title="Search Results" albums={searchResults} showAddButton />
          )}

          <Section title="Recently Played" albums={recentlyPlayed} />
          <Section title="Trending Now" albums={trendingAlbums} />
          <Section title="Suggested For You" albums={suggestedAlbums} />
          <Section title="Ready to Rate" albums={readyToRate} showAddButton />
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <RatingModal
            album={selectedAlbum}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRatingSubmit}
          />
        )}

        <FloatingAddButton onClick={() => setShowSearchModal(true)} />
      </div>
    </div>
  );
}

export default Dashboard; 