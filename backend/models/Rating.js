const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema); 