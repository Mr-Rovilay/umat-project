import NewsPost from '../models/NewsPost.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { unlink } from 'fs/promises';

// Configure Cloudinary (replace with your credentials)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Admin: Create a news post
export const createNewsPost = async (req, res) => {
  try {
    const { title, content, department, allowLikes, allowComments, allowReactions } = req.body;
    const files = req.files;

    // Validate required fields
    if (!title || !content || !department) {
      return res.status(400).json({ message: 'Title, content, and department are required' });
    }
    if (!mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    // Upload images to Cloudinary if provided
    let images = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map(file =>
        cloudinary.v2.uploader.upload(file.path, { folder: 'news_posts' })
      );
      const results = await Promise.all(uploadPromises);
      images = results.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

      // Clean up local files
      await Promise.all(files.map(file => unlink(file.path)));
    }

    // Create post
    const post = await NewsPost.create({
      title,
      content,
      department,
      postedBy: req.user._id,
      allowLikes: allowLikes !== undefined ? allowLikes : true,
      allowComments: allowComments !== undefined ? allowComments : true,
      allowReactions: allowReactions !== undefined ? allowReactions : true,
      images,
    });

    const populatedPost = await NewsPost.findById(post._id)
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName');

    res.status(201).json({ message: 'News post created successfully', post: populatedPost });
  } catch (error) {
    console.error('Create News Post Error:', error);
    res.status(500).json({ message: 'Server error while creating news post' });
  }
};

// Get news posts by department
export const getNewsPosts = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department || !mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Valid department ID is required' });
    }

    const posts = await NewsPost.find({ department })
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('reactions.user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Get News Posts Error:', error);
    res.status(500).json({ message: 'Server error while fetching news posts' });
  }
};

// Student: Like a news post
export const likeNewsPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await NewsPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'News post not found' });
    }
    if (!post.allowLikes) {
      return res.status(403).json({ message: 'Likes are not allowed for this post' });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    const populatedPost = await NewsPost.findById(id)
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('reactions.user', 'firstName lastName');

    res.status(200).json({ message: 'Like updated successfully', post: populatedPost });
  } catch (error) {
    console.error('Like News Post Error:', error);
    res.status(500).json({ message: 'Server error while liking news post' });
  }
};

// Student: Comment on a news post
export const commentNewsPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await NewsPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'News post not found' });
    }
    if (!post.allowComments) {
      return res.status(403).json({ message: 'Comments are not allowed for this post' });
    }

    post.comments.push({ user: req.user._id, content });
    await post.save();

    const populatedPost = await NewsPost.findById(id)
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('reactions.user', 'firstName lastName');

    res.status(200).json({ message: 'Comment added successfully', post: populatedPost });
  } catch (error) {
    console.error('Comment News Post Error:', error);
    res.status(500).json({ message: 'Server error while commenting on news post' });
  }
};

// Student: React to a news post
export const reactNewsPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!type || !['smile', 'heart', 'thumbsUp', 'wow', 'sad'].includes(type)) {
      return res.status(400).json({ message: 'Valid reaction type is required' });
    }

    const post = await NewsPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'News post not found' });
    }
    if (!post.allowReactions) {
      return res.status(403).json({ message: 'Reactions are not allowed for this post' });
    }

    // Remove existing reaction by the user, if any
    post.reactions = post.reactions.filter(r => r.user.toString() !== req.user._id.toString());
    post.reactions.push({ user: req.user._id, type });
    await post.save();

    const populatedPost = await NewsPost.findById(id)
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('reactions.user', 'firstName lastName');

    res.status(200).json({ message: 'Reaction added successfully', post: populatedPost });
  } catch (error) {
    console.error('React News Post Error:', error);
    res.status(500).json({ message: 'Server error while reacting to news post' });
  }
};