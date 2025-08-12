// middleware/roleMiddleware.js
import mongoose from 'mongoose';
import User from '../models/User.js';
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  };
};

export const restrictToDepartment = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // First check if user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
  }
  
  // Get department ID from the most reliable source first
  let departmentId = req.params.departmentId;
  
  // If not in params, try to get from the pre-populated department
  if (!departmentId && req.adminDepartment) {
    departmentId = req.adminDepartment._id?.toString();
  }
  
  // If still no department ID, check if user has any departments assigned
  if (!departmentId && req.user.department && req.user.department.length > 0) {
    departmentId = req.user.department[0]?.toString();
  }
  
  // If no department ID found, this might be a global admin endpoint
  if (!departmentId) {
    return next();
  }
  
  // Validate department ID format
  if (!mongoose.Types.ObjectId.isValid(departmentId)) {
    return res.status(400).json({ message: 'Invalid department ID' });
  }
  
  // Check if user has access to this department
  const hasAccess = req.user.department && 
    req.user.department.some(dept => dept._id.toString() === departmentId);
  
  if (!hasAccess) {
    return res.status(403).json({ 
      message: 'You do not have access to this department' 
    });
  }
  
  // Add department info to request for use in controllers
  req.departmentId = departmentId;
  
  next();
};

// New middleware specifically for department admins
export const restrictToDepartmentAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // First check if user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
  }
  
  // Populate user's department if not already populated
  if (!req.user.department || req.user.department.length === 0) {
    try {
      const populatedUser = await User.findById(req.user._id).populate('department');
      if (!populatedUser.department || populatedUser.department.length === 0) {
        return res.status(403).json({ message: 'Admin is not assigned to any department' });
      }
      req.user = populatedUser;
    } catch (error) {
      console.error('Error populating user department:', error);
      return res.status(500).json({ message: 'Server error during authorization' });
    }
  }
  
  // Get department ID from the most reliable source first
  let departmentId = req.params.departmentId;
  
  // If not in params, try to get from the pre-populated department
  if (!departmentId && req.adminDepartment) {
    departmentId = req.adminDepartment._id?.toString();
  }
  
  // If still no department ID, check if user has any departments assigned
  if (!departmentId && req.user.department && req.user.department.length > 0) {
    departmentId = req.user.department[0]?._id?.toString();
  }
  
  // If no department ID found, this might be a global admin endpoint
  if (!departmentId) {
    return res.status(403).json({ 
      message: 'Admin is not assigned to any department' 
    });
  }
  
  // Validate department ID format
  if (!mongoose.Types.ObjectId.isValid(departmentId)) {
    return res.status(400).json({ message: 'Invalid department ID' });
  }
  
  // Check if user has access to this department
  const hasAccess = req.user.department && 
    req.user.department.some(dept => dept._id.toString() === departmentId);
  
  if (!hasAccess) {
    return res.status(403).json({ 
      message: 'You do not have access to this department' 
    });
  }
  
  // Add department info to request for use in controllers
  req.departmentId = departmentId;
  req.adminDepartment = req.user.department[0];
  
  next();
};