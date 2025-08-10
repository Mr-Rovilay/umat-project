import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { clearError, fetchNewsPosts } from "@/redux/slice/newsSlice";
import { getAllDepartments } from "@/redux/slice/departmentSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Building,
  Plus,
  Loader2,
  AlertCircle,
  Heart,
  MessageCircle,
  ThumbsUp,
  Smile,
  Frown,
  Edit,
  Trash,
  X,
  Send,
} from "lucide-react";
import {
  commentNewsPost,
  deleteNewsPost,
  likeNewsPost,
  reactNewsPost,
  createNewsPost,
} from "@/redux/slice/newsSlice";

// Create News Dialog Component
function CreateNewsDialog({ departments }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      allowLikes: true,
      allowComments: true,
      allowReactions: true,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(createNewsPost(data));
      if (createNewsPost.fulfilled.match(result)) {
        toast.success("News post created successfully");
        reset();
        setOpen(false);
        dispatch(fetchNewsPosts({}));
      } else {
        toast.error(result.payload || "Failed to create news post");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Create News Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <FileText className="mr-2 h-6 w-6 text-emerald-600" />
            Create News Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter news post title"
              className="mt-2"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              {...register("content", { required: "Content is required" })}
              rows={6}
              placeholder="Write your news content here..."
              className="mt-2"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="department">Department *</Label>
            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="allowLikes"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="allowLikes"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="allowLikes" className="text-sm">
                Allow Likes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="allowComments"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="allowComments"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="allowComments" className="text-sm">
                Allow Comments
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="allowReactions"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="allowReactions"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="allowReactions" className="text-sm">
                Allow Reactions
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// News Post Detail Dialog Component
function NewsPostDetailDialog({ post, open, onOpenChange }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset } = useForm();
  const [showComments, setShowComments] = useState(false);

  if (!post) return null;

  const isAdmin = user?.role === "admin";
  const isPoster = post.postedBy._id === user?._id;
  const canEditOrDelete = isAdmin || isPoster;
  const hasLiked = post.likes.some((id) => id.toString() === user?._id);
  const userReaction = post.reactions.find((r) => r.user._id === user?._id);

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
      onOpenChange(false);
    } else {
      toast.error(res.payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{post.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              {canEditOrDelete && (
                <>
                  <Button variant="ghost" size="sm">
                    <Edit size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDelete}>
                    <Trash size={20} className="text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Posted by {post.postedBy.firstName} {post.postedBy.lastName} in{" "}
            {post.department.name} on{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img) => (
                <img
                  key={img.publicId}
                  src={img.url}
                  alt={`News image for ${post.title}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.content}
            </p>
          </div>

          <div className="flex items-center space-x-6 pt-4 border-t dark:border-gray-700">
            {post.allowLikes && (
              <Button
                variant="ghost"
                onClick={handleLike}
                className={hasLiked ? "text-red-600" : "text-gray-600"}
              >
                <Heart
                  size={20}
                  fill={hasLiked ? "currentColor" : "none"}
                  className="mr-2"
                />
                {post.likes.length}
              </Button>
            )}

            {post.allowComments && (
              <Button
                variant="ghost"
                onClick={() => setShowComments(!showComments)}
                className="text-gray-600"
              >
                <MessageCircle size={20} className="mr-2" />
                {post.comments.length}
              </Button>
            )}

            {post.allowReactions && (
              <div className="flex items-center space-x-2">
                {[
                  { type: "smile", icon: <Smile size={20} /> },
                  { type: "heart", icon: <Heart size={20} /> },
                  { type: "thumbsUp", icon: <ThumbsUp size={20} /> },
                  { type: "wow", icon: <span>😮</span> },
                  { type: "sad", icon: <Frown size={20} /> },
                ].map(({ type, icon }) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(type)}
                    className={
                      userReaction?.type === type
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {showComments && post.allowComments && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              <form
                onSubmit={handleSubmit(handleComment)}
                className="flex space-x-3"
              >
                <Input
                  {...register("content", { required: "Comment is required" })}
                  placeholder="Add a comment..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send size={16} />
                </Button>
              </form>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {post.comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">
                        {c.user.firstName} {c.user.lastName}
                      </span>
                      <span className="ml-2">{c.content}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Updated NewsPostCard Component
function NewsPostCard({ post }) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow border-emerald-200 dark:border-emerald-800"
        onClick={() => setDetailOpen(true)}
      >
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            <Badge variant="outline" className="ml-2 flex-shrink-0">
              {post.department.name}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {post.images && post.images.length > 0 && (
            <div className="relative">
              <img
                src={post.images[0].url}
                alt={`News image for ${post.title}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              {post.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  +{post.images.length - 1} more
                </div>
              )}
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-300 line-clamp-1">
            {post.content}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              By {post.postedBy.firstName} {post.postedBy.lastName}
            </div>
            <div>{new Date(post.createdAt).toLocaleDateString()}</div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {post.allowLikes && (
              <div className="flex items-center space-x-1">
                <Heart size={16} />
                <span>{post.likes.length}</span>
              </div>
            )}
            {post.allowComments && (
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{post.comments.length}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <NewsPostDetailDialog
        post={post}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}

// Main News Component
function News() {
  const dispatch = useDispatch();
  const {
    newsPosts,
    isLoading: newsLoading,
    error,
  } = useSelector(
    (state) => state.news || { newsPosts: [], isLoading: false, error: null }
  );
  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments || { departments: [], isLoading: false }
  );
  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      department: "all",
    },
  });

  const department = watch("department");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (department === "all") {
      dispatch(fetchNewsPosts({}));
    } else if (department) {
      dispatch(fetchNewsPosts({ department }));
    }
  }, [department, dispatch]);

  if (departmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Loading departments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            University News
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest news and announcements from our
            university community
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Posts</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {newsPosts.length}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Departments</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Building className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {departments.length}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Academic departments
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Now</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {
                  newsPosts.filter((post) => {
                    const postDate = new Date(post.createdAt);
                    const now = new Date();
                    const diffTime = Math.abs(now - postDate);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                  }).length
                }
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Latest News
                </CardTitle>
                <CardDescription>
                  Browse news and announcements from university departments
                </CardDescription>
              </div>
              {user?.role === "admin" && (
                <div className="mt-4 md:mt-0">
                  <CreateNewsDialog departments={departments} />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
              >
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Department Filter */}
            <div className="mb-6">
              <Label
                htmlFor="department-filter"
                className="flex items-center mb-4"
              >
                <Building className="mr-2 h-4 w-4 text-emerald-500" />
                Filter by Department
              </Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full md:w-1/3 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Content */}
            {newsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                <p className="text-gray-700 dark:text-gray-300">
                  Loading news posts...
                </p>
              </div>
            ) : newsPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  No news posts available
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {department === "all"
                    ? "There are no news posts yet"
                    : "There are no news posts for this department yet"}
                </p>
                {user?.role === "admin" && (
                  <div className="mt-4">
                    <CreateNewsDialog departments={departments} />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {newsPosts.length} news post
                    {newsPosts.length !== 1 ? "s" : ""}
                  </p>
                  {department && department !== "all" && (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                    >
                      {departments.find((d) => d._id === department)?.name}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsPosts.map((post) => (
                    <NewsPostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default News;
