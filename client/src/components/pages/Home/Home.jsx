import HeroSection from '@/components/HeroSection'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from "sonner";
import NewsEventsSection from '@/components/NewsEventsSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';


const Home = () => {
    const navigate = useNavigate();
    const {  isAuthenticated, user } = useSelector((state) => state.auth);
    // Redirect based on user role
    useEffect(() => {
      if (isAuthenticated && user) {
        if (user.role === "student") {
          navigate("/student/dashboard");
        } else if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          toast.error("Unknown user role. Please contact support.");
          navigate("/");
        }
      }
    }, [isAuthenticated, user, navigate]);
  return (
    <div className=''>
      <HeroSection/>
      <AboutSection/>
      <NewsEventsSection/>
      <Footer/>
    </div>
  )
}

export default Home