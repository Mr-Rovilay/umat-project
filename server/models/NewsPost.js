import mongoose from 'mongoose';

const newsPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String }, // For Cloudinary
      },
    ],
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    allowLikes: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowReactions: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, enum: ['smile', 'heart', 'thumbsUp', 'wow', 'sad'], required: true },
      },
    ],
  },
  { timestamps: true }
);

const NewsPost = mongoose.model('NewsPost', newsPostSchema);
export default NewsPost;