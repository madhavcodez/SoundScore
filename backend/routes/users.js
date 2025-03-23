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

module.exports = router; 