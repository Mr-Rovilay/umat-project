import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Department from '../models/Department.js';
import Program from '../models/Program.js';
import NewsPost from '../models/NewsPost.js';

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get online users (managed via Socket.IO, passed through middleware or global store)
    const onlineUsers = global.onlineUsers || []; // Array of { userId, departmentIds }
    const onlineUserIds = onlineUsers.map(u => u.userId);

    // Get online users by department
    const departments = await Department.find().select('name');
    const onlineUsersByDepartment = await Promise.all(
      departments.map(async dept => {
        const userCount = onlineUsers.filter(u =>
          u.departmentIds.includes(dept._id.toString())
        ).length;
        return { department: dept.name, userCount };
      })
    );

    // Get total payments by department
    const paymentStats = await Payment.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: '$department',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: '$department' },
      {
        $project: {
          department: '$department.name',
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json({
      onlineUsers: onlineUserIds.length,
      onlineUsersByDepartment,
      paymentStats,
    });
  } catch (error) {
    console.error('Get Dashboard Analytics Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard analytics' });
  }
};



export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const [courseCount, studentCount, departmentCount, programCount, newsPostCount] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Department.countDocuments(),
      Program.countDocuments(),
      NewsPost.countDocuments(),
    ]);

    // Example for pending tasks (adjust based on your logic)
    const pendingTasks = 0; // Placeholder: e.g., unapproved courses or users
    // Example: const pendingTasks = await Course.countDocuments({ approved: false });

    res.status(200).json({
      stats: {
        courses: courseCount,
        students: studentCount,
        departments: departmentCount,
        programs: programCount,
        newsPosts: newsPostCount,
        pendingTasks,
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};