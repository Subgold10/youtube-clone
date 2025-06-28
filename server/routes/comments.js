import express from 'express';
import Comment from '../models/Comment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('author', 'username avatar')
      .populate('replies.author', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, videoId } = req.body;

    const comment = new Comment({
      content,
      video: videoId,
      author: req.user._id
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike comment
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add reply to comment
router.post('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      content,
      author: req.user._id
    });

    await comment.save();
    await comment.populate('replies.author', 'username avatar');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;