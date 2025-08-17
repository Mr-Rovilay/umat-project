import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Edit, Trash2, ArrowLeft, Search, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { clearError, clearSuccessMessage, createProgram, deleteProgram, getAllPrograms, updateProgram } from '@/redux/slice/programSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';

const AdminProgramManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { programs, isLoading, error, successMessage } = useSelector((state) => state.programs);
  const { departments } = useSelector((state) => state.departments);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department: [], // Changed to array
    duration: '',
    degree: '',
  });
  const [editId, setEditId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Options for dropdowns
  const degreeOptions = ['Bachelor', 'Master', 'PhD', 'BSc', 'MSc'];
  const durationOptions = ['3 years', '4 years', '5 years'];

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(getAllPrograms());
      dispatch(getAllDepartments());
    } else {
      toast.error('Access denied. Admins only.');
      navigate('/login');
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [error, successMessage, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department.length || !formData.degree) {
      toast.error('Name, department, and degree are required');
      return;
    }
    if (editId) {
      await dispatch(updateProgram({ id: editId, programData: formData }));
    } else {
      await dispatch(createProgram(formData));
    }
    setFormData({ name: '', department: [], duration: '', degree: '' });
    setEditId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (prog) => {
    // Extract department IDs from the array of department objects
    const departmentIds = prog.department?.map(dept => dept._id) || [];
    
    setFormData({
      name: prog.name,
      department: departmentIds,
      duration: prog.duration || '',
      degree: prog.degree || '',
    });
    setEditId(prog._id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await dispatch(deleteProgram(id));
    }
  };

  const handleDepartmentChange = (value) => {
    // Toggle department selection
    if (formData.department.includes(value)) {
      // Remove if already selected
      setFormData({
        ...formData,
        department: formData.department.filter(id => id !== value)
      });
    } else {
      // Add if not selected
      setFormData({
        ...formData,
        department: [...formData.department, value]
      });
    }
  };

  const filteredPrograms = programs.filter((prog) =>
    prog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter departments to admin's departments
  const allowedDepartments = user?.department?.length > 0
    ? departments.filter(dept => user.department.some(d => d._id?.toString() === dept._id))
    : departments;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6 animate-fade-in-down">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-fade-in-down">
            Manage Programs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-fade-in-up">
            Add, edit, or delete programs in your department
          </p>
        </div>
        
        {/* Back to Dashboard */}
        <Button
          onClick={() => navigate('/dashboard')}
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
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700 rounded-full"
            />
          </div>
        </div>
        
        {/* Programs Table */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl">
                <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
                {filteredPrograms.length} {filteredPrograms.length === 1 ? 'Program' : 'Programs'}
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    Add Program
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl">
                      <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
                      {editId ? 'Edit Program' : 'Add Program'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Program Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter program name"
                        className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                        Departments (Select one or more)
                      </Label>
                      <div className="space-y-2 mt-1">
                        {allowedDepartments?.length > 0 ? (
                          allowedDepartments.map((dept) => (
                            <div key={dept._id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`dept-${dept._id}`}
                                checked={formData.department.includes(dept._id)}
                                onChange={() => handleDepartmentChange(dept._id)}
                                disabled={isLoading}
                                className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <label htmlFor={`dept-${dept._id}`} className="text-gray-700 dark:text-gray-300">
                                {dept.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No departments available</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="degree" className="text-gray-700 dark:text-gray-300">
                        Degree
                      </Label>
                      <Select
                        value={formData.degree}
                        onValueChange={(value) => setFormData({ ...formData, degree: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeOptions.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">
                        Duration
                      </Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => setFormData({ ...formData, duration: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({ name: '', department: [], duration: '', degree: '' });
                          setEditId(null);
                          setIsDialogOpen(false);
                        }}
                        disabled={isLoading}
                        className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No programs available</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100/50 dark:bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Program Name</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Departments</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Degree</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Duration</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((prog) => (
                      <tr key={prog._id} className="border-t dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <td className="p-3 text-gray-900 dark:text-gray-100">{prog.name || 'N/A'}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">
                          {prog.department && prog.department.length > 0 
                            ? prog.department.map(dept => dept.name).join(', ')
                            : 'N/A'
                          }
                        </td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{prog.degree || 'N/A'}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{prog.duration || 'N/A'}</td>
                        <td className="p-3 flex gap-2">
                          <Button
                            onClick={() => handleEdit(prog)}
                            className="flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(prog._id)}
                            disabled={isLoading}
                            className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProgramManagement;