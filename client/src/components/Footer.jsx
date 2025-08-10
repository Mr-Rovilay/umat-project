import React from 'react'

const Footer = () => {
  const quickLinks = [
    { name: "Admissions", href: "/admissions" },
    { name: "Academic Calendar", href: "/calendar" },
    { name: "Library", href: "/library" },
    { name: "Research", href: "/research" },
    { name: "Careers", href: "/careers" }
  ];

  const importantLinks = [
    { name: "Student Portal", href: "/portal" },
    { name: "Staff Directory", href: "/staff" },
    { name: "Alumni", href: "/alumni" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", href: "https://facebook.com/UMat" },
    { name: "Twitter", icon: "🐦", href: "https://twitter.com/UMat" },
    { name: "LinkedIn", icon: "💼", href: "https://linkedin.com/school/UMat" },
    { name: "YouTube", icon: "📺", href: "https://youtube.com/UMat" },
    { name: "Instagram", icon: "📷", href: "https://instagram.com/UMat" }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img src="/UMat-logo.png" alt="UMat Logo" className="h-10 w-10" />
              <div>
                <div className="text-xl font-bold">UMat</div>
                <div className="text-xs text-gray-400">University of Mines and Technology</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Ghana's premier institution for mining, engineering, and technology education since 1952.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="text-gray-400 hover:text-white transition-colors duration-300 text-xl">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Important Links</h3>
            <ul className="space-y-3">
              {importantLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-3">
              <div>University of Mines and Technology</div>
              <div>P.O. Box 237, Tarkwa, Ghana</div>
              <div>📞 +233 3123 45678</div>
              <div>✉️ info@UMat.edu.gh</div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} University of Mines and Technology. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Use</a>
              <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors duration-300">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer