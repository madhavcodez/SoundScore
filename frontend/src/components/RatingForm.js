import React, { useState } from 'react';
import axios from 'axios';

function RatingForm() {
  const [albumId, setAlbumId] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/ratings', {
        albumId,
        userId: 'sample-user', // For POC, hardcode a user or retrieve it after auth
        rating,
        review,
      });
      console.log('Rating submitted:', response.data);
      // Clear form
      setAlbumId('');
      setRating(0);
      setReview('');
    } catch (err) {
      console.error('Error submitting rating', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <div className="mb-4">
        <label className="block font-bold">Album ID:</label>
        <input
          type="text"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Review:</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Submit Rating
      </button>
    </form>
  );
}

export default RatingForm; 