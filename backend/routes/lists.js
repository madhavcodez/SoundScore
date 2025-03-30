const express = require('express');
const router = express.Router();
const List = require('../models/List');
const axios = require('axios');

// Create a new list
router.post('/', async (req, res) => {
  try {
    const { title, description, items, visibility } = req.body;
    const creator = req.user._id;

    const list = new List({
      creator,
      title,
      description,
      items: items || [],
      visibility: visibility || 'public'
    });

    await list.save();
    res.status(201).json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Failed to create list' });
  }
});

// Get a specific list
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
      .populate('creator', 'username displayName profileImage')
      .populate('comments.user', 'username displayName profileImage');

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (!list.canView(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to view this list' });
    }

    // Fetch album details from Spotify for each item
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const albumDetails = await Promise.all(
        list.items.map(async (item) => {
          try {
            const response = await axios.get(`https://api.spotify.com/v1/albums/${item.albumId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return {
              ...item.toObject(),
              album: response.data
            };
          } catch (error) {
            console.error(`Error fetching album ${item.albumId}:`, error);
            return item;
          }
        })
      );
      list.items = albumDetails;
    }

    res.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

// Update a list
router.put('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (!list.canEdit(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this list' });
    }

    const { title, description, items, visibility } = req.body;

    if (title) list.title = title;
    if (description !== undefined) list.description = description;
    if (items) list.items = items;
    if (visibility) list.visibility = visibility;

    await list.save();
    res.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Failed to update list' });
  }
});

// Delete a list
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (!list.canEdit(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this list' });
    }

    await list.remove();
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

// Search lists
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const lists = await List.find({
      $text: { $search: query },
      $or: [
        { visibility: 'public' },
        { creator: userId },
        { visibility: 'unlisted' }
      ]
    })
    .populate('creator', 'username displayName profileImage')
    .limit(20);

    res.json(lists);
  } catch (error) {
    console.error('Error searching lists:', error);
    res.status(500).json({ error: 'Failed to search lists' });
  }
});

// Add/remove like
router.post('/:id/like', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (!list.canView(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to like this list' });
    }

    const likeIndex = list.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      list.likes.push(req.user._id);
    } else {
      list.likes.splice(likeIndex, 1);
    }

    await list.save();
    res.json({ likes: list.likes.length });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (!list.canView(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to comment on this list' });
    }

    list.comments.push({
      user: req.user._id,
      text
    });

    await list.save();
    res.json(list.comments[list.comments.length - 1]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router; 