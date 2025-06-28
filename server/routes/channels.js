import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('videos');
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create channel
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    const channel = new Channel({
      name,
      description,
      owner: req.user._id
    });

    await channel.save();
    await channel.populate('owner', 'username avatar');

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Subscribe/Unsubscribe to channel
router.post('/:id/subscribe', authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const isSubscribed = channel.subscribers.includes(req.user._id);

    if (isSubscribed) {
      channel.subscribers.pull(req.user._id);
      user.subscribedChannels.pull(channel._id);
    } else {
      channel.subscribers.push(req.user._id);
      user.subscribedChannels.push(channel._id);
    }

    await channel.save();
    await user.save();

    res.json({ 
      subscribed: !isSubscribed, 
      subscriberCount: channel.subscribers.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;