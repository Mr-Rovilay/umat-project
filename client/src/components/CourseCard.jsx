function CourseCard({ course }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{course.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">Code: {course.code}</p>
      <p className="text-gray-600 dark:text-gray-300">Units: {course.unit}</p>
      <p className="text-gray-600 dark:text-gray-300">Semester: {course.semester}</p>
      <p className="text-gray-600 dark:text-gray-300">Level: {course.level}</p>
      <p className="text-gray-600 dark:text-gray-300">Program: {course.program?.name}</p>
    </div>
  );
}

export default CourseCard;