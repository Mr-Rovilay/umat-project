import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { ChevronRight, Play, Award, Users, BookOpen, Microscope, ArrowDown } from 'lucide-react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  const slides = [
    {
      title: "Shaping Tomorrow's Engineers",
      subtitle: "Leading Excellence in Mining & Technology Education",
      description: "Join Ghana's premier institution for mining, engineering, and technology. Where innovation meets tradition to forge the next generation of industry leaders.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      cta: "Explore Programs",
      stats: { number: "50+", label: "Years of Excellence" }
    },
    {
      title: "Innovation in Mining Technology",
      subtitle: "Research That Powers Industries",
      description: "Cutting-edge research facilities and world-class faculty driving breakthroughs in mining technology, sustainable engineering, and industrial innovation.",
      image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      cta: "Research Centers",
      stats: { number: "1000+", label: "Research Projects" }
    },
    {
      title: "Global Leaders in Mining Education",
      subtitle: "Connect. Learn. Lead.",
      description: "Join a vibrant community of scholars, researchers, and industry professionals dedicated to advancing mining and technology education across Africa and beyond.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      cta: "Join Community",
      stats: { number: "15,000+", label: "Alumni Worldwide" }
    }
  ]
  
  const achievements = [
    { icon: Award, number: "#1", label: "Mining University in West Africa" },
    { icon: Users, number: "8,500+", label: "Active Students" },
    { icon: BookOpen, number: "45+", label: "Degree Programs" },
    { icon: Microscope, number: "12", label: "Research Centers" }
  ]
  
  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])
  
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              {/* University Badge */}
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 text-emerald-300">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Est. 1952 • Accredited Excellence</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="block">{slides[currentSlide].title.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {slides[currentSlide].title.split(' ').slice(2).join(' ')}
                  </span>
                </h1>
                
                <h2 className="text-xl lg:text-2xl text-blue-200 font-medium">
                  {slides[currentSlide].subtitle}
                </h2>
                
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  {slides[currentSlide].description}
                </p>
              </div>
              
              {/* Stats Highlight */}
              <div className="flex items-center space-x-6 py-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{slides[currentSlide].stats.number}</div>
                  <div className="text-sm text-gray-400">{slides[currentSlide].stats.label}</div>
                </div>
                <div className="h-12 w-px bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">Top 5</div>
                  <div className="text-sm text-gray-400">African Universities</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  {slides[currentSlide].cta}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Virtual Tour
                </Button>
              </div>
              
              {/* Slide Indicators */}
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'w-8 bg-emerald-400' 
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Content - Image/Visual */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <img 
                    src={slides[currentSlide].image} 
                    alt="UMAT Campus"
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating Stats Cards */}
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">World-Class Faculty</div>
                        <div className="text-sm text-gray-600">200+ PhD Professors</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievement Stats Bar */}
      <div className="absolute bottom-20 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-xl mb-3 group-hover:bg-emerald-500/30 transition-colors">
                      <Icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{achievement.number}</div>
                    <div className="text-sm text-gray-300">{achievement.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors duration-300 animate-bounce"
        aria-label="Scroll to content"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  )
}

export default HeroSection