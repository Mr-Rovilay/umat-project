import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle,
  BookOpen,
  GraduationCap,
  CreditCard,
  FileText,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: "What is the Student Portal?",
      answer: "The Student Portal is a comprehensive online platform designed to streamline academic processes for students. It allows you to register for courses, view your grades, make payments, access academic resources, and stay updated with university announcements all in one place.",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 2,
      category: 'general',
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Register' button on the homepage. Fill in your personal details, academic information, and create a secure password. Once submitted, your account will be created and you can log in immediately.",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 3,
      category: 'general',
      question: "I forgot my password. How can I reset it?",
      answer: "Click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a link to reset your password. The reset link will expire in 30 minutes for security reasons.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 4,
      category: 'registration',
      question: "How do I register for courses?",
      answer: "To register for courses, log in to your account and navigate to the 'Course Registration' section. Select your program, level, and semester. Upload the required documents (course registration slip and payment receipts), then submit your registration. If payment is required, you'll be redirected to complete the payment process.",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 5,
      category: 'registration',
      question: "Can I edit my registration after submission?",
      answer: "Yes, you have a 7-day grace period after registration to edit your uploaded documents. After this period, you'll need to contact the student affairs office for any changes. Note that level and semester selections cannot be changed after submission.",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 6,
      category: 'registration',
      question: "What documents do I need for registration?",
      answer: "For first semester registration, you'll need: Course Registration Slip, School Fees Receipt, and Hall Dues Receipt. For second semester, you only need the Course Registration Slip. All documents should be in PDF or image format (PNG, JPG) and under 10MB in size.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 7,
      category: 'payment',
      question: "What payment methods are accepted?",
      answer: "We accept payments through Paystack, which supports various payment methods including debit/credit cards, bank transfers, and mobile money. All transactions are secure and encrypted.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 8,
      category: 'payment',
      question: "How do I know if my payment was successful?",
      answer: "After completing your payment, you'll be redirected back to the portal with a success message. You'll also receive a payment confirmation email. You can always check your payment status in the 'My Courses' section.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 9,
      category: 'payment',
      question: "Can I get a refund if I make a payment by mistake?",
      answer: "Refunds are handled on a case-by-case basis. If you've made an erroneous payment, please contact the bursar's office immediately with your payment details and transaction ID. Refund processing may take 5-10 business days.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 10,
      category: 'technical',
      question: "The portal is not loading properly. What should I do?",
      answer: "First, try clearing your browser cache and cookies. Ensure you have a stable internet connection. Try using a different browser (Chrome, Firefox, or Safari are recommended). If the issue persists, contact our technical support team.",
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      id: 11,
      category: 'technical',
      question: "I'm having trouble uploading my documents. What's wrong?",
      answer: "Make sure your documents are in the correct format (PDF, PNG, or JPG) and under 10MB in size. Check that your file isn't corrupted. If you continue to face issues, try using a different device or browser.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 12,
      category: 'technical',
      question: "Is the portal mobile-friendly?",
      answer: "Yes, the Student Portal is fully responsive and works seamlessly on mobile devices, tablets, and desktops. You can access all features from any device with an internet connection.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: 13,
      category: 'account',
      question: "How do I update my personal information?",
      answer: "Log in to your account and go to 'Profile Settings'. You can update your contact information, profile picture, and other personal details. Some information like your student ID cannot be changed and requires administrative approval.",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 14,
      category: 'account',
      question: "How do I change my password?",
      answer: "Go to 'Profile Settings' and click on 'Change Password'. You'll need to enter your current password and then create a new one. Your new password must be at least 6 characters long and should include a mix of letters, numbers, and special characters.",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 15,
      category: 'account',
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We comply with data protection regulations and regularly update our security measures to protect your data.",
      icon: <AlertCircle className="w-5 h-5" />
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'general', name: 'General', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'registration', name: 'Registration', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'technical', name: 'Technical', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'account', name: 'Account', icon: <User className="w-5 h-5" /> }
  ];

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "support@studentportal.edu",
      action: "Email Us",
      href: "mailto:support@studentportal.edu"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "+1 (234) 567-8900",
      action: "Call Us",
      href: "tel:+12345678900"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Available Mon-Fri, 9AM-5PM",
      action: "Start Chat",
      href: "#"
    }
  ];

  return (
    <>
      <div>
        <title>Frequently Asked Questions | Student Portal</title>
        <meta name="description" content="Find answers to common questions about the Student Portal. Get help with registration, payments, account management, and more." />
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Find answers to common questions about using the Student Portal
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:outline-none transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Browse by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name + ' Questions'}
            </h2>
            
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4 max-w-4xl mx-auto">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4 text-emerald-500">
                          {faq.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedQuestion === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedQuestion === faq.id && (
                      <div className="px-6 pb-5">
                        <div className="pl-9 border-l-2 border-emerald-200 dark:border-emerald-800">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or browse a different category
                </p>
              </div>
            )}
          </div>

          {/* Contact Support Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Still need help?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        {method.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {method.description}
                    </p>
                    <Link
                      to={method.href}
                      className="inline-flex items-center justify-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-300"
                    >
                      {method.action}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;