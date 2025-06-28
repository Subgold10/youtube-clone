import express from 'express';
import Video from '../models/Video.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar');
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new video
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration, category, tags } = req.body;

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      category,
      tags,
      uploader: req.user._id
    });

    await video.save();
    await video.populate('uploader', 'username avatar');

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike video
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;
    const isLiked = video.likes.includes(userId);

    if (isLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId); // Remove from dislikes if present
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dislike/Undislike video
router.post('/:id/dislike', authenticateToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id;
    const isDisliked = video.dislikes.includes(userId);

    if (isDisliked) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId); // Remove from likes if present
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;