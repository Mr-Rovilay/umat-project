// Student: Register for courses with payment flow
import Course from "../models/Course.js";
import CourseRegistration from "../models/CourseRegistration.js";
import Program from "../models/Program.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload files to Cloudinary
const uploadFile = async (file, folder) => {
  if (!file) return null;
  
  try {
    // Convert buffer to data URI for Cloudinary upload
    const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(dataURI, { 
      folder: `course_registration/${folder}`,
      resource_type: "auto",
      quality: "auto:good"
    });
    
    return { 
      url: result.secure_url, 
      publicId: result.public_id,
      verified: false
    };
  } catch (error) {
    console.error(`Error uploading to ${folder}:`, error);
    throw new Error(`Failed to upload ${folder}: ${error.message}`);
  }
};

// Helper function to transform Cloudinary URL for PDFs
const transformCloudinaryUrl = (url) => {
  if (!url) return url;
  
  // Check if it's a PDF and from Cloudinary
  if (url.includes('.pdf') && url.includes('cloudinary.com')) {
    // Add the PDF viewer transformation
    return url.replace('/upload/', '/upload/fl_pdf_viewer/');
  }
  return url;
};

// Generate payment reference
const generatePaymentReference = () => {
  return `CR_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Admin creates a course (single or bulk)
export const createCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('department', 'name');
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create courses' });
    }
    // Handle bulk creation
    if (Array.isArray(req.body)) {
      // Validate all courses
      for (const course of req.body) {
        const { title, code, department, unit, semester, program, level } = course;
        if (!title || !code || !unit || !semester || !program || !level) {
          return res.status(400).json({
            message: "All required fields (title, code, unit, semester, program, level) must be provided for each course",
          });
        }
        if (!mongoose.isValidObjectId(program) || (department && !mongoose.isValidObjectId(department))) {
          return res.status(400).json({ message: "Invalid program or department ID" });
        }
        // Restrict to admin's department
        if (department && !user.department.some(d => d._id.toString() === department)) {
          return res.status(403).json({ message: `You are not authorized to create courses for department ${department}` });
        }
      }
      // Check for duplicate course codes
      const codes = req.body.map((c) => c.code);
      const uniqueCodes = [...new Set(codes)];
      if (codes.length !== uniqueCodes.length) {
        return res.status(400).json({ message: "Duplicate course codes found in the request" });
      }
      const existingCourses = await Course.find({ code: { $in: codes } });
      if (existingCourses.length > 0) {
        const existingCodes = existingCourses.map((c) => c.code);
        return res.status(409).json({
          message: `Courses with codes [${existingCodes.join(", ")}] already exist`,
        });
      }
      // Validate program existence
      const programs = await Program.find({ _id: { $in: req.body.map((c) => c.program) } });
      if (programs.length !== new Set(req.body.map((c) => c.program)).size) {
        return res.status(400).json({ message: "One or more program IDs are invalid" });
      }
      // Create courses
      const newCourses = await Course.insertMany(req.body);
      const populatedCourses = await Course.find({ _id: { $in: newCourses.map((c) => c._id) } })
        .populate("program", "name degree")
        .populate("department", "name");
      return res.status(201).json({
        message: "Courses created successfully",
        courses: populatedCourses,
      });
    }
    // Single course creation
    const { title, code, description, department, unit, semester, program, level } = req.body;
    if (!title || !code || !unit || !semester || !program || !level) {
      return res.status(400).json({
        message: "All required fields (title, code, unit, semester, program, level) must be provided",
      });
    }
    if (!mongoose.isValidObjectId(program) || (department && !mongoose.isValidObjectId(department))) {
      return res.status(400).json({ message: "Invalid program or department ID" });
    }
    // Restrict to admin's department
    if (department && !user.department.some(d => d._id.toString() === department)) {
      return res.status(403).json({ message: `You are not authorized to create courses for department ${department}` });
    }
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(409).json({ message: `Course with code "${code}" already exists` });
    }
    const programExists = await Program.findById(program);
    if (!programExists) {
      return res.status(400).json({ message: "Invalid program ID" });
    }
    const newCourse = await Course.create({
      title,
      code,
      description,
      department: department || programExists.department, // Default to program's department
      unit,
      semester,
      program,
      level,
    });
    const populatedCourse = await Course.findById(newCourse._id)
      .populate("program", "name degree")
      .populate("department", "name");
    res.status(201).json({
      message: "Course created successfully",
      course: populatedCourse,
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Course with code "${req.body.code || req.body[0]?.code}" already exists`,
      });
    }
    res.status(500).json({ message: "Server error while creating course(s)" });
  }
};

