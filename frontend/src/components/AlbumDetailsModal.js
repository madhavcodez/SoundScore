import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReviewModal from './ReviewModal';

function AlbumDetailsModal({ album, onClose, onRate }) {
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isHovering, setIsHovering] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks');
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [favoriteTrack, setFavoriteTrack] = useState(null);
  const [leastFavoriteTrack, setLeastFavoriteTrack] = useState(null);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 'N/A';
    const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get('access_token');
        
        // Fetch album details from Spotify
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Then get artist details
        const artistId = albumResponse.data.artists[0].id;
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAlbumDetails({
          ...albumResponse.data,
          artistDetails: artistResponse.data
        });

        // Try to fetch ratings, but don't let it break the modal if it fails
        try {
          const ratingsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/ratings/${album.id}`);
          setReviews(ratingsResponse.data.ratings || []);
          setAverageRating(ratingsResponse.data.averageRating || 0);
          setTotalRatings(ratingsResponse.data.totalRatings || 0);
        } catch (error) {
          console.log('No ratings found for this album');
          setReviews([]);
          setAverageRating(0);
          setTotalRatings(0);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching album details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [album.id]);

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    try {
      const userId = new URLSearchParams(window.location.search).get('userId');
      const token = new URLSearchParams(window.location.search).get('access_token');
      const soundscoreUsername = localStorage.getItem('soundscore_username');
      
      if (!soundscoreUsername) {
        toast.error('Please log in to submit a rating');
        return;
      }

      console.log('Submitting rating with username:', soundscoreUsername); // Debug log

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId: album.id,
        userId,
        rating,
        review,
        username: soundscoreUsername,
        timestamp: new Date().toISOString()
      });

      console.log('Rating response:', response.data); // Debug log

      // Update local state with new review
      setReviews(prevReviews => [{
        ...response.data.rating,
        username: soundscoreUsername
      }, ...prevReviews]);
      
      setAverageRating(response.data.averageRating);
      setTotalRatings(prevTotal => prevTotal + 1);

      toast.success('Rating submitted successfully!');
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Rating submission error:', error);
      toast.error('Failed to submit rating');
    }
  };

  const StarRating = () => (
    <div className="flex space-x-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`text-5xl transition-all duration-200 transform hover:scale-110 ${
            star <= (isHovering || rating) ? 'text-yellow-400' : 'text-gray-400'
          }`}
          onMouseEnter={() => setIsHovering(star)}
          onMouseLeave={() => setIsHovering(0)}
          onClick={() => setRating(star)}
        >
          ★
        </button>
      ))}
    </div>
  );

  const handleTrackSelection = (track, type) => {
    if (type === 'favorite') {
      if (leastFavoriteTrack?.id === track.id) {
        setLeastFavoriteTrack(null);
      }
      setFavoriteTrack(track);
      toast.success(`Selected "${track.name}" as your favorite track!`);
    } else {
      if (favoriteTrack?.id === track.id) {
        setFavoriteTrack(null);
      }
      setLeastFavoriteTrack(track);
      toast.success(`Selected "${track.name}" as your least favorite track`);
    }
  };

  const TrackList = () => (
    <div className="space-y-2">
      {albumDetails?.tracks?.items?.map((track, index) => (
        <div
          key={track.id}
          className={`group relative flex items-center justify-between p-4 rounded-xl transition-all duration-200
                     ${hoveredTrack === track.id ? 'bg-[#8BA888]/10' : 'hover:bg-black/30'}`}
          onMouseEnter={() => setHoveredTrack(track.id)}
          onMouseLeave={() => setHoveredTrack(null)}
        >
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8BA888]/20 text-[#8BA888] font-semibold">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white truncate font-medium">{track.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Track Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleTrackSelection(track, 'favorite')}
                className={`p-2 rounded-full transition-all duration-200 ${
                  favoriteTrack?.id === track.id 
                    ? 'text-yellow-400 bg-yellow-400/20 scale-110' 
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20 hover:scale-110'
                }`}
                title="Mark as favorite"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              <button
                onClick={() => handleTrackSelection(track, 'least')}
                className={`p-2 rounded-full transition-all duration-200 ${
                  leastFavoriteTrack?.id === track.id 
                    ? 'text-red-400 bg-red-400/20 scale-110' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-400/20 hover:scale-110'
                }`}
                title="Mark as least favorite"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              {track.preview_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const audio = new Audio(track.preview_url);
                    audio.play();
                  }}
                  className="p-2 rounded-full text-[#8BA888] hover:text-white hover:bg-[#8BA888]/20 transition-colors"
                  title="Play preview"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <span className="text-gray-400 text-sm">
              {Math.floor(track.duration_ms / 60000)}:
              {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl border border-gray-800 scale-95 custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 text-xl p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Album Cover and Metadata */}
            <div className="md:w-1/2 p-6">
              <div className="relative group cursor-pointer">
                <img
                  src={albumDetails?.images?.[0]?.url || album.imageUrl}
                  alt={albumDetails?.name || album.name}
                  className="w-full rounded-lg shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[#8BA888]/20"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mt-6 mb-2">
                {albumDetails?.name || album.name}
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                {albumDetails?.artists?.[0]?.name || album.artist}
              </p>
              
              {/* Enhanced Album Metadata */}
              <div className="space-y-4 text-gray-300 mb-8">
                <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-3">Album Info</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 flex-shrink-0">Released:</span>
                      <span className="text-right truncate">{albumDetails?.release_date ? 
                        new Date(albumDetails.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}</span>
                    </p>
                    <p className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 flex-shrink-0">Label:</span>
                      <span className="text-right truncate">{albumDetails?.label || 'Not available'}</span>
                    </p>
                    <p className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 flex-shrink-0">Popularity:</span>
                      <span className="text-right truncate">{albumDetails?.popularity || '0'}%</span>
                    </p>
                    <p className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 flex-shrink-0">Total Tracks:</span>
                      <span className="text-right truncate">{albumDetails?.tracks?.items?.length || '0'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-3">Artist Info</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Followers:</span>
                      <span>
                        {albumDetails?.artistDetails?.followers?.total ? 
                          new Intl.NumberFormat().format(albumDetails.artistDetails.followers.total) : 
                          'Not available'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Popularity:</span>
                      <span>{albumDetails?.artistDetails?.popularity || '0'}%</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Genres:</span>
                      <span>
                        {albumDetails?.artistDetails?.genres?.length > 0 ? 
                          albumDetails.artistDetails.genres.join(', ') : 
                          'Not available'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {albumDetails?.genres?.map(genre => (
                    <span key={genre} className="px-3 py-1 bg-[#8BA888]/20 rounded-full text-[#8BA888] text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating Section */}
              <div className="bg-black/30 p-5 rounded-xl backdrop-blur-sm">
                <div className="text-center mb-5">
                  <p className="text-gray-400 mb-2 text-sm uppercase tracking-wider">Community Rating</p>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                      <span className="text-4xl font-bold text-white">
                        {calculateAverageRating()}
                      </span>
                      <div className="absolute -top-2 -right-2 bg-[#8BA888] text-white text-xs px-2 py-1 rounded-full">
                        {totalRatings}
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= (averageRating || 0) ? 'text-yellow-400' : 'text-gray-600'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#8BA888]/30 to-transparent my-4" />

                <h3 className="text-lg font-bold text-white mb-3 text-center">Rate this Album</h3>
                <div className="flex justify-center mb-3">
                  <StarRating />
                </div>
                <textarea
                  placeholder="Share your thoughts about this album..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full mt-3 p-3 bg-black/50 text-white rounded-xl border border-gray-800 focus:border-[#8BA888] focus:ring-1 focus:ring-[#8BA888] focus:outline-none resize-none text-sm"
                  rows="3"
                />
                <button
                  onClick={handleSubmitRating}
                  className="mt-3 w-full bg-[#8BA888] text-white py-2 px-4 rounded-xl text-base font-bold hover:bg-[#7A9877] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!rating}
                >
                  {rating ? 'Submit Rating' : 'Select a Rating'}
                </button>
              </div>
            </div>

            {/* Right Column - Tracks and Reviews */}
            <div className="md:w-1/2 p-6 border-l border-gray-800">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('tracks')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'tracks'
                      ? 'bg-[#8BA888] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tracks
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'reviews'
                      ? 'bg-[#8BA888] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Reviews
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'tracks' ? (
                  <TrackList />
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div 
                        key={index} 
                        className="bg-black/30 p-4 rounded-xl cursor-pointer hover:bg-black/40 transition-colors"
                        onClick={() => setSelectedReview(review)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{review.username || 'Anonymous'}</span>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 line-clamp-3">{review.review}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(review.timestamp).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewModal
          review={{
            ...selectedReview,
            albumName: album.name,
            albumImageUrl: album.images?.[0]?.url || album.imageUrl,
            artistName: album.artists?.[0]?.name || album.artist
          }}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}

// Update the scrollbar styles at the bottom of the file
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #000000;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #8BA888;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #7A9877;
  }
`;
document.head.appendChild(style);

export default AlbumDetailsModal; 