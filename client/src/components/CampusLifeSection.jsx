import React from 'react'

const CampusLifeSection = () => {
  const facilities = [
    { name: "Modern Laboratories", icon: "🔬", description: "State-of-the-art research facilities" },
    { name: "Digital Library", icon: "📚", description: "Extensive collection of digital resources" },
    { name: "Sports Complex", icon: "⚽", description: "Olympic-standard sports facilities" },
    { name: "Student Hostels", icon: "🏠", description: "Comfortable on-campus accommodation" }
  ];

  return (
    <section className="py-2 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Campus <span className="text-emerald-600">Life</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience vibrant campus life with world-class facilities and a supportive community.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="text-3xl mb-3">{facility.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{facility.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{facility.description}</p>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <img src="/campus-1.jpg" 
                 alt="Campus Life" 
                 className="rounded-2xl shadow-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="text-2xl font-bold mb-2">Join Our Community</div>
              <div className="text-lg">8,500+ students from across Africa</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection