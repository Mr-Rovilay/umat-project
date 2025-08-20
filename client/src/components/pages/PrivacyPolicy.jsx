// components/pages/PrivacyPolicy.jsx
import React from 'react';
import { Shield, Lock, Database, Eye, Mail, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <>
      <div>
        <title>Privacy Policy | Student Portal</title>
        <meta name="description" content="Privacy Policy for Student Portal - Learn how we collect, use, and protect your personal information." />
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Welcome to the Student Portal. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our website 
                  and tell you about your privacy rights and how the law protects you.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  This policy applies to all users of our website and any services offered through it.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Database className="w-6 h-6 text-emerald-500 mr-2" />
                  Information We Collect
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Full name</li>
                      <li>• Email address</li>
                      <li>• Student ID number</li>
                      <li>• Contact information</li>
                      <li>• Academic records</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Automatically Collected Information</h3>
                    <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• IP address</li>
                      <li>• Browser type and version</li>
                      <li>• Device information</li>
                      <li>• Pages visited</li>
                      <li>• Time and date of visits</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-emerald-500 mr-2" />
                  How We Use Your Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">To Provide and Maintain Our Service</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        To process your registration, manage your academic records, and provide access to student resources.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">To Communicate With You</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        To send you important announcements, academic updates, and respond to your inquiries.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">For Security and Fraud Prevention</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        To protect our platform and users from unauthorized access, fraud, and other security threats.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-emerald-500 mr-2" />
                  Data Security
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and vulnerability testing</li>
                  <li>Restricted access to personal data on a need-to-know basis</li>
                  <li>Secure storage facilities and systems</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Privacy Rights</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have certain rights regarding your personal information. These may vary depending on your jurisdiction, 
                  but generally include:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to object to or restrict processing of your personal information</li>
                  <li>The right to data portability</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-emerald-500 mr-2" />
                  Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                     <a href='mailto:registrar@umat.edu.gh'>✉️ registrar@umat.edu.gh</a><br />
                    Phone: +1 (234) 567-8900<br />
                    Address: 123 University Ave, Academic City, AC 12345
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;