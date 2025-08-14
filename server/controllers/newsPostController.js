// controllers/newsPostController.js
import NewsPost from '../models/NewsPost.js';
import Department from '../models/Department.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { unlink } from 'fs/promises';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to check if admin is authorized for a department
const isDepartmentAdmin = async (adminId, departmentId) => {
  try {
    const department = await Department.findById(departmentId);
    if (!department) return false;
    
    // Check if the user is an admin for this department
    return department.admins.includes(adminId);
  } catch (error) {
    console.error('Error checking department admin:', error);
    return false;
  }
};

// Admin: Create a news post
export const createNewsPost = async (req, res) => {
  try {
    const { title, content, department, allowLikes, allowComments, allowReactions } = req.body;
    const files = req.files;
    
    if (!title || !content || !department) {
      return res.status(400).json({ message: 'Title, content, and department are required' });
    }
    
    if (!mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }
    
    // Check if department exists
    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if user is authorized for this department
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create news posts' });
    }
    
    const isAuthorized = await isDepartmentAdmin(req.user._id, department);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'You are not authorized to create posts for this department' });
    }
    
    let images = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => cloudinary.v2.uploader.upload(file.path, { folder: 'news_posts' }));
      const results = await Promise.all(uploadPromises);
      images = results.map(result => ({ url: result.secure_url, publicId: result.public_id }));
      await Promise.all(files.map(file => unlink(file.path)));
    }
    
    // Convert string boolean values to actual booleans
    const allowLikesBool = allowLikes === 'true' ? true : allowLikes === 'false' ? false : true;
    const allowCommentsBool = allowComments === 'true' ? true : allowComments === 'false' ? false : true;
    const allowReactionsBool = allowReactions === 'true' ? true : allowReactions === 'false' ? false : true;
    
    const post = await NewsPost.create({
      title,
      content,
      department,
      postedBy: req.user._id,
      allowLikes: allowLikesBool,
      allowComments: allowCommentsBool,
      allowReactions: allowReactionsBool,
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

// controllers/newsPostController.js

// Get news posts by department or all posts
export const getNewsPosts = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};
    
    // If user is admin, only show posts from their departments
    if (req.user.role === 'admin') {
      // Get all departments the admin is authorized for
      const adminDepartments = await Department.find({ admins: req.user._id });
      const departmentIds = adminDepartments.map(dept => dept._id);
      
      if (departmentIds.length === 0) {
        return res.status(200).json({ posts: [] });
      }
      
      // If no specific department is requested, show all departments the admin has access to
      if (!department || department === 'all') {
        query.department = { $in: departmentIds };
      } else {
        // If a specific department is requested, check if admin has access to it
        if (!mongoose.isValidObjectId(department)) {
          return res.status(400).json({ message: 'Invalid department ID' });
        }
        
        const hasAccess = departmentIds.some(id => id.toString() === department);
        if (!hasAccess) {
          return res.status(403).json({ message: 'You are not authorized to view posts from this department' });
        }
        
        query.department = department;
      }
    } 
    // For students
    else if (req.user.role === 'student') {
      // If no specific department is requested, show all posts (student can view any department)
      if (!department || department === 'all') {
        // Don't filter by department, show all posts
      } else {
        // If a specific department is requested
        if (!mongoose.isValidObjectId(department)) {
          return res.status(400).json({ message: 'Invalid department ID' });
        }
        
        query.department = department;
      }
    }
    // For other roles (if any)
    else {
      if (department && department !== 'all') {
        if (!mongoose.isValidObjectId(department)) {
          return res.status(400).json({ message: 'Invalid department ID' });
        }
        query.department = department;
      }
    }
    
    const posts = await NewsPost.find(query)
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
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post ID' });
    
    const post = await NewsPost.findById(id);
    if (!post) return res.status(404).json({ message: 'News post not found' });
    if (!post.allowLikes) return res.status(403).json({ message: 'Likes are not allowed for this post' });
    
    post.likes = post.likes.includes(req.user._id)
      ? post.likes.filter(userId => userId.toString() !== req.user._id.toString())
      : [...post.likes, req.user._id];
      
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
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post ID' });
    if (!content) return res.status(400).json({ message: 'Comment content is required' });
    
    const post = await NewsPost.findById(id);
    if (!post) return res.status(404).json({ message: 'News post not found' });
    if (!post.allowComments) return res.status(403).json({ message: 'Comments are not allowed for this post' });
    
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
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post ID' });
    if (!type || !['smile', 'heart', 'thumbsUp', 'wow', 'sad'].includes(type)) {
      return res.status(400).json({ message: 'Valid reaction type is required' });
    }
    
    const post = await NewsPost.findById(id);
    if (!post) return res.status(404).json({ message: 'News post not found' });
    if (!post.allowReactions) return res.status(403).json({ message: 'Reactions are not allowed for this post' });
    
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

// Admin: Edit a news post
export const editNewsPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, department, allowLikes, allowComments, allowReactions, removeImages } = req.body;
    const files = req.files;
    
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post ID' });
    
    const post = await NewsPost.findById(id);
    if (!post) return res.status(404).json({ message: 'News post not found' });
    
    // Check if user is authorized to edit this post
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can edit news posts' });
    }
    
    // Check if user is authorized for the current department of the post
    const isCurrentDepartmentAuthorized = await isDepartmentAdmin(req.user._id, post.department);
    if (!isCurrentDepartmentAuthorized) {
      return res.status(403).json({ message: 'You are not authorized to edit posts from this department' });
    }
    
    // If changing department, check if user is authorized for the new department
    if (department && department !== post.department.toString()) {
      if (!mongoose.isValidObjectId(department)) {
        return res.status(400).json({ message: 'Invalid department ID' });
      }
      
      const isNewDepartmentAuthorized = await isDepartmentAdmin(req.user._id, department);
      if (!isNewDepartmentAuthorized) {
        return res.status(403).json({ message: 'You are not authorized to edit posts for the new department' });
      }
    }
    
    let images = post.images;
    if (removeImages?.length > 0) {
      await Promise.all(removeImages.map(publicId => cloudinary.v2.uploader.destroy(publicId)));
      images = images.filter(img => !removeImages.includes(img.publicId));
    }
    
    if (files?.length > 0) {
      const uploadPromises = files.map(file => cloudinary.v2.uploader.upload(file.path, { folder: 'news_posts' }));
      const results = await Promise.all(uploadPromises);
      images = [...images, ...results.map(result => ({ url: result.secure_url, publicId: result.public_id }))];
      await Promise.all(files.map(file => unlink(file.path)));
    }
    
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.department = department ?? post.department;
    post.allowLikes = allowLikes === 'true' ? true : allowLikes === 'false' ? false : post.allowLikes;
    post.allowComments = allowComments === 'true' ? true : allowComments === 'false' ? false : post.allowComments;
    post.allowReactions = allowReactions === 'true' ? true : allowReactions === 'false' ? false : post.allowReactions;
    post.images = images;
    
    await post.save();
    
    const populatedPost = await NewsPost.findById(id)
      .populate('department', 'name')
      .populate('postedBy', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
      .populate('reactions.user', 'firstName lastName');
      
    res.status(200).json({ message: 'News post updated successfully', post: populatedPost });
  } catch (error) {
    console.error('Edit News Post Error:', error);
    res.status(500).json({ message: 'Server error while updating news post' });
  }
};

// Admin: Delete a news post
export const deleteNewsPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post ID' });
    
    const post = await NewsPost.findById(id);
    if (!post) return res.status(404).json({ message: 'News post not found' });
    
    // Check if user is authorized to delete this post
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete news posts' });
    }
    
    // Check if user is authorized for the department of this post
    const isAuthorized = await isDepartmentAdmin(req.user._id, post.department);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'You are not authorized to delete posts from this department' });
    }
    
    // Delete images from cloudinary
    if (post.images.length > 0) {
      await Promise.all(post.images.map(img => cloudinary.v2.uploader.destroy(img.publicId)));
    }
    
    await NewsPost.findByIdAndDelete(id);
    res.status(200).json({ message: 'News post deleted successfully' });
  } catch (error) {
    console.error('Delete News Post Error:', error);
    res.status(500).json({ message: 'Server error while deleting news post' });
  }
};