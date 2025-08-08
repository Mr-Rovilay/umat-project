import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, ThumbsUp, Smile, Frown, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  commentNewsPost,
  deleteNewsPost,
  likeNewsPost,
  reactNewsPost,
} from "@/redux/slice/newsSlice";

function NewsPostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset } = useForm();
  const [showComments, setShowComments] = useState(false);

  const isAdmin = user?.role === "admin";
  const isPoster = post.postedBy._id === user?._id;
  const canEditOrDelete = isAdmin || isPoster;
  const hasLiked = post.likes.some((id) => id.toString() === user?._id);
  const userReaction = post.reactions.find((r) => r.user._id === user?._id);

  // --- Handlers ---
  const handleLike = async () => {
    const res = await dispatch(likeNewsPost(post._id));
    if (likeNewsPost.rejected.match(res)) toast.error(res.payload);
  };

  const handleReaction = async (type) => {
    const res = await dispatch(reactNewsPost({ id: post._id, type }));
    if (reactNewsPost.rejected.match(res)) toast.error(res.payload);
  };

  const handleComment = async (data) => {
    const res = await dispatch(
      commentNewsPost({ id: post._id, content: data.content })
    );
    if (commentNewsPost.fulfilled.match(res)) {
      reset();
      setShowComments(true);
    } else {
      toast.error(res.payload);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this news post?")) return;
    const res = await dispatch(deleteNewsPost(post._id));
    if (deleteNewsPost.fulfilled.match(res)) {
      toast.success("News post deleted successfully");
    } else {
      toast.error(res.payload);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow space-y-4">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {post.title}
        </h3>
        {canEditOrDelete && (
          <div className="flex space-x-2">
            <Link
              to={`/news/edit/${post._id}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
            >
              <Edit size={20} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
            >
              <Trash size={20} />
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      <p className="text-gray-600 dark:text-gray-300">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {post.images.map((img) => (
            <img
              key={img.publicId}
              src={img.url}
              alt={`News image for ${post.title}`}
              className="w-full h-48 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Meta */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Posted by {post.postedBy.firstName} {post.postedBy.lastName} in{" "}
        {post.department.name} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Actions */}
      <div className="flex space-x-4">
        {post.allowLikes && (
          <ActionButton
            onClick={handleLike}
            active={hasLiked}
            count={post.likes.length}
            icon={<Heart size={20} fill={hasLiked ? "currentColor" : "none"} />}
          />
        )}

        {post.allowComments && (
          <ActionButton
            onClick={() => setShowComments(!showComments)}
            count={post.comments.length}
            icon={<MessageCircle size={20} />}
          />
        )}

        {post.allowReactions && (
          <div className="flex space-x-2">
            {[
              { type: "smile", icon: <Smile size={20} /> },
              { type: "heart", icon: <Heart size={20} /> },
              { type: "thumbsUp", icon: <ThumbsUp size={20} /> },
              { type: "wow", icon: <span>😮</span> },
              { type: "sad", icon: <Frown size={20} /> },
            ].map(({ type, icon }) => (
              <ReactionButton
                key={type}
                type={type}
                icon={icon}
                active={userReaction?.type === type}
                onReact={handleReaction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Comments */}
      {showComments && post.allowComments && (
        <CommentsSection
          comments={post.comments}
          onSubmit={handleSubmit(handleComment)}
          register={register}
        />
      )}
    </article>
  );
}

// --- Subcomponents ---
const ActionButton = ({ onClick, icon, count, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-1 ${
      active ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
    }`}
  >
    {icon}
    {typeof count === "number" && <span>{count}</span>}
  </button>
);

const ReactionButton = ({ type, icon, active, onReact }) => (
  <button
    onClick={() => onReact(type)}
    className={`${
      active ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
    }`}
    aria-label={`React with ${type}`}
  >
    {icon}
  </button>
);

const CommentsSection = ({ comments, onSubmit, register }) => (
  <section className="mt-4 space-y-4">
    <form onSubmit={onSubmit} className="flex space-x-2">
      <input
        {...register("content", { required: "Comment is required" })}
        className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="Add a comment..."
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Post
      </button>
    </form>

    <div className="space-y-2">
      {comments.map((c) => (
        <div
          key={c._id}
          className="bg-gray-100 dark:bg-gray-800 p-2 rounded"
        >
          <p className="text-gray-700 dark:text-gray-300">
            <strong>
              {c.user.firstName} {c.user.lastName}
            </strong>
            : {c.content}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(c.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default NewsPostCard;
