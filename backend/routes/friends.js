const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search users by username
router.get('/search', async (req, res) => {
  try {
    const { username } = req.query;
    const currentUserId = req.user._id; // Assuming you have user info from auth middleware

    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required' });
    }

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: currentUserId } // Exclude current user
    })
    .select('username displayName profileImage')
    .limit(10);

    // Get current user's friends and pending requests
    const currentUser = await User.findById(currentUserId)
      .select('friends friendRequests');

    // Add friend status to each user
    const usersWithStatus = users.map(user => {
      const isFriend = currentUser.friends.includes(user._id);
      const hasPendingRequest = currentUser.friendRequests.some(
        request => request.sender.equals(user._id) && request.status === 'pending'
      );
      const hasOutgoingRequest = currentUser.friendRequests.some(
        request => request.sender.equals(currentUserId) && request.status === 'pending'
      );

      return {
        ...user.toObject(),
        isFriend,
        hasPendingRequest,
        hasOutgoingRequest
      };
    });

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Send friend request
router.post('/requests', async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user._id;

    if (senderId.equals(recipientId)) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId)
    ]);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check if they're already friends
    if (sender.friends.includes(recipientId)) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }

    // Check for existing pending request
    const existingRequest = recipient.friendRequests.find(
      request => request.sender.equals(senderId) && request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    // Add friend request
    recipient.friendRequests.push({
      sender: senderId,
      status: 'pending'
    });

    await recipient.save();
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Accept friend request
router.put('/requests/:requestId/accept', async (req, res) => {
  try {
    const { requestId } = req.params;
    const recipientId = req.user._id;

    const recipient = await User.findById(recipientId);
    const request = recipient.friendRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request already processed' });
    }

    // Update both users
    await Promise.all([
      // Add to recipient's friends
      User.findByIdAndUpdate(recipientId, {
        $push: { friends: request.sender },
        $set: { 'friendRequests.$[elem].status': 'accepted' }
      }, {
        arrayFilters: [{ 'elem._id': requestId }]
      }),
      // Add to sender's friends
      User.findByIdAndUpdate(request.sender, {
        $push: { friends: recipientId }
      })
    ]);

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Decline friend request
router.put('/requests/:requestId/decline', async (req, res) => {
  try {
    const { requestId } = req.params;
    const recipientId = req.user._id;

    const recipient = await User.findById(recipientId);
    const request = recipient.friendRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request already processed' });
    }

    // Update request status
    request.status = 'declined';
    await recipient.save();

    res.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
});

// Get friends and requests
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate('friends', 'username displayName profileImage')
      .populate('friendRequests.sender', 'username displayName profileImage');

    const friends = user.friends;
    const incomingRequests = user.friendRequests
      .filter(request => request.status === 'pending')
      .map(request => ({
        id: request._id,
        sender: request.sender,
        createdAt: request.createdAt
      }));

    res.json({
      friends,
      incomingRequests
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

module.exports = router; 