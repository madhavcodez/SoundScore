const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Album = require('../models/Album');

// Get ratings for an album
router.get('/:albumId', async (req, res) => {
  try {
    const ratings = await Rating.find({ albumId: req.params.albumId })
      .sort({ timestamp: -1 });
    
    const album = await Album.findOne({ spotifyId: req.params.albumId });
    
    res.json({
      ratings,
      averageRating: album?.averageRating || 0,
      totalRatings: album?.totalRatings || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Submit a rating
router.post('/', async (req, res) => {
  try {
    const { albumId, userId, rating, review } = req.body;
    
    if (!albumId || !userId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create or update the rating
    const newRating = await Rating.findOneAndUpdate(
      { albumId, userId },
      { rating, review, timestamp: new Date() },
      { upsert: true, new: true }
    );

    // Calculate new average rating
    const allRatings = await Rating.find({ albumId });
    const averageRating = allRatings.reduce((acc, curr) => acc + curr.rating, 0) / allRatings.length;
    const totalRatings = allRatings.length;

    // Update or create album document with new rating data
    await Album.findOneAndUpdate(
      { spotifyId: albumId },
      { 
        $set: { 
          averageRating,
          totalRatings
        }
      },
      { upsert: true }
    );

    res.status(201).json({
      rating: newRating,
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router; 