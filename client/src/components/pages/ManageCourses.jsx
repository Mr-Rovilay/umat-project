import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Button } from "../ui/button";

function ManageCourses() {
  const dispatch = useDispatch();
  const { availableCourses, isLoading, error } = useSelector(
    (state) => state.courses
  );
  const { programs } = useSelector((state) => state.programs);
  const { departments } = useSelector((state) => state.departments);

  const [editingCourse, setEditingCourse] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchAvailableCourses({}));
    dispatch(getAllPrograms());
    dispatch(getAllDepartments());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const response = await dispatch(
      updateCourse({ id: editingCourse._id, data })
    );
    if (updateCourse.fulfilled.match(response)) {
      toast.success("Course updated successfully");
      setEditingCourse(null);
      reset();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      const response = await dispatch(deleteCourse(id));
      if (deleteCourse.fulfilled.match(response)) {
        toast.success("Course deleted successfully");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-5">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Manage Courses
      </h2>

      {editingCourse ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                defaultValue={editingCourse.title}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Code
              </label>
              <input
                {...register("code", { required: "Code is required" })}
                defaultValue={editingCourse.code}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Units */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Units
              </label>
              <select
                {...register("unit", { required: "Units are required" })}
                defaultValue={editingCourse.unit}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Units</option>
                {[1, 2, 3, 4, 5].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.unit.message}
                </p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Semester
              </label>
              <select
                {...register("semester", { required: "Semester is required" })}
                defaultValue={editingCourse.semester}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Semester</option>
                {["First Semester", "Second Semester"].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.semester.message}
                </p>
              )}
            </div>

            {/* Program */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Program
              </label>
              <select
                {...register("program", { required: "Program is required" })}
                defaultValue={editingCourse.program._id}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog._id} value={prog._id}>
                    {prog.name}
                  </option>
                ))}
              </select>
              {errors.program && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.program.message}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Level
              </label>
              <select
                {...register("level", { required: "Level is required" })}
                defaultValue={editingCourse.level}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Level</option>
                {["100", "200", "300", "400", "500"].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <select
                {...register("department")}
                defaultValue={editingCourse.department?._id || ""}
                className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Department (Optional)</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
            >
              Update
            </Button>
            <Button
              type="button"
              onClick={() => setEditingCourse(null)}
              className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Code
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Units
                </th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : availableCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No courses available
                  </td>
                </tr>
              ) : (
                availableCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {course.title}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {course.code}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      {course.unit}
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button
                        onClick={() => setEditingCourse(course)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(course._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
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
    </div>
  );
}

export default ManageCourses;
