import React from 'react'

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-700 to-teal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Join <span className="text-emerald-200">UMaT</span>?
        </h2>
        <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-10">
          Start your journey towards becoming a leader in mining, engineering, and technology. Apply now to join our community of innovators.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 shadow-lg">
            Apply Now
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300">
            Schedule a Visit
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection