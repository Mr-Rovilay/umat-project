// utils/email.js
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // For development/testing, you can use a test service like Ethereal
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    return nodemailer.createTestAccount().then(testAccount => {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment');
  }

  // For production, use the configured email service
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, firstName, resetUrl) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Student Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
            <h2 style="color: #10b981; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #333; margin-bottom: 20px;">Hello ${firstName},</p>
            <p style="color: #333; margin-bottom: 20px;">We received a request to reset your password. Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-bottom: 20px;">Reset Password</a>
            <p style="color: #333; margin-bottom: 20px;">If you didn't request this, please ignore this email.</p>
            <p style="color: #333; margin-bottom: 20px;">This link will expire in 30 minutes.</p>
            <p style="color: #333;">Thank you,<br>Student Portal Team</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // For development with Ethereal, log the URL to preview the email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};