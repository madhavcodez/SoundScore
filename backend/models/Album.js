const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  artist: String,
  imageUrl: String,
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  genres: [String]
});

module.exports = mongoose.model('Album', albumSchema); 