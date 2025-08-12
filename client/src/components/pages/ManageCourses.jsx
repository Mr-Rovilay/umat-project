import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  clearError,
  deleteCourse,
  fetchAvailableCourses,
  updateCourse,
} from "@/redux/slice/courseSlice";
import { getAllPrograms } from "@/redux/slice/programSlice";
import { getAllDepartments } from "@/redux/slice/departmentSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, BookOpen, Trash, Edit } from "lucide-react";

function ManageCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { availableCourses, isLoading, updateStatus, error } = useSelector(
    (state) => state.courses
  );
  const { programs, isLoading: programsLoading } = useSelector(
    (state) => state.programs
  );
  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments
  );

  const [editingCourse, setEditingCourse] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      code: '',
      unit: '',
      semester: '',
      program: '',
      level: '',
      department: 'none',
    },
  });

  // Access control
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/student/dashboard');
    } else {
      // Fetch only courses for admin's department
      const departmentIds = user.department?.map(d => d._id?.toString()) || [];
      dispatch(fetchAvailableCourses({ department: departmentIds }));
      dispatch(getAllPrograms());
      dispatch(getAllDepartments());
    }
  }, [user, dispatch, navigate]);

  // Error and success handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (updateStatus === 'success') {
      toast.success(editingCourse ? 'Course updated successfully' : 'Course deleted successfully');
      dispatch(clearError());
    }
  }, [error, updateStatus, editingCourse, dispatch]);

  const onSubmit = async (data) => {
    const processedData = {
      ...data,
      department: data.department === 'none' ? null : data.department,
    };
    await dispatch(updateCourse({ id: editingCourse._id, data: processedData }));
    setEditingCourse(null);
    reset();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      await dispatch(deleteCourse(id));
    }
  };

  // Filter courses and departments to admin's departments
  const allowedDepartments = user?.department?.length > 0
    ? (departments || []).filter(dept => user.department.some(d => d._id?.toString() === dept?._id))
    : (departments || []);

  if (programsLoading || departmentsLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6 animate-fade-in-down">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-fade-in-down">
            Manage Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-fade-in-up">
            Edit or delete courses in your department
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

        {/* Main Content */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
              {editingCourse ? 'Edit Course' : 'Course List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingCourse ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Title */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Title</Label>
                    <Input
                      {...register("title", { required: 'Title is required' })}
                      defaultValue={editingCourse.title || ''}
                      placeholder="Enter course title"
                      className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Code */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Code</Label>
                    <Input
                      {...register("code", { required: 'Code is required' })}
                      defaultValue={editingCourse.code || ''}
                      placeholder="Enter course code"
                      className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                    />
                    {errors.code && (
                      <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  {/* Units */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Units</Label>
                    <Select {...register("unit", { required: 'Units are required' })} defaultValue={editingCourse.unit?.toString() || ''}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select Units" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((unit) => (
                          <SelectItem key={unit} value={unit.toString()}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.unit && (
                      <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                    )}
                  </div>

                  {/* Semester */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Semester</Label>
                    <Select {...register("semester", { required: 'Semester is required' })} defaultValue={editingCourse.semester || ''}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {['First Semester', 'Second Semester'].map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.semester && (
                      <p className="text-red-500 text-sm mt-1">{errors.semester.message}</p>
                    )}
                  </div>

                  {/* Program */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Program</Label>
                    <Select {...register("program", { required: 'Program is required' })} defaultValue={editingCourse.program?._id || ''}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select Program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs?.length > 0 ? (
                          programs.map((prog) => (
                            <SelectItem key={prog?._id || index} value={prog?._id || ''}>
                              {prog?.name || 'Unknown Program'}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No programs available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.program && (
                      <p className="text-red-500 text-sm mt-1">{errors.program.message}</p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Level</Label>
                    <Select {...register("level", { required: 'Level is required' })} defaultValue={editingCourse.level || ''}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {['100', '200', '300', '400', '500'].map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.level && (
                      <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Department (Optional)</Label>
                    <Select {...register("department")} defaultValue={editingCourse.department?._id || 'none'}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Department</SelectItem>
                        {allowedDepartments?.length > 0 ? (
                          allowedDepartments.map((dept) => (
                            <SelectItem key={dept?._id || index} value={dept?._id || ''}>
                              {dept?.name || 'Unknown Department'}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No departments available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isLoading && updateStatus === 'pending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Course'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingCourse(null);
                      reset();
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100/50 dark:bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Title</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Code</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Units</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Semester</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Program</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Level</th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableCourses?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-gray-500 dark:text-gray-400"
                        >
                          No courses available
                        </td>
                      </tr>
                    ) : (
                      availableCourses.map((course) => (
                        <tr
                          key={course?._id || index}
                          className="border-t dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                        >
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.title || 'N/A'}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.code || 'N/A'}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.unit || 'N/A'}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.semester || 'N/A'}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.program?.name || 'N/A'}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{course?.level || 'N/A'}</td>
                          <td className="p-3 flex gap-2">
                            <Button
                              onClick={() => setEditingCourse(course)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(course._id)}
                              disabled={isLoading && updateStatus === 'pending'}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                            >
                              {isLoading && updateStatus === 'pending' ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Trash className="h-4 w-4 mr-1" />
                              )}
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ManageCourses;