import CourseRegistrationForm from "./CourseRegistrationForm";


function RegisterCourses() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Register Courses</h2>
      <CourseRegistrationForm />
    </div>
  );
}

export default RegisterCourses;