export const registerCourses = async (req, res) => {
  try {
    const files = req.files || {};
    
    // Parse form data - handle both JSON strings and direct form fields
    let program, level, semester;
    
    // Check if data is coming as JSON string (common with multipart forms)
    if (req.body.data) {
      try {
        const parsedData = JSON.parse(req.body.data);
        program = parsedData.program;
        level = parsedData.level;
        semester = parsedData.semester;
      } catch (e) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid JSON data in form" 
        });
      }
    } else {
      // Direct form fields
      program = req.body.program;
      level = req.body.level;
      semester = req.body.semester;
    }
    
    const studentId = req.user._id;
    // Validate required fields
    if (!program || !level || !semester) {
      return res.status(400).json({ 
        success: false,
        message: "Program, level and semester are required" 
      });
    }
    // Validate IDs
    if (!mongoose.isValidObjectId(program)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid program ID" 
      });
    }
    // Validate program existence
    const programExists = await Program.findById(program);
    if (!programExists) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid program ID" 
      });
    }
    // Validate level and semester
    if (!["100", "200", "300", "400"].includes(level)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid level" 
      });
    }
    if (!["First Semester", "Second Semester"].includes(semester)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid semester" 
      });
    }
    // Check for existing registration
    const existingRegistration = await CourseRegistration.findOne({ 
      student: studentId, 
      program, 
      level, 
      semester 
    });
    if (existingRegistration) {
      return res.status(409).json({ 
        success: false,
        message: "Already registered for this semester. Update your existing registration instead." 
      });
    }
    const uploads = {
      courseRegistrationSlip: null,
      schoolFeesReceipt: null,
      hallDuesReceipt: null
    };
    // Course Registration Slip is mandatory for both semesters
    if (!files.courseRegistrationSlip || !Array.isArray(files.courseRegistrationSlip) || files.courseRegistrationSlip.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Course registration slip is required" 
      });
    }
    // Track uploaded files for potential cleanup
    const uploadedFiles = [];
    
    try {
      // Upload course registration slip
      const courseRegFile = files.courseRegistrationSlip[0];
      uploads.courseRegistrationSlip = await uploadFile(
        courseRegFile, 
        'course_registration_slips'
      );
      uploadedFiles.push(uploads.courseRegistrationSlip);
      // Handle semester-specific requirements
      if (semester === 'First Semester') {
        // First semester requires all three documents
        if (!files.schoolFeesReceipt || !Array.isArray(files.schoolFeesReceipt) || files.schoolFeesReceipt.length === 0) {
          return res.status(400).json({ 
            success: false,
            message: "School fees receipt is required for first semester" 
          });
        }
        if (!files.hallDuesReceipt || !Array.isArray(files.hallDuesReceipt) || files.hallDuesReceipt.length === 0) {
          return res.status(400).json({ 
            success: false,
            message: "Hall dues receipt is required for first semester" 
          });
        }
        // Upload school fees receipt
        const schoolFeesFile = files.schoolFeesReceipt[0];
        uploads.schoolFeesReceipt = await uploadFile(
          schoolFeesFile, 
          'school_fees_receipts'
        );
        uploadedFiles.push(uploads.schoolFeesReceipt);
        uploads.schoolFeesReceipt.uploadedAt = new Date();
        // Upload hall dues receipt
        const hallDuesFile = files.hallDuesReceipt[0];
        uploads.hallDuesReceipt = await uploadFile(
          hallDuesFile, 
          'hall_dues_receipts'
        );
        uploadedFiles.push(uploads.hallDuesReceipt);
        uploads.hallDuesReceipt.uploadedAt = new Date();
        // Create registration with pending payment status
        const registration = await CourseRegistration.create({
          student: studentId,
          program,
          level,
          semester,
          uploads,
          paymentStatus: 'pending'
        });
        // Generate payment reference for departmental dues
        const paymentReference = generatePaymentReference();
        const departmentalDuesAmount = 5000; // This should come from configuration
        // Create payment record
        const payment = await Payment.create({
          student: studentId,
          registration: registration._id,
          semester,
          amount: departmentalDuesAmount,
          currency: 'GHS', // Set currency to Ghana Cedis
          paymentType: 'departmental_dues',
          reference: paymentReference,
          status: 'pending'
        });
        // Add payment to registration
        registration.payments = [payment._id]; // Changed from push to direct assignment
        await registration.save();
        
        // Get the user with populated department
        const userWithDepartment = await User.findById(studentId)
          .populate('department', 'name');
        
        // Populate the registration with program data
        const populatedRegistration = await CourseRegistration.findById(registration._id)
          .populate('program', 'name degree');
        
        // Return payment required response
        return res.status(200).json({
          success: true,
          message: "Documents uploaded successfully. Proceed to payment for departmental dues",
          data: {
            registrationId: registration._id,
            paymentRequired: true,
            paymentDetails: {
              reference: paymentReference,
              amount: departmentalDuesAmount,
               currency: 'GHS',
              type: 'departmental_dues',
              description: `Departmental dues for ${semester} - ${level} level`
            },
            registrationInfo: {
              student: userWithDepartment, // Use the user with populated department
              program: programExists,
              level,
              semester,
              totalUnits: 0, // Since no courses are selected
              coursesCount: 0 // Since no courses are selected
            },
            registration: {
              ...populatedRegistration.toObject(),
              student: userWithDepartment // Override student with populated department
            }
          }
        });
      } else {
        // Second semester - only course registration slip is required
        // School fees receipt is optional (only if student owes)
        if (files.schoolFeesReceipt && Array.isArray(files.schoolFeesReceipt) && files.schoolFeesReceipt.length > 0) {
          const schoolFeesFile = files.schoolFeesReceipt[0];
          uploads.schoolFeesReceipt = await uploadFile(
            schoolFeesFile, 
            'school_fees_receipts'
          );
          uploadedFiles.push(uploads.schoolFeesReceipt);
          uploads.schoolFeesReceipt.uploadedAt = new Date();
        }
        // Determine if payment is needed based on school fees receipt
        const needsSchoolFeesPayment = !uploads.schoolFeesReceipt;
        
        const registration = await CourseRegistration.create({
          student: studentId,
          program,
          level,
          semester,
          uploads,
          paymentStatus: needsSchoolFeesPayment ? 'pending' : 'successful'
        });
        
        if (needsSchoolFeesPayment) {
          // Generate payment reference for school fees
          const paymentReference = generatePaymentReference();
          const schoolFeesAmount = 25000; // This should come from configuration
          const payment = await Payment.create({
            student: studentId,
            registration: registration._id,
            semester,
            amount: schoolFeesAmount,
                        currency: 'GHS', 
            paymentType: 'school_fees',
            reference: paymentReference,
            status: 'pending'
          });
          registration.payments = [payment._id]; // Changed from push to direct assignment
          await registration.save();
          
          // Get the user with populated department
          const userWithDepartment = await User.findById(studentId)
            .populate('department', 'name');
          
          // Populate the registration with program data
          const populatedRegistration = await CourseRegistration.findById(registration._id)
            .populate('program', 'name degree');
          
          return res.status(200).json({
            success: true,
            message: "Registration complete but school fees payment required",
            data: {
              registrationId: registration._id,
              paymentRequired: true,
              paymentDetails: {
                reference: paymentReference,
                amount: schoolFeesAmount,
                            currency: 'GHS', 
                type: 'school_fees',
                description: `School fees for ${semester} - ${level} level`
              },
              registrationInfo: {
                student: userWithDepartment, // Use the user with populated department
                program: programExists,
                level,
                semester,
                totalUnits: 0, // Since no courses are selected
                coursesCount: 0 // Since no courses are selected
              },
              registration: {
                ...populatedRegistration.toObject(),
                student: userWithDepartment // Override student with populated department
              }
            }
          });
        } else {
          // Get the user with populated department
          const userWithDepartment = await User.findById(studentId)
            .populate('department', 'name');
          
          // Populate the registration with program data
          const populatedRegistration = await CourseRegistration.findById(registration._id)
            .populate('program', 'name degree');
          
          return res.status(201).json({
            success: true,
            message: "Registration successful - no additional payment required",
            data: {
              registration: {
                ...populatedRegistration.toObject(),
                student: userWithDepartment // Override student with populated department
              },
              program: programExists,
              paymentRequired: false
            }
          });
        }
      }
    } catch (uploadError) {
      // Clean up uploaded files if registration fails
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            if (file.publicId) {
              await cloudinary.uploader.destroy(file.publicId);
            }
          } catch (cleanupError) {
            console.error("Error cleaning up uploaded file:", cleanupError);
          }
        }
      }
      throw uploadError;
    }
  } catch (error) {
    console.error("Course Registration Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during course registration",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


export const getAvailableCourses = async (req, res) => {
  try {
    const { program, level, semester } = req.query;
    const query = {};
    if (program) query.program = program;
    if (level) query.level = level;
    if (semester) query.semester = semester;
    
    // Validate ObjectId for program if provided
    if (program && !mongoose.isValidObjectId(program)) {
      return res.status(400).json({ message: "Invalid program ID" });
    }
    
    const courses = await Course.find(query).populate({
      path: "program",
      select: "name degree department",
      populate: {
        path: "department",
        select: "name", // Add more fields if needed
      },
    });
    
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
};

// Student: Get own registered courses
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const registrations = await CourseRegistration.find({ student: userId })
      .populate({
        path: 'program',
        populate: {
          path: 'department',
          model: 'Department'
        }
      })
      .populate({
        path: 'student',
        populate: {
          path: 'department',
          model: 'Department'
        }
      });
    
    // Transform uploads to documents array
    const transformedRegistrations = registrations.map((reg) => ({
      ...reg._doc,
      documents: [
        {
          _id: new mongoose.Types.ObjectId(),
          type: 'CourseRegistrationSlip',
          url: transformCloudinaryUrl(reg.uploads.courseRegistrationSlip?.url),
          verified: reg.uploads.courseRegistrationSlip?.verified || false,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          type: 'SchoolFeesReceipt',
          url: transformCloudinaryUrl(reg.uploads.schoolFeesReceipt?.url),
          verified: reg.uploads.schoolFeesReceipt?.verified || false,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          type: 'HallDuesReceipt',
          url: transformCloudinaryUrl(reg.uploads.hallDuesReceipt?.url),
          verified: reg.uploads.hallDuesReceipt?.verified || false,
        },
      ],
    }));
    
    const payments = await Payment.find({ student: userId }).select('semester amount status currency createdAt transactionId');
    
    res.status(200).json({
      registrations: transformedRegistrations,
      owingStatus: user.owingStatus || true,
      payments: payments || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses: ' + error.message });
  }
};

// Admin: Update a course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      code,
      description,
      department,
      unit,
      semester,
      program,
      level,
    } = req.body;
    
    // Validate course ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    
    // Validate provided ObjectIds
    if (program && !mongoose.isValidObjectId(program)) {
      return res.status(400).json({ message: "Invalid program ID" });
    }
    if (department && !mongoose.isValidObjectId(department)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }
    
    // Check for duplicate course code if provided
    if (code) {
      const existingCourse = await Course.findOne({ code, _id: { $ne: id } });
      if (existingCourse) {
        return res
          .status(409)
          .json({ message: `Course with code "${code}" already exists` });
      }
    }
    
    // Validate program existence if provided
    if (program) {
      const programExists = await Program.findById(program);
      if (!programExists) {
        return res.status(400).json({ message: "Invalid program ID" });
      }
    }
    
    // Update course
    const course = await Course.findByIdAndUpdate(
      id,
      { title, code, description, department, unit, semester, program, level },
      { new: true, runValidators: true }
    )
      .populate("program", "name degree")
      .populate("department", "name");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Course with code "${req.body.code}" already exists`,
      });
    }
    res.status(500).json({ message: "Server error while updating course" });
  }
};

// Admin: Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate course ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    
    // Check for active registrations
    const registrations = await CourseRegistration.find({ courses: id });
    if (registrations.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete course with active registrations" });
    }
    
    // Delete course
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ message: "Server error while deleting course" });
  }
};