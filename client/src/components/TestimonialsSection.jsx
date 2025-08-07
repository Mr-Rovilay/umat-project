import React from 'react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "UMAT provided me with the technical skills and industry exposure needed to excel in my career. The practical approach to education is unmatched.",
      name: "Kwame Asante",
      role: "Mining Engineer, Class of 2015",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The research opportunities at UMAT are incredible. I was able to work on cutting-edge projects that made a real impact in the industry.",
      name: "Ama Mensah",
      role: "Research Scientist, Class of 2018",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The supportive community and world-class faculty at UMAT helped me develop both professionally and personally. I'm proud to be an alumna.",
      name: "Kojo Johnson",
      role: "Software Engineer, Class of 2020",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-20 bg-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our <span className="text-emerald-200">Alumni Say</span>
          </h2>
          <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
            Hear from our successful graduates about their experience at UMAT.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white">
              <div className="text-4xl text-emerald-200 mb-4">"</div>
              <p className="text-lg mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-emerald-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection