const express = require('express');
const router = express.Router();
const axios = require('axios');

// Search artists
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No Spotify token provided' });
    }

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: 'artist',
        limit: 20
      }
    });

    res.json(response.data.artists.items);
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ error: 'Failed to search artists' });
  }
});

// Get artist details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No Spotify token provided' });
    }

    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching artist details:', error);
    res.status(500).json({ error: 'Failed to fetch artist details' });
  }
});

// Get artist's albums
router.get('/:id/albums', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No Spotify token provided' });
    }

    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        limit: 50,
        include_groups: 'album,single'
      }
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    res.status(500).json({ error: 'Failed to fetch artist albums' });
  }
});

module.exports = router; 