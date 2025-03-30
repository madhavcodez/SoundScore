const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  items: [{
    albumId: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for search functionality
listSchema.index({ title: 'text', description: 'text' });

// Method to check if a user can view the list
listSchema.methods.canView = function(userId) {
  if (this.visibility === 'public') return true;
  if (this.visibility === 'private') return this.creator.toString() === userId;
  if (this.visibility === 'unlisted') return true; // Anyone with the link can view
  return false;
};

// Method to check if a user can edit the list
listSchema.methods.canEdit = function(userId) {
  return this.creator.toString() === userId;
};

const List = mongoose.model('List', listSchema);

module.exports = List; 