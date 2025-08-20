// components/pages/Accessibility.jsx
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Keyboard, Eye, Volume2, Contrast, Smartphone, UniversityIcon, University } from 'lucide-react';

const Accessibility = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Accessibility Statement | Student Portal</title>
        <meta name="description" content="Accessibility Statement for Student Portal - Our commitment to accessibility for all users." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
              <UniversityIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Accessibility Statement
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our commitment to accessibility for all users
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  At Student Portal, we are committed to ensuring digital accessibility for people with disabilities. 
                  We continually improve the user experience for everyone and apply the relevant accessibility standards.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  This accessibility statement applies to the Student Portal website (studentportal.edu) and aims to achieve 
                  conformance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
                </p>
              </section>

              {/* Accessibility Features */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <University className="w-6 h-6 text-emerald-500 mr-2" />
                  Accessibility Features
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Keyboard className="w-5 h-5 text-emerald-500 mr-2" />
                      Keyboard Navigation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our website can be fully navigated using only a keyboard. All interactive elements are accessible via Tab, 
                      Enter, and Space keys.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Contrast className="w-5 h-5 text-emerald-500 mr-2" />
                      High Contrast Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We support high contrast modes and ensure text remains readable with sufficient contrast against backgrounds.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Eye className="w-5 h-5 text-emerald-500 mr-2" />
                      Screen Reader Support
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our site is optimized for screen readers with proper ARIA labels, semantic HTML, and descriptive alt text.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Volume2 className="w-5 h-5 text-emerald-500 mr-2" />
                      Text-to-Speech
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Content is structured to work well with text-to-speech tools and other assistive technologies.
                    </p>
                  </div>
                </div>
              </section>

              {/* Accessibility Standards */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accessibility Standards</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We aim to comply with the following accessibility standards:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
                  <li>Section 508 of the Rehabilitation Act</li>
                  <li>Accessible Rich Internet Applications (ARIA) best practices</li>
                  <li>HTML5 semantic elements</li>
                  <li>CSS responsive design for all device sizes</li>
                </ul>
              </section>

              {/* Technical Specifications */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Smartphone className="w-6 h-6 text-emerald-500 mr-2" />
                  Technical Specifications
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browser Compatibility</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our website is designed to work with the following browsers:
                    </p>
                    <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 mt-2">
                      <li>Chrome (latest two versions)</li>
                      <li>Firefox (latest two versions)</li>
                      <li>Safari (latest two versions)</li>
                      <li>Edge (latest two versions)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Screen Reader Support</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our website is tested and optimized for:
                    </p>
                    <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 mt-2">
                      <li>JAWS (Job Access With Speech)</li>
                      <li>NVDA (NonVisual Desktop Access)</li>
                      <li>VoiceOver (macOS and iOS)</li>
                      <li>TalkBack (Android)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile Accessibility</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our responsive design ensures accessibility across all device sizes, with touch-friendly 
                      controls and appropriate text sizing.
                    </p>
                  </div>
                </div>
              </section>
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ongoing Efforts</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We are continuously working to improve the accessibility of our website. Our ongoing efforts include:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                  <li>Regular accessibility audits by both internal teams and third-party experts</li>
                  <li>Training for our content creators and developers on accessibility best practices</li>
                  <li>Incorporating accessibility requirements into our design and development processes</li>
                  <li>Monitoring user feedback and addressing accessibility concerns promptly</li>
                  <li>Staying updated with evolving accessibility standards and technologies</li>
                </ul>
              </section>
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Feedback</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We welcome your feedback on the accessibility of the Student Portal. Please let us know if you encounter 
                  accessibility barriers:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    Email: accessibility@studentportal.edu<br />
                    Phone: +1 (234) 567-8902<br />
                    Mail: Accessibility Coordinator, 123 University Ave, Academic City, AC 12345
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  We try to respond to accessibility feedback within 5 business days and will consider your input as 
                  we evaluate ways to accommodate all of our users and our overall accessibility policies.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accessibility Coordinator</h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    If you have any questions about this accessibility statement or need assistance accessing our services, 
                    please contact our Accessibility Coordinator:
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">
                    Name: Alex Johnson<br />
                    Title: Accessibility Coordinator<br />
                    <a href='mailto:registrar@umat.edu.gh'>✉️ registrar@umat.edu.gh</a> <br/>
                    Phone: +1 (234) 567-8902
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Accessibility;