const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const axios = require('axios');

// Search albums
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: { q, type: 'album', limit: 10 },
      headers: { Authorization: `Bearer ${req.headers.authorization}` }
    });

    const albums = response.data.albums.items.map(album => ({
      spotifyId: album.id,
      name: album.name,
      artist: album.artists[0].name,
      imageUrl: album.images[0].url
    }));

    // Get ratings from our database
    const dbAlbums = await Album.find({
      spotifyId: { $in: albums.map(a => a.spotifyId) }
    });

    // Merge Spotify data with our ratings
    const mergedAlbums = albums.map(album => {
      const dbAlbum = dbAlbums.find(a => a.spotifyId === album.spotifyId) || {};
      return {
        ...album,
        averageRating: dbAlbum.averageRating || 0,
        totalRatings: dbAlbum.totalRatings || 0
      };
    });

    res.json(mergedAlbums);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router; 