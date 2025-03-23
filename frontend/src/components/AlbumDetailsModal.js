import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AlbumDetailsModal({ album, onClose, onRate }) {
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isHovering, setIsHovering] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' or 'reviews'
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

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
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId: album.id,
        userId,
        rating,
        review,
        username: soundscoreUsername,
        timestamp: new Date().toISOString()
      });

      // Update local state with new review
      setReviews(prevReviews => [{
        ...response.data,
        username: soundscoreUsername
      }, ...prevReviews]);
      
      setAverageRating(response.data.averageRating);
      setTotalRatings(prevTotal => prevTotal + 1);

      toast.success('Rating submitted successfully!');
      setRating(0);
      setReview('');
    } catch (error) {
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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 text-xl"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Album Cover and Metadata */}
            <div className="md:w-1/2 p-8">
              <img
                src={albumDetails?.images?.[0]?.url || album.imageUrl}
                alt={albumDetails?.name || album.name}
                className="w-full rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-3xl font-bold text-white mt-6 mb-2">
                {albumDetails?.name || album.name}
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                {albumDetails?.artists?.[0]?.name || album.artist}
              </p>
              
              {/* Enhanced Album Metadata */}
              <div className="space-y-4 text-gray-300 mb-8">
                <div className="bg-black/30 p-4 rounded-xl">
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

                <div className="bg-black/30 p-4 rounded-xl mt-4">
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
              <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-center mb-6">
                  <p className="text-gray-400 mb-2">Community Rating</p>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-4xl font-bold text-white">
                      {calculateAverageRating()}
                    </span>
                    <div className="flex text-yellow-400 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= (averageRating || 0) ? 'text-yellow-400' : 'text-gray-600'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 text-center">Rate this Album</h3>
                <div className="flex justify-center mb-4">
                  <StarRating />
                </div>
                <textarea
                  placeholder="Share your thoughts about this album..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full mt-4 p-4 bg-black/50 text-white rounded-xl border border-gray-800 focus:border-[#8BA888] focus:ring-1 focus:ring-[#8BA888] focus:outline-none resize-none"
                  rows="4"
                />
                <button
                  onClick={handleSubmitRating}
                  className="mt-4 w-full bg-[#8BA888] text-white py-3 px-6 rounded-xl text-lg font-bold hover:bg-[#7A9877] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!rating}
                >
                  {rating ? 'Submit Rating' : 'Select a Rating'}
                </button>
              </div>
            </div>

            {/* Right Column - Tabs */}
            <div className="md:w-1/2 p-8 border-l border-gray-800 flex flex-col h-full">
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    activeTab === 'tracks' ? 'bg-[#8BA888] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('tracks')}
                >
                  Tracks
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    activeTab === 'reviews' ? 'bg-[#8BA888] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'tracks' ? (
                  <div className="space-y-2">
                    {albumDetails?.tracks?.items?.map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 hover:bg-black/30 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-gray-400 w-8 flex-shrink-0">{index + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-white truncate">{track.name}</p>
                            <p className="text-sm text-gray-400 truncate">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          {track.preview_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const audio = new Audio(track.preview_url);
                                audio.play();
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8BA888] hover:text-white"
                            >
                              ▶
                            </button>
                          )}
                          <span className="text-gray-400">
                            {Math.floor(track.duration_ms / 60000)}:
                            {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <div key={index} className="bg-black/30 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{review.username}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(review.timestamp).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          {review.review && (
                            <p className="text-gray-300 mt-2">{review.review}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        No reviews yet. Be the first to rate this album!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumDetailsModal; 