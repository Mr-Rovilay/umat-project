import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Building, Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllDepartments, clearError } from '@/redux/slice/departmentSlice';

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments, isLoading, error } = useSelector((state) => state.departments);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewNews = (deptId) => {
    navigate(`/news?department=${deptId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white animate-fade-in-down">
            Academic Departments
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-emerald-100 animate-fade-in-up">
            Discover our vibrant academic communities driving innovation and learning.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-8 flex justify-center">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            <Building className="h-5 w-5 mr-2" />
            {isLoading ? '-' : departments.length} {departments.length === 1 ? 'Department' : 'Departments'}
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 rounded-full"
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading departments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Building className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Departments Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery ? 'No departments match your search.' : 'No departments are currently available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((dept) => (
                <Card
                  key={dept._id}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                      <Building className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Managed by:{' '}
                      {dept.admins?.length > 0
                        ? dept.admins.map((admin) => `${admin.firstName} ${admin.lastName}`).join(', ')
                        : 'No admins assigned'}
                    </p>
                    <Button
                      onClick={() => handleViewNews(dept._id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      <Newspaper className="h-4 w-4 mr-2" />
                      View Department News
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;