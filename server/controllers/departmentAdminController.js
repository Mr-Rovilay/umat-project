// controllers/departmentAdminController.js
import CourseRegistration from '../models/CourseRegistration.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import mongoose from 'mongoose';

// Get department-specific registration statistics
export const getDepartmentRegistrationStats = async (req, res) => {
  try {
    const departmentId = req.adminDepartment._id;
    
    // Get total students in the department
    const totalStudents = await User.countDocuments({ 
      department: departmentId,
      role: 'student'
    });
    
    // Get total registrations for this department
    const totalRegistrations = await CourseRegistration.countDocuments({
      student: { $in: await User.find({ department: departmentId, role: 'student' }).select('_id') }
    });
    
    // Get students who have completed registration (all documents verified)
    const completedRegistrations = await CourseRegistration.countDocuments({
      student: { $in: await User.find({ department: departmentId, role: 'student' }).select('_id') },
      'uploads.courseRegistrationSlip.verified': true,
      'uploads.schoolFeesReceipt.verified': true,
      'uploads.hallDuesReceipt.verified': true
    });
    
    // Get document upload statistics
    const documentStats = await CourseRegistration.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $match: {
          'student.department': new mongoose.Types.ObjectId(departmentId),
          'student.role': 'student'
        }
      },
      {
        $facet: {
          courseSlip: [
            {
              $group: {
                _id: null,
                uploaded: {
                  $sum: {
                    $cond: {
                      if: { $ne: ['$uploads.courseRegistrationSlip.url', ''] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                verified: {
                  $sum: {
                    $cond: {
                      if: '$uploads.courseRegistrationSlip.verified',
                      then: 1,
                      else: 0
                    }
                  }
                }
              }
            }
          ],
          feesReceipt: [
            {
              $group: {
                _id: null,
                uploaded: {
                  $sum: {
                    $cond: {
                      if: { $ne: ['$uploads.schoolFeesReceipt.url', ''] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                verified: {
                  $sum: {
                    $cond: {
                      if: '$uploads.schoolFeesReceipt.verified',
                      then: 1,
                      else: 0
                    }
                  }
                }
              }
            }
          ],
          hallDues: [
            {
              $group: {
                _id: null,
                uploaded: {
                  $sum: {
                    $cond: {
                      if: { $ne: ['$uploads.hallDuesReceipt.url', ''] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                verified: {
                  $sum: {
                    $cond: {
                      if: '$uploads.hallDuesReceipt.verified',
                      then: 1,
                      else: 0
                    }
                  }
                }
              }
            }
          ]
        }
      }
    ]);
    
    // Get payment statistics
    const paymentStats = await Payment.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $match: {
          'student.department': new mongoose.Types.ObjectId(departmentId),
          'student.role': 'student'
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get registrations by semester
    const registrationsBySemester = await CourseRegistration.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $match: {
          'student.department': new mongoose.Types.ObjectId(departmentId),
          'student.role': 'student'
        }
      },
      {
        $group: {
          _id: '$semester',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get registrations by level
    const registrationsByLevel = await CourseRegistration.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $match: {
          'student.department': new mongoose.Types.ObjectId(departmentId),
          'student.role': 'student'
        }
      },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get pending document verifications
    const pendingVerifications = await CourseRegistration.find({
      $or: [
        { 'uploads.courseRegistrationSlip.verified': false },
        { 'uploads.schoolFeesReceipt.verified': false, 'uploads.schoolFeesReceipt.url': { $ne: '' } },
        { 'uploads.hallDuesReceipt.verified': false, 'uploads.hallDuesReceipt.url': { $ne: '' } }
      ]
    }).populate({
      path: 'student',
      match: { department: departmentId, role: 'student' },
      select: 'firstName lastName studentId email phone'
    }).populate({
      path: 'program',
      select: 'name degree'
    }).sort({ createdAt: -1 });
    
    // Calculate total revenue
    const totalRevenue = paymentStats
      .filter(stat => stat._id === 'successful')
      .reduce((sum, stat) => sum + stat.totalAmount, 0);
    
    // Calculate pending payments amount
    const pendingPayments = paymentStats
      .filter(stat => stat._id !== 'successful')
      .reduce((sum, stat) => sum + stat.totalAmount, 0);
    
    res.status(200).json({
      department: req.adminDepartment,
      totalStudents,
      totalRegistrations,
      completedRegistrations,
      pendingRegistrations: totalRegistrations - completedRegistrations,
      documentStats: {
        courseSlip: documentStats[0].courseSlip[0] || { uploaded: 0, verified: 0 },
        feesReceipt: documentStats[0].feesReceipt[0] || { uploaded: 0, verified: 0 },
        hallDues: documentStats[0].hallDues[0] || { uploaded: 0, verified: 0 }
      },
      paymentStats,
      totalRevenue,
      pendingPayments,
      registrationsBySemester,
      registrationsByLevel,
      pendingVerifications
    });
  } catch (error) {
    console.error('Get Department Registration Stats Error:', error);
    res.status(500).json({ message: 'Server error while fetching department registration stats' });
  }
};

// Get detailed student registrations with documents
export const getDepartmentStudentRegistrations = async (req, res) => {
  try {
    const departmentId = req.adminDepartment._id;
    const { semester, level, status, page = 1, limit = 10 } = req.query;
    
    // Get all student IDs in this department
    const departmentStudents = await User.find({ 
      department: { $in: [departmentId] },
      role: 'student' 
    }).select('_id');
    const studentIds = departmentStudents.map(student => student._id);
    
    // Build filter object
    const filter = {
      student: { $in: studentIds }
    };
    
    // Add semester filter if provided
    if (semester && semester !== 'all') {
      filter.semester = semester;
    }
    
    // Add level filter if provided
    if (level && level !== 'all') {
      filter.level = level;
    }
    
    // Add document status filter if provided
    if (status === 'completed') {
      filter['uploads.courseRegistrationSlip.verified'] = true;
      filter['uploads.schoolFeesReceipt.verified'] = true;
      filter['uploads.hallDuesReceipt.verified'] = true;
    } else if (status === 'pending') {
      filter.$or = [
        { 'uploads.courseRegistrationSlip.verified': false },
        { 'uploads.schoolFeesReceipt.verified': false },
        { 'uploads.hallDuesReceipt.verified': false }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    // Get registrations with complete student, program, and payment details
    const registrations = await CourseRegistration.find(filter)
      .populate({
        path: 'student',
        select: 'firstName lastName studentId email phone level department isRegistered'
      })
      .populate({
        path: 'program',
        select: 'name degree department'
      })
      .populate({
        path: 'payments', // Changed from 'payment' to 'payments'
        select: 'amount status paymentType reference createdAt transactionId'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await CourseRegistration.countDocuments(filter);
    
    res.status(200).json({
      registrations,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        per_page: parseInt(limit),
        total_records: total
      }
    });
  } catch (error) {
    console.error('Get Department Student Registrations Error:', error);
    res.status(500).json({ message: 'Server error while fetching department student registrations' });
  }
};

// Verify student documents
export const verifyStudentDocuments = async (req, res) => {
  try {
    const { registrationId, documentType, verified } = req.body;
    const departmentId = req.adminDepartment._id;
    
    // Find the registration and ensure it belongs to this department
    const registration = await CourseRegistration.findById(registrationId)
      .populate({
        path: 'student',
        select: 'department'
      });
    
    if (!registration || !registration.student.department.includes(departmentId)) {
      return res.status(404).json({ message: 'Registration not found or access denied' });
    }
    
    // Update the verification status of the specified document
    const updateField = `uploads.${documentType}.verified`;
    const updateData = {
      [updateField]: verified,
      lastUpdated: new Date()
    };
    
    await CourseRegistration.findByIdAndUpdate(registrationId, updateData);
    
    // If all documents are now verified, update payment status if needed
    const updatedRegistration = await CourseRegistration.findById(registrationId);
    const allVerified = 
      updatedRegistration.uploads.courseRegistrationSlip.verified &&
      updatedRegistration.uploads.schoolFeesReceipt.verified &&
      updatedRegistration.uploads.hallDuesReceipt.verified;
    
    if (allVerified && updatedRegistration.paymentStatus === 'pending') {
      await CourseRegistration.findByIdAndUpdate(registrationId, {
        paymentStatus: 'complete'
      });
    }
    
    res.status(200).json({ 
      message: `Document ${verified ? 'verified' : 'unverified'} successfully`,
      documentType,
      verified,
      allVerified
    });
  } catch (error) {
    console.error('Verify Student Documents Error:', error);
    res.status(500).json({ message: 'Server error while verifying student documents' });
  }
};
// export const getStudentRegistrationDetails = async (req, res) => {
//   try {
//     const { registrationId } = req.params;
//     const departmentId = req.adminDepartment._id;
    
//     const registration = await CourseRegistration.findOne({
//       _id: registrationId
//     })
//       .populate({
//         path: 'student',
//         match: { department: departmentId },
//         select: 'firstName lastName studentId email phone department level isRegistered owingStatus'
//       })
//       .populate({
//         path: 'program',
//         select: 'name degree department duration'
//       })
//       .populate({
//         path: 'courses',
//         select: 'title code unit semester program'
//       })
//       .populate({
//         path: 'payment',
//         select: 'amount status paymentType reference createdAt transactionId receiptUrl paystackData'
//       });
    
//     if (!registration) {
//       return res.status(404).json({ message: 'Registration not found or access denied' });
//     }
    
//     res.status(200).json({ registration });
//   } catch (error) {
//     console.error('Get Student Registration Details Error:', error);
//     res.status(500).json({ message: 'Server error while fetching student registration details' });
//   }
// };
// controllers/departmentAdminController.js

// Get student registration details
export const getStudentRegistrationDetails = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const departmentId = req.adminDepartment._id;
    
    const registration = await CourseRegistration.findOne({
      _id: registrationId
    })
      .populate({
        path: 'student',
        match: { department: { $in: [departmentId] } },
        select: 'firstName lastName studentId email phone department level isRegistered owingStatus'
      })
      .populate({
        path: 'program',
        select: 'name degree department duration'
      })
      .populate({
        path: 'payments', // Changed from 'payment' to 'payments'
        select: 'amount status paymentType reference createdAt transactionId receiptUrl paystackData'
      });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found or access denied' });
    }
    
    res.status(200).json({ registration });
  } catch (error) {
    console.error('Get Student Registration Details Error:', error);
    res.status(500).json({ message: 'Server error while fetching student registration details' });
  }
};

// controllers/departmentAdminController.js
export const fetchAdminDepartments = async (req, res) => {
  try {
    const { departmentIds } = req.body;
    if (!departmentIds || !Array.isArray(departmentIds) || departmentIds.length === 0) {
      return res.status(400).json({ message: 'Valid department IDs are required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can access department details' });
    }

    const departments = await Department.find({
      _id: { $in: departmentIds },
      admins: req.user._id
    }).select('_id name programs');

    res.status(200).json({ departments });
  } catch (error) {
    console.error('Fetch Admin Departments Error:', error);
    res.status(500).json({ message: 'Server error while fetching department details' });
  }
};