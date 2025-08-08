import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import NewsPostCard from '../NewsPostCard';
import { clearError, fetchNewsPosts } from '@/redux/slice/newsSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Building, Plus, Loader2, AlertCircle } from 'lucide-react';

function News() {
  const dispatch = useDispatch();
  const { newsPosts, isLoading: newsLoading, error } = useSelector((state) => state.news || { newsPosts: [], isLoading: false, error: null });
  const { departments, isLoading: departmentsLoading } = useSelector((state) => state.departments || { departments: [], isLoading: false });
  const { user } = useSelector((state) => state.auth);
  
  // Initialize with 'all' to show all departments by default
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      department: 'all',
    },
  });
  
  const department = watch('department');

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
    // Fetch all posts if department is 'all', otherwise fetch by department
    if (department === 'all') {
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
          <p className="text-gray-700 dark:text-gray-300">Loading departments...</p>
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
            Stay updated with the latest news and announcements from our university community
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
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{newsPosts.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published articles</p>
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
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{departments.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Academic departments</p>
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
                {newsPosts.filter(post => {
                  const postDate = new Date(post.createdAt);
                  const now = new Date();
                  const diffTime = Math.abs(now - postDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This week</p>
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
              {user?.role === 'admin' && (
                <Link to="/news/create" className="mt-4 md:mt-0">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Create News Post
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Department Filter */}
            <div className="mb-6">
              <Label htmlFor="department-filter" className="flex items-center mb-4">
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
                      // We don't need to dispatch here because the useEffect will handle it
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full md:w-1/3 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Changed from empty string to "all" */}
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
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
                <p className="text-gray-700 dark:text-gray-300">Loading news posts...</p>
              </div>
            ) : newsPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">No news posts available</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {department === 'all' 
                    ? "There are no news posts yet" 
                    : "There are no news posts for this department yet"
                  }
                </p>
                {user?.role === 'admin' && (
                  <Link to="/news/create" className="mt-4">
                    <Button variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      <Plus className="mr-2 h-4 w-4" />
                      Create the first post
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {newsPosts.length} news post{newsPosts.length !== 1 ? 's' : ''}
                  </p>
                  {department && department !== 'all' && (
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                      {departments.find(d => d._id === department)?.name}
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