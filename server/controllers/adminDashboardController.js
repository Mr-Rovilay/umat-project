import User from '../models/User.js';
import Payment from '../models/Payment.js';
// Get dashboard analytics (includes all required stats)
export const getDashboardAnalytics = async (req, res) => {
  try {
    const departmentId = req.user.department ? req.user.department[0] : null; // Department-specific for this admin
    const isGlobalAdmin = !departmentId; // Assume global admin if no department

    // Online users (using isOnline from User model)
    const onlineUsers = await User.countDocuments({ isOnline: true, role: 'student' });
    const onlineUsersByDepartment = await User.aggregate([
      { $match: { isOnline: true, role: 'student' } },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'deptInfo',
        },
      },
      { $unwind: { path: '$deptInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$deptInfo._id',
          departmentName: { $first: '$deptInfo.name' },
          userCount: { $sum: 1 },
        },
      },
      { $sort: { departmentName: 1 } },
    ]);

    // Total registered students
    const totalRegisteredStudents = await User.countDocuments({ isRegistered: true, role: 'student' });
    const registeredStudentsByDepartment = await User.aggregate([
      { $match: { isRegistered: true, role: 'student' } },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'deptInfo',
        },
      },
      { $unwind: { path: '$deptInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$deptInfo._id',
          departmentName: { $first: '$deptInfo.name' },
          studentCount: { $sum: 1 },
        },
      },
      { $sort: { departmentName: 1 } },
    ]);

    // Total payments by department
const paymentStats = await Payment.aggregate([
  { $match: { status: 'successful' } }, // Changed from 'completed' to 'successful'
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

    // Filter by department if not global admin
    const filteredOnlineUsersByDept = isGlobalAdmin ? onlineUsersByDepartment : onlineUsersByDepartment.filter(d => d._id?.toString() === departmentId);
    const filteredRegisteredStudentsByDept = isGlobalAdmin ? registeredStudentsByDepartment : registeredStudentsByDepartment.filter(d => d._id?.toString() === departmentId);
    const filteredPaymentStats = isGlobalAdmin ? paymentStats : paymentStats.filter(p => p.department?._id?.toString() === departmentId);

    res.status(200).json({
      onlineUsers,
      onlineUsersByDepartment: filteredOnlineUsersByDept,
      totalRegisteredStudents,
      registeredStudentsByDepartment: filteredRegisteredStudentsByDept,
      paymentStats: filteredPaymentStats,
    });
  } catch (error) {
    console.error('Get Dashboard Analytics Error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard analytics' });
  }
};

// Remove getDashboardStats as it's redundant with the enhanced getDashboardAnalytics