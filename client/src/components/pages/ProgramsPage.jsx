import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, GraduationCap, Clock, BookOpen, Sparkles, Filter, Search, Users, Award, Building } from 'lucide-react';
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
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-600 rounded-full animate-spin animate-reverse"></div>
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
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-800">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Animated background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
        
        <div className="relative p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 transition-all duration-300" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {prog.name}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {prog.description || 'Comprehensive program designed to prepare students for successful careers in their chosen field.'}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4 mr-2 text-emerald-500" />
              <span className="text-sm">
                {prog.department?.name || 'Department not specified'}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <GraduationCap className="w-4 h-4 mr-2 text-teal-500" />
              <span className="text-sm font-medium">{prog.degree || 'Bachelor\'s Degree'}</span>
            </div>
            
            {prog.duration && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-cyan-500" />
                <span className="text-sm">{prog.duration}</span>
              </div>
            )}
            
            {prog.students && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">{prog.students} Students</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
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

  const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center">
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
          <dd className="text-2xl font-bold text-gray-900 dark:text-white">{value}</dd>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Academic Programs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your path to success with our comprehensive range of academic programs
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '200ms' }}>
            <StatsCard 
              icon={GraduationCap} 
              label="Total Programs" 
              value={isLoading ? '-' : programs.length} 
              color="from-emerald-500 to-teal-500" 
            />
            <StatsCard 
              icon={Users} 
              label="Students Enrolled" 
              value="8,500+" 
              color="from-teal-500 to-cyan-500" 
            />
            <StatsCard 
              icon={Award} 
              label="Success Rate" 
              value="95%" 
              color="from-green-500 to-emerald-500" 
            />
          </div>
          
          {/* Filters Section */}
          <div className={`flex flex-col sm:flex-row gap-4 mb-8 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '300ms' }}>
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
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? 'No programs match your search.' : 'No programs found.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
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