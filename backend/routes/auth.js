const express = require('express');
const axios = require('axios');
const router = express.Router();
const querystring = require('querystring');
const User = require('../models/User');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Step 1: Redirect user to Spotify's authorization page
router.get('/spotify/login', (req, res) => {
  const scope = 'user-read-email user-read-private user-top-read user-read-recently-played user-read-playback-state user-library-read';
  const state = Math.random().toString(36).substring(2, 15);
  
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  })}`;
  
  res.redirect(authUrl);
});

// Step 2: Spotify redirects back to this route with a code
router.get('/spotify/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect('http://localhost:3000?error=nocode');
  }

  try {
    // Get token from Spotify
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
      }
    });

    // Get user profile from Spotify
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    });

    // Create or update user in our database
    const user = await User.findOneAndUpdate(
      { spotifyId: userResponse.data.id },
      {
        spotifyId: userResponse.data.id,
        email: userResponse.data.email,
        displayName: userResponse.data.display_name,
        profileImage: userResponse.data.images?.[0]?.url
      },
      { upsert: true, new: true }
    );

    // Redirect to frontend with access token and our user ID
    res.redirect(`http://localhost:3000/dashboard?access_token=${tokenResponse.data.access_token}&userId=${user._id}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.redirect('http://localhost:3000?error=auth_failed');
  }
});

module.exports = router; 