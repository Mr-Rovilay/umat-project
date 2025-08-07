import AboutSection from '@/components/AboutSection'
import CallToActionSection from '@/components/CallToActionSection'
import CampusLifeSection from '@/components/CampusLifeSection'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ProgramsSection from '@/components/ProgramsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import React from 'react'

const Home = () => {
  return (
    <div className=''>
        <HeroSection/>
        <AboutSection/>
        <ProgramsSection/>
        <CampusLifeSection/>
        <TestimonialsSection/>
        <Footer/>
    </div>
  )
}

export default Home