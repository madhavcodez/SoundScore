const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.spotifyId; // Only required if not using Spotify auth
    }
  },
  spotifyId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  displayName: String,
  profileImage: String,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ratings: [{
    albumId: String,
    rating: Number,
    review: String,
    timestamp: Date
  }],
  topAlbums: [{
    albumId: String,
    position: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for username search
userSchema.index({ username: 'text' });

module.exports = mongoose.model('User', userSchema); 