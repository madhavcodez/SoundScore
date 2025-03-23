import React, { useState } from 'react';
import axios from 'axios';

function RatingModal({ album, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ratings`, {
        albumId: album.spotifyId,
        rating,
        review
      });
      onSubmit(response.data);
      onClose();
    } catch (error) {
      console.error('Rating submission error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Rate Album</h2>
        <div className="flex items-center gap-4 mb-4">
          <img src={album.imageUrl} alt={album.name} className="w-24 h-24 rounded" />
          <div>
            <div className="text-white font-semibold">{album.name}</div>
            <div className="text-gray-400">{album.artist}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-500'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded"
              rows="3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RatingModal; 