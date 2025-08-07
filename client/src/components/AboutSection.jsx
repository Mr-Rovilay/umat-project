import React, { useState, useEffect, useRef } from 'react'
import { Award, Users, BookOpen, Microscope, MapPin, Calendar, Trophy, Globe } from 'lucide-react'

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('heritage')
  const sectionRef = useRef(null)
  
  const stats = [
    { icon: Calendar, number: "72", label: "Years of Excellence", description: "Since 1952" },
    { icon: BookOpen, number: "45+", label: "Degree Programs", description: "Undergraduate & Graduate" },
    { icon: Users, number: "8,500+", label: "Students", description: "Active Enrollment" },
    { icon: Microscope, number: "12", label: "Research Centers", description: "State-of-the-art Facilities" },
  ]
  
  const achievements = [
    {
      title: "Premier Mining University",
      description: "Leading mining and technology education in West Africa",
      icon: Trophy
    },
    {
      title: "Industry Partnerships",
      description: "Strong connections with global mining corporations",
      icon: Globe
    },
    {
      title: "Research Excellence",
      description: "Cutting-edge research in sustainable mining practices",
      icon: Microscope
    },
    {
      title: "Alumni Network",
      description: "15,000+ graduates leading industries worldwide",
      icon: Users
    }
  ]
  
  const tabs = [
    {
      id: 'heritage',
      label: 'Our Heritage',
      content: {
        title: 'Seven Decades of Excellence',
        description: 'Founded in 1952, the University of Mines and Technology has been Ghana\'s beacon of technological innovation and mining education. From humble beginnings as a School of Mines, we\'ve evolved into West Africa\'s premier institution for engineering, technology, and earth sciences.',
        highlights: [
          'First mining institution in Ghana',
          'Trained over 15,000 professionals',
          'Pioneered sustainable mining practices',
          'Leading research in renewable energy'
        ]
      }
    },
    {
      id: 'mission',
      label: 'Mission & Vision',
      content: {
        title: 'Shaping Tomorrow\'s Leaders',
        description: 'To provide world-class higher education in mining, technology, and related disciplines while fostering innovation, research excellence, and sustainable development practices that benefit Ghana and the global community.',
        highlights: [
          'Excellence in education and research',
          'Innovation and technological advancement',
          'Sustainable development practices',
          'Global competitiveness and leadership'
        ]
      }
    },
    {
      id: 'impact',
      label: 'Global Impact',
      content: {
        title: 'Transforming Industries Worldwide',
        description: 'Our graduates and research initiatives have made significant contributions to mining operations, environmental sustainability, and technological advancement across Africa and beyond, establishing UMAT as a globally recognized center of excellence.',
        highlights: [
          'Alumni in 50+ countries',
          '200+ industry partnerships',
          '1000+ research publications',
          'Leading green mining initiatives'
        ]
      }
    }
  ]
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const currentTab = tabs.find(tab => tab.id === activeTab)
  
  // SVG pattern as a properly escaped string
  const svgPattern = "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669'%3E%3Cpath d='M50 50L60 40L50 30L40 40Z' opacity='0.1'/%3E%3Cpath d='M20 20L30 10L20 0L10 10Z' opacity='0.1'/%3E%3Cpath d='M80 80L90 70L80 60L70 70Z' opacity='0.1'/%3E%3C/g%3E%3C/svg%3E"
  
  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{ backgroundImage: `url('${svgPattern}')` }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            <span>Tarkwa, Western Region, Ghana</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">UMAT</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ghana's premier institution for mining, engineering, and technology education since 1952
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</div>
              </div>
            )
          })}
        </div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content - Tabbed Information */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentTab.content.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {currentTab.content.description}
                </p>
              </div>
              
              <div className="space-y-3">
                {currentTab.content.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <div className="pt-4">
                <button className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Learn More About UMAT
                  <Award className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Content - Visual Elements */}
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            {/* Main Image */}
            <div className="relative mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/campus.jpg" 
                  alt="UMAT Campus" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">#1 Mining University</div>
                      <div className="text-sm text-gray-600">in West Africa</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
            </div>
            
            {/* Achievement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors">
                        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection