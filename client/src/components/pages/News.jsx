import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Smile, 
  Clock, 
  User, 
  Building,
  BookOpen,
  ArrowLeft,
  Loader2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchNewsPosts, likeNewsPost, commentNewsPost, reactNewsPost } from '@/redux/slice/newsSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const News = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { newsPosts, isLoading, error } = useSelector((state) => state.news || { newsPosts: [], isLoading: false, error: null });
  const { departments } = useSelector((state) => state.departments || { departments: [], isLoading: false });
  
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchNewsPosts({}));
    dispatch(getAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Memoized filtered news posts for better performance
  const filteredNewsPosts = useMemo(() => {
    return newsPosts.filter(post => {
      // Apply department filter
      if (selectedDepartment !== 'all' && post.department?._id !== selectedDepartment) {
        return false;
      }
      
      // Apply my-department tab filter
      if (activeTab === 'my-department' && user?.role === 'student') {
        const isInMyDepartment = user.department?.some(dept => dept._id === post.department?._id);
        if (!isInMyDepartment) return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          post.title?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower) ||
          post.department?.name.toLowerCase().includes(searchLower) ||
          `${post.postedBy?.firstName} ${post.postedBy?.lastName}`.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [newsPosts, selectedDepartment, activeTab, user, searchQuery]);

  const availableDepartments = useMemo(() => {
    if (user?.role === 'student' && user.department) {
      return departments.filter(dept => 
        user.department.some(userDept => userDept._id === dept._id)
      );
    }
    return departments;
  }, [departments, user]);

  const handleLike = async (postId) => {
    if (!user || user.role !== 'student') {
      toast.error('Please log in to like posts as student');
      return;
    }
    await dispatch(likeNewsPost(postId));
  };

  const handleReaction = async (postId, type) => {
    if (!user || user.role !== 'student') {
      toast.error('Please log in to react to posts as student');
      return;
    }
    await dispatch(reactNewsPost({ id: postId, type }));
  };

  const handleComment = async (postId) => {
    if (!user || user.role !== 'student') {
      toast.error('Please log in to comment as student');
      return;
    }
    
    const content = commentInputs[postId];
    if (!content || !content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    await dispatch(commentNewsPost({ id: postId, content }));
    
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setShowComments(prev => ({ ...prev, [postId]: true }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Open dialog with full post content
  const openPostDialog = (post) => {
    setSelectedPost(post);
    // Show comments by default when opening the dialog
    setShowComments(prev => ({ ...prev, [post._id]: true }));
  };

  // Close dialog
  const closePostDialog = () => {
    setSelectedPost(null);
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case 'smile': return <Smile className="h-4 w-4" />;
      case 'heart': return <Heart className="h-4 w-4" />;
      case 'thumbsUp': return <span className="text-lg">👍</span>;
      case 'wow': return <span className="text-lg">😮</span>;
      case 'sad': return <span className="text-lg">😢</span>;
      default: return <Smile className="h-4 w-4" />;
    }
  };

  const getReactionCounts = (reactions) => {
    const counts = {};
    reactions?.forEach(reaction => {
      counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    return counts;
  };

  const getUserReaction = (reactions) => {
    return reactions?.find(r => r.user._id === user?._id)?.type;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            University News
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest news and announcements from your university
          </p>
        </div>

        {/* Back to Dashboard */}
        <Button
          onClick={() => navigate('/student/dashboard')}
          className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
      {/* Filters */}
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search news by title, content, department or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700 rounded-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Department Filter */}
            <div className="flex-1">
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
                disabled={activeTab === 'my-department'}
              >
                <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                  <SelectValue placeholder={
                    activeTab === 'my-department' ? 'My Department' : 'Filter by department'
                  } />
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
            </div>

            {/* View Tabs */}
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('all');
                  // Reset department filter when switching to all
                  setSelectedDepartment('all');
                }}
                className={activeTab === 'all' ? 'bg-emerald-600 text-white' : ''}
              >
                All News
              </Button>
              <Button
                variant={activeTab === 'my-department' ? 'default' : 'outline'}
                onClick={() => setActiveTab('my-department')}
                className={activeTab === 'my-department' ? 'bg-emerald-600 text-white' : ''}
                disabled={!user || user.role !== 'student'}
              >
                My Department
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


        {/* News Posts */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          </div>
        ) : filteredNewsPosts.length === 0 ? (
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No news found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                {searchQuery || selectedDepartment !== 'all' || activeTab !== 'all'
                  ? 'No news matches your search criteria. Try adjusting your filters.'
                  : 'There are no news posts available at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredNewsPosts.length} news post{filteredNewsPosts.length !== 1 ? 's' : ''}
              </p>
              {selectedDepartment !== 'all' && (
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  {departments.find(d => d._id === selectedDepartment)?.name || 'Selected Department'}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNewsPosts.map((post) => (
                <Card 
                  key={post._id} 
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => openPostDialog(post)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">{post.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span className='truncate'>{post.department?.name || 'University'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 flex-shrink-0 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300 truncate">
                        {post.department?.name || 'General'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image */}
                    {post.images && post.images.length > 0 && (
                      <div className="relative">
                        <img
                          src={post.images[0].url}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {post.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            +{post.images.length - 1} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Preview */}
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-1">
                      {post.content}
                    </p>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        {/* Likes */}
                        {post.allowLikes && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post._id);
                            }}
                            className={`flex items-center space-x-1 ${
                              post.likes?.includes(user?._id) ? 'text-red-600' : 'text-gray-600'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              fill={post.likes?.includes(user?._id) ? "currentColor" : "none"} 
                              className="h-4 w-4"
                            />
                            <span>{post.likes?.length || 0}</span>
                          </Button>
                        )}

                        {/* Comments */}
                        {post.allowComments && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComments(post._id);
                            }}
                            className="flex items-center space-x-1 text-gray-600"
                          >
                            <MessageCircle size={16} />
                            <span>{post.comments?.length || 0}</span>
                          </Button>
                        )}

                        {/* Reactions */}
                        {post.allowReactions && (
                          <div className="flex items-center space-x-1">
                            {Object.entries(getReactionCounts(post.reactions)).map(([type, count]) => (
                              <Button
                                key={type}
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(post._id, type);
                                }}
                                className={`p-1 h-8 w-8 rounded-full ${
                                  getUserReaction(post.reactions) === type 
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' 
                                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                {getReactionIcon(type)}
                                <span className="text-xs">{count}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Author */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.postedBy?.firstName} {post.postedBy?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Posted {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* News Post Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && closePostDialog()}>
          {selectedPost && (
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl">{selectedPost.title}</DialogTitle>
                    <DialogDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {selectedPost.department?.name || 'University'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(selectedPost.createdAt)}
                      </span>
                    </DialogDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={closePostDialog}
                    className="absolute right-4 top-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Images */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPost.images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={`${selectedPost.title} - ${index + 1}`}
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Content */}
                <div className="prose dark:prose-invert max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    {/* Likes */}
                    {selectedPost.allowLikes && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedPost._id)}
                        className={`flex items-center space-x-1 ${
                          selectedPost.likes?.includes(user?._id) ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        <Heart 
                          size={16} 
                          fill={selectedPost.likes?.includes(user?._id) ? "currentColor" : "none"} 
                          className="h-4 w-4"
                        />
                        <span>{selectedPost.likes?.length || 0}</span>
                      </Button>
                    )}

                    {/* Comments */}
                    {selectedPost.allowComments && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComments(selectedPost._id)}
                        className="flex items-center space-x-1 text-gray-600"
                      >
                        <MessageCircle size={16} />
                        <span>{selectedPost.comments?.length || 0}</span>
                      </Button>
                    )}

                    {/* Reactions */}
                    {selectedPost.allowReactions && (
                      <div className="flex items-center space-x-1">
                        {Object.entries(getReactionCounts(selectedPost.reactions)).map(([type, count]) => (
                          <Button
                            key={type}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReaction(selectedPost._id, type)}
                            className={`p-1 h-8 w-8 rounded-full ${
                              getUserReaction(selectedPost.reactions) === type 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' 
                                : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {getReactionIcon(type)}
                            <span className="text-xs">{count}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedPost.postedBy?.firstName} {selectedPost.postedBy?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Posted {formatDate(selectedPost.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[selectedPost._id] && selectedPost.allowComments && (
                  <div className="space-y-3 pt-3 border-t dark:border-gray-700">
                    {/* Comment Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={commentInputs[selectedPost._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [selectedPost._id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                      />
                      <Button
                        onClick={() => handleComment(selectedPost._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Post
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedPost.comments?.length > 0 ? (
                        selectedPost.comments.map((comment) => (
                          <div key={comment._id} className="bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {comment.user?.firstName} {comment.user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-2">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default News;