const express = require('express');
const axios = require('axios');
const router = express.Router();
const querystring = require('querystring');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

    // Redirect to frontend with Spotify data for account creation
    const spotifyData = encodeURIComponent(JSON.stringify({
      id: userResponse.data.id,
      email: userResponse.data.email,
      display_name: userResponse.data.display_name
    }));

    res.redirect(`http://localhost:3000/complete-signup?spotify_data=${spotifyData}&access_token=${tokenResponse.data.access_token}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.redirect('http://localhost:3000?error=auth_failed');
  }
});

// New signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, password, spotifyId, email, displayName } = req.body;
    
    console.log('Received signup request:', { username, spotifyId, email, displayName });

    // Validate required fields
    if (!username || !password || !spotifyId || !email) {
      console.log('Missing required fields:', { username, spotifyId, email });
      return res.status(400).json({ 
        error: 'missing_fields',
        message: 'All fields are required' 
      });
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already taken:', username);
      return res.status(400).json({ 
        error: 'username_taken',
        message: 'Username is already taken' 
      });
    }

    // Check if Spotify account already exists
    const existingSpotifyUser = await User.findOne({ spotifyId });
    if (existingSpotifyUser) {
      // Instead of sending an error, send back the existing user info
      return res.json({ 
        success: true, 
        userId: existingSpotifyUser._id,
        username: existingSpotifyUser.username,
        existing: true
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      spotifyId,
      email,
      displayName,
      createdAt: new Date()
    });

    await user.save();
    console.log('User created successfully:', user._id);

    res.json({ 
      success: true, 
      userId: user._id,
      username: user.username 
    });

  } catch (error) {
    console.error('Server error during signup:', error);
    res.status(500).json({ 
      error: 'server_error',
      message: error.message || 'Failed to create account'
    });
  }
});

module.exports = router; 