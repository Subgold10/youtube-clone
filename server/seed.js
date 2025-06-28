import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone');
    
    // Clear existing data
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123'
      }
    ]);

    // Create sample videos
    const videos = await Video.create([
      {
        title: 'Sample Video 1',
        description: 'This is a sample video description',
        videoUrl: 'https://example.com/video1.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
        duration: 300,
        uploader: users[0]._id,
        category: 'Technology'
      },
      {
        title: 'Sample Video 2',
        description: 'Another sample video description',
        videoUrl: 'https://example.com/video2.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        duration: 450,
        uploader: users[1]._id,
        category: 'Entertainment'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();