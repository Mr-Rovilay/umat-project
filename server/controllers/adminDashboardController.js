import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Department from '../models/Department.js';
import mongoose from 'mongoose';

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