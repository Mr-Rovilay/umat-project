// controllers/uploadController.js
import multer from 'multer';
import cloudinary from 'cloudinary';
import { unlink } from 'fs/promises';
import CourseRegistration from '../models/CourseRegistration.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Configure Cloudinary (as in newsPostController.js)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

// Upload PDFs for course registration
// controllers/uploadController.js
export const uploadCourseDocuments = async (req, res) => {
  try {
    const { registrationId, semester } = req.body;
    const files = req.files; // Expect courseSlip, schoolFeesReceipt, departmentalDuesReceipt

    // Validate registrationId
    if (!mongoose.isValidObjectId(registrationId)) {
      return res.status(400).json({ message: 'Invalid registration ID' });
    }

    // Find registration and student details
    const registration = await CourseRegistration.findById(registrationId)
      .populate('student', 'department');

    if (!registration) {
      return res.status(404).json({ message: 'Course registration not found' });
    }

    // Authorization: student or same-department admin
    const regStudentId = registration.student._id
      ? registration.student._id.toString()
      : registration.student.toString();

    if (regStudentId !== req.user._id.toString()) {
      const user = await User.findById(req.user._id).populate('department');

      const sameDept = Array.isArray(user.department) &&
        user.department.some(dept => registration.student.department.includes(dept._id));

      if (req.user.role !== 'admin' || !sameDept) {
        return res.status(403).json({ message: 'Unauthorized to upload for this registration' });
      }
    }

    // Check semester match
    if (registration.semester !== semester) {
      return res.status(400).json({ message: 'Semester mismatch' });
    }

    let uploads = registration.uploads || {};

    // Helper to upload file to Cloudinary
    const uploadToCloudinary = async (filePath) => {
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'course_uploads',
        resource_type: 'raw',
      });
      await unlink(filePath);
      return { url: result.secure_url, publicId: result.public_id };
    };

    // Upload course slip
    if (files.courseSlip) {
      uploads.courseSlip = await uploadToCloudinary(files.courseSlip[0].path);
    }

    // Upload school fees receipt & departmental dues receipt only for first semester
    if (semester === 'First Semester') {
      if (files.schoolFeesReceipt) {
        uploads.schoolFeesReceipt = await uploadToCloudinary(files.schoolFeesReceipt[0].path);
      }
      if (files.departmentalDuesReceipt) {
        uploads.departmentalDuesReceipt = await uploadToCloudinary(files.departmentalDuesReceipt[0].path);
      }
    }

    registration.uploads = uploads;
    await registration.save();

    // Update owing status if all required docs are present
    if (
      semester === 'First Semester' &&
      uploads.courseSlip &&
      uploads.schoolFeesReceipt &&
      uploads.departmentalDuesReceipt
    ) {
      await User.findByIdAndUpdate(req.user._id, { owingStatus: false });
    }

    res.status(200).json({ message: 'Documents uploaded successfully', registration });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
};


// Retrieve a specific document
export const getDocument = async (req, res) => {
  try {
    const { registrationId, documentType } = req.query;
    if (!mongoose.isValidObjectId(registrationId)) {
      return res.status(400).json({ message: 'Invalid registration ID' });
    }
    if (!['courseSlip', 'schoolFeesReceipt', 'departmentalDuesReceipt'].includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const registration = await CourseRegistration.findById(registrationId).populate('student', 'department');
    if (!registration) {
      return res.status(404).json({ message: 'Course registration not found' });
    }

    // Authorization check
    const user = await User.findById(req.user._id).populate('department');
    if (registration.student.toString() !== req.user._id.toString()) {
      if (req.user.role !== 'admin' || !user.department.some(dept => registration.student.department.includes(dept._id))) {
        return res.status(403).json({ message: 'Unauthorized to view this document' });
      }
    }

    const upload = registration.uploads?.[documentType];
    if (!upload || !upload.url) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Return the document URL (Cloudinary handles secure access)
    res.status(200).json({ url: upload.url });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error while fetching document' });
  }
};