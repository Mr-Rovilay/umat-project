import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { X, Image as ImageIcon, FileText, Hash, Building, Heart, MessageCircle, Smile, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { clearError, createNewsPost, editNewsPost } from '@/redux/slice/newsSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';

function CreateNewsPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { departments, isLoading: departmentsLoading } = useSelector((state) => state.departments || { departments: [], isLoading: false });
  const { newsPosts, isLoading: newsLoading, error } = useSelector((state) => state.news || { newsPosts: [], isLoading: false, error: null });
  const post = id ? newsPosts.find((p) => p._id === id) : null;
  
  // FIX: Add 'control' to the destructuring
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: post
      ? {
          title: post.title,
          content: post.content,
          department: post.department._id,
          allowLikes: post.allowLikes,
          allowComments: post.allowComments,
          allowReactions: post.allowReactions,
        }
      : {
          title: '',
          content: '',
          department: '',
          allowLikes: true,
          allowComments: true,
          allowReactions: true,
        },
  });
  
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(post?.images || []);
  const [removeImages, setRemoveImages] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemoveImages((prev) => [...prev, publicId]);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      images,
      removeImages: removeImages.length > 0 ? removeImages : undefined,
    };
    
    const response = id
      ? await dispatch(editNewsPost({ id, data: payload }))
      : await dispatch(createNewsPost(payload));
      
    if (id ? editNewsPost.fulfilled.match(response) : createNewsPost.fulfilled.match(response)) {
      toast.success(id ? 'News post updated successfully' : 'News post created successfully');
      navigate('/news');
      reset();
      setImages([]);
      setRemoveImages([]);
    }
  };

  if (departmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {id ? 'Edit News Post' : 'Create News Post'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {id 
              ? 'Update the news post information and content'
              : 'Share important news and updates with the university community'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Post Information
            </CardTitle>
            <CardDescription>
              Fill in the details for your news post. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  <Hash className="mr-2 h-4 w-4 text-emerald-500" />
                  Title *
                </Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Enter news post title"
                  className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center">
                    <X className="mr-1 h-3 w-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                  Content *
                </Label>
                <Textarea
                  id="content"
                  {...register('content', { required: 'Content is required' })}
                  placeholder="Write your news content here..."
                  className="min-h-[150px] border-emerald-200 dark:border-emerald-800 focus:border-emerald-500"
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center">
                    <X className="mr-1 h-3 w-3" />
                    {errors.content.message}
                  </p>
                )}
              </div>

              {/* Department Field */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-emerald-500" />
                  Department *
                </Label>
                <Controller
                  name="department"
                  control={control}  // Now control is defined
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="border-emerald-200 dark:border-emerald-800 focus:border-emerald-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department && (
                  <p className="text-sm text-red-500 flex items-center">
                    <X className="mr-1 h-3 w-3" />
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Engagement Options */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Engagement Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Checkbox
                      id="allowLikes"
                      {...register('allowLikes')}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label htmlFor="allowLikes" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Allow Likes
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Checkbox
                      id="allowComments"
                      {...register('allowComments')}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label htmlFor="allowComments" className="flex items-center cursor-pointer">
                      <MessageCircle className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Allow Comments
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Checkbox
                      id="allowReactions"
                      {...register('allowReactions')}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label htmlFor="allowReactions" className="flex items-center cursor-pointer">
                      <Smile className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Allow Reactions
                    </Label>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4 text-emerald-500" />
                  Images
                  <Badge variant="outline" className="ml-2 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                    Up to 5
                  </Badge>
                </Label>
                
                <div className="flex items-center justify-center w-full">
                  <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg cursor-pointer bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mb-2" />
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>

              {/* Image Previews */}
              {(existingImages.length > 0 || images.length > 0) && (
                <div className="space-y-3">
                  <Label>Image Previews</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.publicId} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <img 
                            src={image.url} 
                            alt="Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeExistingImage(image.publicId)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt="Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={newsLoading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {newsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {id ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {id ? 'Update Post' : 'Create Post'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateNewsPost;