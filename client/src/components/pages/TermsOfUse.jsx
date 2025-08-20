// components/pages/TermsOfUse.jsx
import React from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <>
      <div>
        <title>Terms of Use | Student Portal</title>
        <meta name="description" content="Terms of Use for Student Portal - Read the terms and conditions for using our services." />
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Terms of Use
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
                  Welcome to the Student Portal. These Terms of Use constitute a legally binding agreement made between you, 
                  whether personally or on behalf of an entity ("you"), and the Student Portal ("we," "us," or "our"), 
                  concerning your access to and use of the studentportal.edu website as well as any other media form, 
                  media channel, mobile website or mobile application related, linked, or otherwise connected thereto 
                  (collectively, the "Site").
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use. 
                  IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE 
                  AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                </p>
              </section>

              {/* Intellectual Property Rights */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mr-2" />
                  Intellectual Property Rights
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, 
                  software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") 
                  and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or 
                  licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights 
                  and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. 
                  Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, 
                  reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, 
                  distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express 
                  prior written permission.
                </p>
              </section>

              {/* User Representations */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Representations</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  By using the Site, you represent and warrant that:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>You have the legal capacity and you agree to comply with these Terms of Use</li>
                  <li>You are not a minor in the jurisdiction in which you reside</li>
                  <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise</li>
                  <li>You will not use the Site for any illegal or unauthorized purpose</li>
                  <li>Your use of the Site will not violate any applicable law or regulation</li>
                </ul>
              </section>

              {/* Prohibited Activities */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  Prohibited Activities
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You may not access or use the Site for any purpose other than that for which we make the Site available. 
                  The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  As a user of the Site, you agree not to:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, 
                  a collection, compilation, database, or directory without written permission from us</li>
                  <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users 
                  by electronic or other means for the purpose of sending unsolicited email</li>
                  <li>Use the Site to advertise or offer to sell goods and services not affiliated with the Student Portal</li>
                  <li>Engage in any automated use of the system, such as using scripts to send comments or messages, 
                  or using any data mining, robots, or similar data gathering and extraction tools</li>
                  <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site</li>
                  <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you</li>
                </ul>
              </section>

              {/* Academic Integrity */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
                  Academic Integrity
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  As an educational platform, we are committed to maintaining the highest standards of academic integrity. 
                  By using this Site, you agree to:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>Submit only your own original work for assignments and assessments</li>
                  <li>Properly cite all sources and give credit to others' work</li>
                  <li>Not share your login credentials with any other person</li>
                  <li>Not assist others in violating academic integrity standards</li>
                  <li>Report any observed violations of academic integrity</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  Violations of academic integrity may result in disciplinary action, including but not limited to, 
                  failing grades, suspension of account privileges, or referral to university disciplinary committees.
                </p>
              </section>

              {/* Term and Termination */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-emerald-500 mr-2" />
                  Term and Termination
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  These Terms of Use shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER 
                  PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, 
                  DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Use, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    <a href='mailto:registrar@umat.edu.gh'>✉️ registrar@umat.edu.gh</a><br />
                    Phone: +1 (234) 567-8901<br />
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

export default TermsOfUse;