import React from 'react'

const NewsEventsSection = () => {
  const newsItems = [
    { 
      title: "UMaT Wins Best Engineering University Award", 
      date: "May 15, 2023", 
      excerpt: "Recognized for excellence in engineering education and research innovation.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    { 
      title: "New Research Center for Sustainable Mining", 
      date: "April 28, 2023", 
      excerpt: "Launching a state-of-the-art facility focused on eco-friendly mining technologies.",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    { 
      title: "International Mining Conference 2023", 
      date: "June 10-12, 2023", 
      excerpt: "Join industry leaders and researchers at our annual conference.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            News & <span className="text-emerald-600">Events</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest happenings at UMaT and upcoming events.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.excerpt}</p>
                {/* <button className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                  Read More →
                </button> */}
              </div>
            </div>
          ))}
        </div>
        
        {/* <div className="text-center mt-12">
          <button className="border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
            View All News
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default NewsEventsSection