// controllers/departmentAdminController.js
import CourseRegistration from '../models/CourseRegistration.js';
import Department from '../models/Department.js';
import Program from '../models/Program.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get department-specific registration statistics
export const getDepartmentRegistrationStats = async (req, res) => {
  try {
    const departmentId = req.adminDepartment._id;
    
    // Get total registrations for this department
    const totalRegistrations = await CourseRegistration.countDocuments({
      'uploads.courseRegistrationSlip.verified': true
    }).populate({
      path: 'student',
      match: { department: departmentId }
    });
    
    // Get registrations by semester
    const registrationsBySemester = await CourseRegistration.aggregate([
      {
        $match: {
          'uploads.courseRegistrationSlip.verified': true
        }
      },
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
          'student.department': departmentId
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
        $match: {
          'uploads.courseRegistrationSlip.verified': true
        }
      },
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
          'student.department': departmentId
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
      match: { department: departmentId },
      select: 'firstName lastName studentId'
    }).populate({
      path: 'program',
      select: 'name'
    }).sort({ createdAt: -1 });
    
    // Get payment statistics
    const paymentStats = await CourseRegistration.aggregate([
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
          'student.department': departmentId
        }
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'payments',
          foreignField: '_id',
          as: 'paymentInfo'
        }
      },
      {
        $unwind: '$paymentInfo'
      },
      {
        $group: {
          _id: '$paymentInfo.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$paymentInfo.amount' }
        }
      }
    ]);
    
    res.status(200).json({
      department: req.adminDepartment,
      totalRegistrations,
      registrationsBySemester,
      registrationsByLevel,
      pendingVerifications,
      paymentStats
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
    
    const filter = {
      'uploads.courseRegistrationSlip.verified': true
    };
    
    // Add semester filter if provided
    if (semester && semester !== 'all') {
      filter.semester = semester;
    }
    
    // Add level filter if provided
    if (level && level !== 'all') {
      filter.level = level;
    }
    
    // Add payment status filter if provided
    if (status && status !== 'all') {
      filter.paymentStatus = status;
    }
    
    const skip = (page - 1) * limit;
    
    // Get registrations with student and program details
    const registrations = await CourseRegistration.find(filter)
      .populate({
        path: 'student',
        match: { department: departmentId },
        select: 'firstName lastName studentId email'
      })
      .populate({
        path: 'program',
        select: 'name degree'
      })
      .populate({
        path: 'courses',
        select: 'title code unit'
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
        total_records: total,
        per_page: parseInt(limit)
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
    const registration = await CourseRegistration.findOne({
      _id: registrationId
    }).populate({
      path: 'student',
      match: { department: departmentId }
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found or access denied' });
    }
    
    // Update the verification status of the specified document
    const updateField = `uploads.${documentType}.verified`;
    await CourseRegistration.findByIdAndUpdate(registrationId, {
      [updateField]: verified
    });
    
    res.status(200).json({ 
      message: `Document ${verified ? 'verified' : 'unverified'} successfully`,
      documentType,
      verified
    });
  } catch (error) {
    console.error('Verify Student Documents Error:', error);
    res.status(500).json({ message: 'Server error while verifying student documents' });
  }
};

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
        match: { department: departmentId },
        select: 'firstName lastName studentId email department'
      })
      .populate({
        path: 'program',
        select: 'name degree department'
      })
      .populate({
        path: 'courses',
        select: 'title code unit semester program'
      })
      .populate({
        path: 'payments',
        select: 'amount status paymentType reference createdAt'
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