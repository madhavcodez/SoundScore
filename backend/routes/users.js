const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Add friend
router.post('/:userId/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.body.friendId);
    
    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

// Add rating
router.post('/:userId/ratings', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.ratings.push({
      albumId: req.body.albumId,
      rating: req.body.rating,
      review: req.body.review
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// Add album to top albums
router.post('/:userId/top-albums', async (req, res) => {
  try {
    const { albumId, position } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize topAlbums array if it doesn't exist
    if (!user.topAlbums) {
      user.topAlbums = [];
    }

    // Remove the album if it already exists in any position
    user.topAlbums = user.topAlbums.filter(album => album.albumId !== albumId);

    // Add the album at the specified position
    user.topAlbums.push({
      albumId,
      position,
      addedAt: new Date()
    });

    // Sort by position
    user.topAlbums.sort((a, b) => a.position - b.position);

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding top album:', error);
    res.status(500).json({ error: 'Failed to add top album' });
  }
});

// Update top albums order
router.put('/:userId/top-albums', async (req, res) => {
  try {
    const { topAlbums } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.topAlbums = topAlbums;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating top albums:', error);
    res.status(500).json({ error: 'Failed to update top albums' });
  }
});

module.exports = router; 