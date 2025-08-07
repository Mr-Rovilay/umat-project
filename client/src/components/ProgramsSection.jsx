import React, { useState, useEffect, useRef } from 'react'
import { 
  Pickaxe, 
  Computer, 
  Cog, 
  FlaskConical, 
  Zap, 
  Gem, 
  GraduationCap,
  Clock,
  Users,
  Award,
  ChevronRight,
  BookOpen,
  Building,
  Microscope,
  Calculator,
  Wrench,
  MapPin
} from 'lucide-react'

const ProgramsSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState('undergraduate')
  const [hoveredProgram, setHoveredProgram] = useState(null)
  const sectionRef = useRef(null)
  
  const programs = {
    undergraduate: [
      {
        name: "Mining Engineering",
        icon: Pickaxe,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        description: "Comprehensive training in mining operations, safety protocols, and sustainable extraction techniques.",
        duration: "4 years",
        students: "450+",
        rating: "4.8",
        highlights: ["Surface Mining", "Underground Mining", "Mine Safety", "Environmental Impact"],
        career: ["Mining Engineer", "Mine Manager", "Safety Officer", "Consultant"]
      },
      {
        name: "Computer Science",
        icon: Computer,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        description: "Cutting-edge curriculum covering software development, AI, cybersecurity, and data science.",
        duration: "4 years",
        students: "680+",
        rating: "4.9",
        highlights: ["Software Engineering", "Machine Learning", "Cybersecurity", "Data Analytics"],
        career: ["Software Developer", "Data Scientist", "System Architect", "Tech Lead"]
      },
      {
        name: "Mechanical Engineering",
        icon: Cog,
        color: "from-red-500 to-pink-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        description: "Design, analysis, and manufacturing of mechanical systems with focus on innovation.",
        duration: "4 years",
        students: "520+",
        rating: "4.7",
        highlights: ["Thermodynamics", "Fluid Mechanics", "Manufacturing", "Design Engineering"],
        career: ["Design Engineer", "Project Manager", "R&D Engineer", "Consultant"]
      },
      {
        name: "Geological Engineering",
        icon: FlaskConical,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        description: "Study of earth materials and processes for engineering and environmental applications.",
        duration: "4 years",
        students: "320+",
        rating: "4.6",
        highlights: ["Rock Mechanics", "Hydrogeology", "Environmental Geology", "Geotechnics"],
        career: ["Geotechnical Engineer", "Environmental Consultant", "Hydrogeologist", "Researcher"]
      },
      {
        name: "Electrical Engineering",
        icon: Zap,
        color: "from-yellow-500 to-amber-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        description: "Power systems, electronics, telecommunications, and renewable energy technologies.",
        duration: "4 years",
        students: "590+",
        rating: "4.8",
        highlights: ["Power Systems", "Electronics", "Telecommunications", "Renewable Energy"],
        career: ["Electrical Engineer", "Power Systems Engineer", "Electronics Designer", "Project Engineer"]
      },
      {
        name: "Mineral Engineering",
        icon: Gem,
        color: "from-purple-500 to-violet-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        description: "Processing and beneficiation of minerals with emphasis on efficiency and sustainability.",
        duration: "4 years",
        students: "280+",
        rating: "4.7",
        highlights: ["Mineral Processing", "Metallurgy", "Process Control", "Environmental Management"],
        career: ["Process Engineer", "Metallurgist", "Plant Manager", "Technical Specialist"]
      }
    ],
    postgraduate: [
      {
        name: "PhD in Mining Engineering",
        icon: GraduationCap,
        color: "from-emerald-600 to-teal-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        description: "Advanced research in mining technology, sustainability, and innovation.",
        duration: "3-5 years",
        students: "45+",
        rating: "4.9",
        highlights: ["Research Methodology", "Advanced Mining", "Sustainability", "Innovation"],
        career: ["Research Scientist", "Professor", "Technical Director", "Consultant"]
      },
      {
        name: "MSc Computer Science",
        icon: Computer,
        color: "from-blue-600 to-indigo-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        description: "Specialized master's program in AI, machine learning, and advanced computing.",
        duration: "2 years",
        students: "120+",
        rating: "4.8",
        highlights: ["Artificial Intelligence", "Advanced Algorithms", "Research Projects", "Industry Partnership"],
        career: ["Senior Developer", "Research Engineer", "Tech Lead", "Data Scientist"]
      },
      {
        name: "MSc Environmental Engineering",
        icon: FlaskConical,
        color: "from-green-600 to-lime-600",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        description: "Environmental protection, waste management, and sustainable development.",
        duration: "2 years",
        students: "85+",
        rating: "4.7",
        highlights: ["Environmental Assessment", "Waste Management", "Sustainability", "Policy Analysis"],
        career: ["Environmental Engineer", "Sustainability Consultant", "Policy Advisor", "Project Manager"]
      }
    ]
  }
  
  const categories = [
    { id: 'undergraduate', label: 'Undergraduate Programs', icon: BookOpen, count: programs.undergraduate.length },
    { id: 'postgraduate', label: 'Postgraduate Programs', icon: GraduationCap, count: programs.postgraduate.length }
  ]
  
  const stats = [
    { icon: BookOpen, label: "Total Programs", value: "45+" },
    { icon: Users, label: "Students Enrolled", value: "8,500+" },
    { icon: Award, label: "Industry Partners", value: "200+" },
    { icon: Building, label: "Research Labs", value: "25+" }
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
  
  // SVG pattern as a properly escaped string
  const svgPattern = "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' /%3E%3C/g%3E%3C/svg%3E"
  
  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
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
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>World-Class Education</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Academic <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Programs</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover our comprehensive range of undergraduate and postgraduate programs designed to prepare the next generation of industry leaders and innovators.
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            )
          })}
        </div>
        
        {/* Category Toggle */}
        <div className={`flex justify-center mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl inline-flex space-x-1">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Programs Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {programs[activeCategory].map((program, index) => {
            const Icon = program.icon
            return (
              <div 
                key={index}
                onMouseEnter={() => setHoveredProgram(index)}
                onMouseLeave={() => setHoveredProgram(null)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 group"
              >
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${program.color}`}></div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${program.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Award className="h-3 w-3" />
                        <span className="text-xs font-medium">{program.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {program.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {program.description}
                  </p>
                  
                  {/* Program Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{program.students} students</span>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {program.highlights.slice(0, hoveredProgram === index ? 4 : 2).map((highlight, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                      {program.highlights.length > 2 && hoveredProgram !== index && (
                        <span className="text-xs text-gray-400">+{program.highlights.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Career Paths - Show on hover */}
                  {hoveredProgram === index && (
                    <div className="mb-4 animate-fadeIn">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Career Opportunities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.career.map((career, idx) => (
                          <span key={idx} className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <button className="w-full flex items-center justify-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium py-3 rounded-lg transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <span>Learn More</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>     
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default ProgramsSection