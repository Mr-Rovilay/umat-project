// components/CreateNewsPost.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { createNewsPost, editNewsPost, fetchNewsPosts } from '@/redux/slice/newsSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';

const CreateNewsPost = () => {
  const { id } = useParams(); // Get the post ID from URL params
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.departments || { departments: [] });
  const { newsPosts } = useSelector((state) => state.news || { newsPosts: [] });
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    allowLikes: true,
    allowComments: true,
    allowReactions: true,
  });
  
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    dispatch(getAllDepartments());
    
    // Check if we're in edit mode
    if (id) {
      setIsEditMode(true);
      const post = newsPosts.find(p => p._id === id);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          department: post.department?._id || '',
          allowLikes: post.allowLikes,
          allowComments: post.allowComments,
          allowReactions: post.allowReactions,
        });
        setExistingImages(post.images || []);
      }
    }
  }, [id, dispatch, newsPosts]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img._id !== imageId));
    setRemoveImages(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('department', formData.department);
      data.append('allowLikes', formData.allowLikes);
      data.append('allowComments', formData.allowComments);
      data.append('allowReactions', formData.allowReactions);
      
      // Add new images
      images.forEach(image => {
        data.append('images', image);
      });
      
      // Add images to remove
      if (removeImages.length > 0) {
        data.append('removeImages', JSON.stringify(removeImages));
      }
      
      if (isEditMode) {
        await dispatch(editNewsPost({ id, data }));
        toast.success('News post updated successfully');
      } else {
        await dispatch(createNewsPost(data));
        toast.success('News post created successfully');
      }
      
      navigate('/news');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update news post' : 'Failed to create news post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/news')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditMode ? 'Edit News Post' : 'Create News Post'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode 
              ? 'Update the news post details below' 
              : 'Fill in the details below to create a new news post'
            }
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Post' : 'New Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter news title"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
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
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write the news content here..."
                  rows={6}
                  required
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowLikes"
                    name="allowLikes"
                    checked={formData.allowLikes}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="allowLikes">Allow Likes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowComments"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="allowComments">Allow Comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowReactions"
                    name="allowReactions"
                    checked={formData.allowReactions}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <Label htmlFor="allowReactions">Allow Reactions</Label>
                </div>
              </div>

              {/* Existing Images (in edit mode) */}
              {isEditMode && existingImages.length > 0 && (
                <div>
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {existingImages.map((image) => (
                      <div key={image._id} className="relative">
                        <img
                          src={image.url}
                          alt="Existing"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeExistingImage(image._id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <Label>Images</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div>
                  <Label>Image Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : isEditMode ? (
                    'Update Post'
                  ) : (
                    'Create Post'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNewsPost;