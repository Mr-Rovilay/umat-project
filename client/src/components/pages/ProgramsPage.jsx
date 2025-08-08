import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, GraduationCap, Clock, BookOpen, Sparkles, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllDepartments } from '@/redux/slice/departmentSlice';
import { getAllPrograms } from '@/redux/slice/programSlice';

const ProgramsPage = () => {
  const dispatch = useDispatch();
  const { programs, isLoading, error } = useSelector((state) => state.program);
  const { departments } = useSelector((state) => state.department);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(getAllDepartments());
    dispatch(getAllPrograms(selectedDepartment));
    setIsVisible(true);
  }, [dispatch, selectedDepartment]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'program/clearError' });
    }
  }, [error, dispatch]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value === 'all' ? '' : value);
  };

  const filteredPrograms = programs.filter(prog =>
    prog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prog.department?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading programs...</p>
    </div>
  );

  const ProgramCard = ({ prog, index }) => (
    <Link
      to={`/programs/${prog._id}`}
      className={`group relative block transform transition-all duration-500 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 group-hover:border-purple-200 dark:group-hover:border-purple-800">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Animated background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
        
        <div className="relative p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-purple-500 transition-all duration-300" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {prog.name}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm">
                {prog.department?.name || 'Department not specified'}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <GraduationCap className="w-4 h-4 mr-2 text-pink-500" />
              <span className="text-sm font-medium">{prog.degree}</span>
            </div>
            
            {prog.duration && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">{prog.duration}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-800 dark:group-hover:text-purple-300">
              Learn more 
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-pad-container">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r rounded-2xl shadow-lg mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Academic Programs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your path to success with our comprehensive range of academic programs
            </p>
          </div>

          {/* Filters Section */}
          <div className={`flex flex-col sm:flex-row gap-4 mb-8 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '200ms' }}>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <Select onValueChange={handleDepartmentChange} defaultValue="all">
                <SelectTrigger className="w-[220px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 text-lg font-medium">{error}</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? 'No programs match your search.' : 'No programs found.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((prog, index) => (
                  <ProgramCard key={prog._id} prog={prog} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;