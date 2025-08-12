import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Smile,
  Clock,
  User,
  Building,
  BookOpen,
  ArrowLeft,
  Loader2,
  X,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchNewsPosts,
  likeNewsPost,
  commentNewsPost,
  reactNewsPost,
  deleteNewsPost,
} from "@/redux/slice/newsSlice";
import { getAllDepartments } from "@/redux/slice/departmentSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const News = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth || { user: null, isAuthenticated: false }
  );
  const { newsPosts, isLoading, error } = useSelector(
    (state) => state.news || { newsPosts: [], isLoading: false, error: null }
  );
  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments || { departments: [], isLoading: false }
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(
      fetchNewsPosts({
        department:
          selectedDepartment !== "all" ? selectedDepartment : undefined,
      })
    );
    dispatch(getAllDepartments());
  }, [dispatch, selectedDepartment]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredNewsPosts = useMemo(() => {
    return newsPosts.filter((post) => {
      const isInMyDepartment = user?.department?._id === post.department?._id;
      const searchLower = searchQuery.toLowerCase();

      return (
        (selectedDepartment === "all" ||
          post.department?._id === selectedDepartment) &&
        (activeTab === "all" ||
          (activeTab === "my-department" && isInMyDepartment)) &&
        (searchQuery === "" ||
          post.title?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.department?.name.toLowerCase().includes(searchLower) ||
          `${post.postedBy?.firstName} ${post.postedBy?.lastName}`
            .toLowerCase()
            .includes(searchLower))
      );
    });
  }, [newsPosts, selectedDepartment, activeTab, user, searchQuery]);

  const availableDepartments = useMemo(() => {
    if (user?.role === "student" && user.department) {
      return departments.filter((dept) => dept._id === user.department._id);
    }
    return departments;
  }, [departments, user]);

  const handleEditPost = useCallback(
    (postId) => {
      navigate(`/news/edit/${postId}`);
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (postToDelete) {
      try {
        await dispatch(deleteNewsPost(postToDelete._id)).unwrap();
        toast.success("News post deleted successfully");
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      } catch (error) {
        toast.error("Failed to delete news post");
      }
    }
  }, [dispatch, postToDelete]);

  const handleLike = useCallback(
    async (postId) => {
      if (!isAuthenticated || user?.role !== "student") {
        toast.error("Please log in as a student to like posts");
        return;
      }
      try {
        await dispatch(likeNewsPost(postId)).unwrap();
        toast.success("Post liked!");
      } catch (error) {
        toast.error("Failed to like post");
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const handleReaction = useCallback(
    async (postId, type) => {
      if (!isAuthenticated || user?.role !== "student") {
        toast.error("Please log in as a student to react to posts");
        return;
      }
      try {
        await dispatch(reactNewsPost({ id: postId, type })).unwrap();
        toast.success("Reaction added!");
      } catch (error) {
        toast.error("Failed to add reaction");
      }
    },
    [dispatch, isAuthenticated, user]
  );

  const handleComment = useCallback(
    async (postId) => {
      if (!isAuthenticated || user?.role !== "student") {
        toast.error("Please log in as a student to comment");
        return;
      }
      const content = commentInputs[postId]?.trim();
      if (!content) {
        toast.error("Comment cannot be empty");
        return;
      }
      try {
        await dispatch(commentNewsPost({ id: postId, content })).unwrap();
        toast.success("Comment posted!");
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        setShowComments((prev) => ({ ...prev, [postId]: true }));
      } catch (error) {
        toast.error("Failed to post comment");
      }
    },
    [dispatch, isAuthenticated, user, commentInputs]
  );

  const toggleComments = useCallback((postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const openPostDialog = useCallback((post) => {
    setSelectedPost(post);
    setShowComments((prev) => ({ ...prev, [post._id]: true }));
  }, []);

  const closePostDialog = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const getReactionIcon = useCallback((type) => {
    switch (type) {
      case "smile":
        return <Smile className="h-4 w-4" />;
      case "heart":
        return <Heart className="h-4 w-4" />;
      case "thumbsUp":
        return <span className="text-lg">👍</span>;
      case "wow":
        return <span className="text-lg">😮</span>;
      case "sad":
        return <span className="text-lg">😢</span>;
      default:
        return <Smile className="h-4 w-4" />;
    }
  }, []);

  const getReactionCounts = useCallback((reactions) => {
    const counts = {};
    reactions?.forEach((reaction) => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    return counts;
  }, []);

  const getUserReaction = useCallback(
    (reactions) => {
      return reactions?.find((r) => r.user?._id === user?._id)?.type;
    },
    [user]
  );

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // const canManagePost = useCallback((post) => {
  //   if (!user || user.role !== 'admin') return false;
  //   return user.departments?.some(dept => dept._id === post.department?._id);
  // }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Departmental News
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
            Stay updated with the latest news and announcements from your
            department
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(
              user?.role === "admin" ? "/dashboard" : "/student/dashboard"
            )
          }
          className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Dashboard
        </Button>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search news by title, content, department, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  aria-label="Search news"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={activeTab === "my-department" || departmentsLoading}
                aria-label="Filter by department"
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => {
                    setActiveTab("all");
                    setSelectedDepartment("all");
                  }}
                  className={cn(
                    activeTab === "all" && "bg-emerald-600 hover:bg-emerald-700"
                  )}
                  aria-label="View all news"
                >
                  All News
                </Button>
                <Button
                  variant={
                    activeTab === "my-department" ? "default" : "outline"
                  }
                  onClick={() => setActiveTab("my-department")}
                  className={cn(
                    activeTab === "my-department" &&
                      "bg-emerald-600 hover:bg-emerald-700"
                  )}
                  disabled={!isAuthenticated || user?.role !== "student"}
                  aria-label="View my department news"
                >
                  My Department
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2
              className="h-8 w-8 animate-spin text-emerald-600"
              aria-label="Loading news"
            />
          </div>
        ) : filteredNewsPosts.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center py-12">
              <BookOpen
                className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-lg font-medium">No news found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {searchQuery ||
                selectedDepartment !== "all" ||
                activeTab !== "all"
                  ? "No news matches your filters. Try adjusting your search or filters."
                  : "No news posts are available at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredNewsPosts.length} news post
                {filteredNewsPosts.length !== 1 ? "s" : ""}
              </p>
              {selectedDepartment !== "all" && (
                <Badge
                  variant="outline"
                  className="text-emerald-700 dark:text-emerald-300"
                >
                  {departments.find((d) => d._id === selectedDepartment)
                    ?.name || "Selected Department"}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNewsPosts.map((post) => (
                <Card
                  key={post._id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openPostDialog(post)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openPostDialog(post)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Building
                              className="h-4 w-4 mr-1"
                              aria-hidden="true"
                            />
                            <span>{post.department?.name || "University"}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock
                              className="h-4 w-4 mr-1"
                              aria-hidden="true"
                            />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {user?.role === "admin" && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(post._id);
                            }}
                            aria-label={`Edit post: ${post.title}`}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(post);
                            }}
                            aria-label={`Delete post: ${post.title}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {post.images?.[0] && (
                      <img
                        src={post.images[0].url}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        loading="lazy"
                      />
                    )}
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-4">
                        {post.allowLikes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post._id);
                            }}
                            className={cn(
                              post.likes?.includes(user?._id) && "text-red-600"
                            )}
                            aria-label={`Like post: ${post.title}`}
                          >
                            <Heart
                              className="h-4 w-4 mr-1"
                              fill={
                                post.likes?.includes(user?._id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span>{post.likes?.length || 0}</span>
                          </Button>
                        )}
                        {post.allowComments && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComments(post._id);
                            }}
                            className="text-gray-600"
                            aria-label={`View comments for post: ${post.title}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{post.comments?.length || 0}</span>
                          </Button>
                        )}
                        {post.allowReactions && (
                          <div className="flex gap-1">
                            {Object.entries(
                              getReactionCounts(post.reactions)
                            ).map(([type, count]) => (
                              <Button
                                key={type}
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(post._id, type);
                                }}
                                className={cn(
                                  getUserReaction(post.reactions) === type &&
                                    "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                                )}
                                aria-label={`React ${type} to post: ${post.title}`}
                              >
                                {getReactionIcon(type)}
                                <span className="text-xs ml-1">{count}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <User
                          className="h-4 w-4 text-emerald-600"
                          aria-hidden="true"
                        />
                        <span className="text-sm">
                          {post.postedBy?.firstName} {post.postedBy?.lastName}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Dialog open={!!selectedPost} onOpenChange={closePostDialog}>
          {selectedPost && (
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1" aria-hidden="true" />
                    {selectedPost.department?.name || "University"}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                    {formatDate(selectedPost.createdAt)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] pr-4">
                {selectedPost.images?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {selectedPost.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${selectedPost.title} - Image ${index + 1}`}
                        className="w-full h-auto max-h-96 object-contain rounded-lg"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
                <div className="prose dark:prose-invert mb-6">
                  {selectedPost.content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    {selectedPost.allowLikes && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedPost._id)}
                        className={cn(
                          selectedPost.likes?.includes(user?._id) &&
                            "text-red-600"
                        )}
                        aria-label={`Like post: ${selectedPost.title}`}
                      >
                        <Heart
                          className="h-4 w-4 mr-1"
                          fill={
                            selectedPost.likes?.includes(user?._id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                        <span>{selectedPost.likes?.length || 0}</span>
                      </Button>
                    )}
                    {selectedPost.allowComments && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(selectedPost._id)}
                        className="text-gray-600"
                        aria-label={`View comments for post: ${selectedPost.title}`}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{selectedPost.comments?.length || 0}</span>
                      </Button>
                    )}
                    {selectedPost.allowReactions && (
                      <div className="flex gap-1">
                        {Object.entries(
                          getReactionCounts(selectedPost.reactions)
                        ).map(([type, count]) => (
                          <Button
                            key={type}
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleReaction(selectedPost._id, type)
                            }
                            className={cn(
                              getUserReaction(selectedPost.reactions) ===
                                type &&
                                "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                            )}
                            aria-label={`React ${type} to post: ${selectedPost.title}`}
                          >
                            {getReactionIcon(type)}
                            <span className="text-xs ml-1">{count}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <User
                      className="h-4 w-4 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>
                      {selectedPost.postedBy?.firstName}{" "}
                      {selectedPost.postedBy?.lastName}
                    </span>
                  </div>
                </div>
                {showComments[selectedPost._id] &&
                  selectedPost.allowComments && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={commentInputs[selectedPost._id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [selectedPost._id]: e.target.value,
                            }))
                          }
                          placeholder="Add a comment..."
                          className="flex-1"
                          aria-label="Comment input"
                        />
                        <Button
                          onClick={() => handleComment(selectedPost._id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          aria-label="Post comment"
                        >
                          Post
                        </Button>
                      </div>
                      <ScrollArea className="max-h-60 pr-4">
                        {selectedPost.comments?.length > 0 ? (
                          selectedPost.comments.map((comment) => (
                            <div
                              key={comment._id}
                              className="bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-lg mb-2"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">
                                    {comment.user?.firstName}{" "}
                                    {comment.user?.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(comment.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2">{comment.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-2">
                            No comments yet. Be the first to comment!
                          </p>
                        )}
                      </ScrollArea>
                    </div>
                  )}
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={closePostDialog}
                  aria-label="Close dialog"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete News Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{postToDelete?.title}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel aria-label="Cancel">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                aria-label="Confirm delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default News;
