// components/AdminDepartmentManagement.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Edit, Trash2, ArrowLeft, Search, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearError, clearSuccessMessage, createDepartment, deleteDepartment, getAllDepartments, updateDepartment } from '@/redux/slice/departmentSlice';

const AdminDepartmentManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments, isLoading, error, successMessage, operationStatus } = useSelector((state) => state.departments);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
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

  const onSubmit = async (data) => {
    if (editId) {
      await dispatch(updateDepartment({ id: editId, departmentData: data }));
    } else {
      await dispatch(createDepartment(data));
    }
    reset();
    setEditId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (dept) => {
    reset({ name: dept.name || '' });
    setEditId(dept._id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? This cannot be undone.')) {
      await dispatch(deleteDepartment(id));
    }
  };

  const [editId, setEditId] = useState(null);

  // Filter departments by search query and admin's departments
  const allowedDepartments = user?.department?.length > 0
    ? departments.filter(dept => user.department.some(d => d._id?.toString() === dept._id))
    : departments;
  const filteredDepartments = allowedDepartments.filter((dept) =>
    dept.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Access denied. Admins only.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6 animate-fade-in-down">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-fade-in-down">
            Manage Departments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-fade-in-up">
            Add, edit, or delete departments in your institution
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
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700 rounded-full"
            />
          </div>
        </div>

        {/* Departments Table */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl">
                <Building2 className="mr-2 h-6 w-6 text-emerald-600" />
                {filteredDepartments.length} {filteredDepartments.length === 1 ? 'Department' : 'Departments'}
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl">
                      <Building2 className="mr-2 h-6 w-6 text-emerald-600" />
                      {editId ? 'Edit Department' : 'Add Department'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                        Department Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name", { required: "Department name is required" })}
                        placeholder="Enter department name"
                        className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                          setEditId(null);
                          setIsDialogOpen(false);
                        }}
                        disabled={isLoading}
                        className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        {isLoading && (operationStatus === 'creating' || operationStatus === 'updating') ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {operationStatus === 'creating' ? 'Creating...' : 'Updating...'}
                          </>
                        ) : editId ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !filteredDepartments.length ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : filteredDepartments.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-6">No departments found.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100/50 dark:bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Name</th>
                      <th className="p-3 text-right text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((dept) => (
                      <tr
                        key={dept._id}
                        className="border-t dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                      >
                        <td className="p-3 text-gray-900 dark:text-gray-100">{dept?.name || 'N/A'}</td>
                        <td className="p-3 flex justify-end gap-2">
                          <Button
                            onClick={() => handleEdit(dept)}
                            className="flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(dept._id)}
                            disabled={isLoading && operationStatus === 'deleting'}
                            className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                          >
                            {isLoading && operationStatus === 'deleting' ? (
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

export default AdminDepartmentManagement;