const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Album = require('../models/Album');

// Get ratings for an album
router.get('/:albumId', async (req, res) => {
  try {
    const ratings = await Rating.find({ albumId: req.params.albumId })
      .select('rating review username timestamp') // Explicitly select the fields we want
      .sort({ timestamp: -1 });
    
    const album = await Album.findOne({ spotifyId: req.params.albumId });
    
    res.json({
      ratings: ratings.map(rating => ({
        ...rating.toObject(),
        username: rating.username || 'Anonymous' // Ensure username is included
      })),
      averageRating: album?.averageRating || 0,
      totalRatings: album?.totalRatings || 0
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Submit a rating
router.post('/', async (req, res) => {
  try {
    const { albumId, userId, username, rating, review } = req.body;
    
    if (!albumId || !userId || !username || !rating || !review) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create or update the rating
    const newRating = await Rating.findOneAndUpdate(
      { albumId, userId },
      { 
        rating, 
        review, 
        username,
        timestamp: new Date() 
      },
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

    // Return the complete rating object with username
    res.status(201).json({
      rating: {
        ...newRating.toObject(),
        username: username // Ensure username is included
      },
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get all ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .populate('albumId', 'name artist imageUrl'); // Populate album details
    
    // Transform the data to include album details
    const transformedRatings = ratings.map(rating => ({
      ...rating.toObject(),
      album: {
        name: rating.albumId?.name || 'Unknown Album',
        artist: rating.albumId?.artist || 'Unknown Artist',
        imageUrl: rating.albumId?.imageUrl || 'https://via.placeholder.com/150'
      }
    }));

    res.json({ ratings: transformedRatings });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
});

module.exports = router; 