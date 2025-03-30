import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, MessageCircle, Heart, MoreVertical } from 'react-feather';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

const AlbumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const token = localStorage.getItem('spotify_token');
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlbum(response.data);

        // Fetch user's rating and reviews
        const userId = localStorage.getItem('userId');
        const ratingResponse = await axios.get(`/api/ratings/album/${id}/user/${userId}`);
        setUserRating(ratingResponse.data);

        const reviewsResponse = await axios.get(`/api/ratings/album/${id}`);
        setReviews(reviewsResponse.data);

        // Check if user has liked the album
        const likesResponse = await axios.get(`/api/albums/${id}/likes`);
        setIsLiked(likesResponse.data.isLiked);
        setLikesCount(likesResponse.data.count);
      } catch (error) {
        console.error('Error fetching album details:', error);
        toast.error('Failed to fetch album details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id, navigate]);

  const handleRatingSubmit = async (rating) => {
    try {
      const response = await axios.post(`/api/ratings/album/${id}`, {
        rating,
        review: reviewText
      });
      setUserRating(response.data);
      setShowReviewModal(false);
      setReviewText('');
      toast.success('Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/albums/${id}/like`);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.count);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA888]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] via-[#1C2820] to-[#141414]">
      {/* Global Ambient Background Graphics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#8BA888]/5 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Album Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-64 h-64 rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{album.name}</h1>
              <p className="text-[#8BA888] mb-4">
                {album.artists.map(artist => artist.name).join(', ')}
              </p>
              <p className="text-[#8BA888] mb-4">
                {album.release_date.split('-')[0]} • {album.total_tracks} tracks
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center space-x-2 bg-[#8BA888] text-white px-4 py-2 rounded-lg hover:bg-[#8BA888]/90 transition-colors"
                >
                  <Star size={20} />
                  <span>Rate Album</span>
                </button>
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    isLiked ? 'text-red-400' : 'text-[#8BA888]'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{likesCount}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="bg-[#2C382E]/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tracks</h2>
            <div className="space-y-2">
              {album.tracks.items.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between py-2 px-4 bg-[#2C382E]/50 rounded-lg hover:bg-[#2C382E]/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-[#8BA888] w-8">{index + 1}</span>
                    <div>
                      <p className="text-white">{track.name}</p>
                      <p className="text-[#8BA888] text-sm">
                        {track.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#8BA888]">{formatDuration(track.duration_ms)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-[#2C382E]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#2C382E]/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={review.user.profileImage || '/default-avatar.png'}
                        alt={review.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span
                        className="text-white hover:text-[#8BA888] cursor-pointer"
                        onClick={() => navigate(`/profile/${review.user.username}`)}
                      >
                        {review.user.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-white">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-[#8BA888]">{review.review}</p>
                  <div className="flex items-center space-x-2 mt-2 text-[#8BA888] text-sm">
                    <MessageCircle size={14} />
                    <span>{review.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#2C382E] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Rate Album</h2>
            <div className="flex items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingSubmit(star)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Star size={24} fill="currentColor" />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full bg-[#2C382E]/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8BA888] h-32 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-[#8BA888] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRatingSubmit(userRating?.rating || 0)}
                className="px-4 py-2 bg-[#8BA888] text-white rounded-lg hover:bg-[#8BA888]/90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails; 