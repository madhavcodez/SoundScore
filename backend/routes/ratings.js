const express = require('express');
const router = express.Router();

// In-memory store for ratings (for POC only; replace with a database later)
let ratings = [];

// Endpoint to submit a rating
router.post('/', (req, res) => {
  const { albumId, userId, rating, review } = req.body;
  if (!albumId || !userId || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newRating = { albumId, userId, rating, review, createdAt: new Date() };
  ratings.push(newRating);
  res.status(201).json(newRating);
});

// Endpoint to get all ratings
router.get('/', (req, res) => {
  res.json(ratings);
});

module.exports = router; 