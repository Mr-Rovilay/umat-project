import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu, Moon, Sun, LogOut, LogIn, User, ChevronDown, Settings, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import { logoutUser } from '@/redux/slice/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true' || (prefersDark && savedMode !== 'false')) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (error && error.includes('Logout')) {
      toast.error(error);
    }
  }, [error]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      setIsOpen(false);
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
     <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-emerald-700/95 via-green-800/95 to-teal-800/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-xl backdrop-blur-md'
          : 'bg-gradient-to-r from-emerald-600 via-green-700 to-teal-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg'
      } border-b border-green-800/20 dark:border-gray-700/50 backdrop-blur-sm`}
    >
      <div className="max-pad-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200 group"
          >
            <div className="relative">
              <img
                src="/umat-logo.png"
                alt="UMat Logo"
                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">
                UMaT
              </span>
              <span className="text-xs text-green-100 font-medium tracking-wide hidden sm:block">
                Knowledge | Truth | Excellence
              </span>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1 mr-6">
          {(user?.role === 'student' || user?.role === 'admin') && (
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-1">
                <Newspaper className="w-4 h-4" />
                <span>News</span>
              </div>
            </NavLink>
          )}
             {/* {user?.role === 'student' && (
              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Departments
              </NavLink>
               )} */}
              {user?.role === 'admin' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
              {isAuthenticated && user?.role === 'student' && (
                <NavLink
                  to="/student/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                 Student Dashboard
                </NavLink>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-green-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
                      disabled={isLoading}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {user?.firstName || 'Account'}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 mt-2" align="end">
                     {user?.role === 'student' && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </NavLink>
                    </DropdownMenuItem>
                     )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer"
                      disabled={isLoading}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink to="/login">
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </NavLink>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 mr-4" align="end">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/umat-logo.png"
                      alt="UMat Logo"
                      className="h-6 w-6"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">UMaT</span>
                      <span className="text-xs text-gray-500">Knowledge | Truth | Excellence</span>
                    </div>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <NavLink
                        to="/dashboard"
                        onClick={handleMobileLinkClick}
                        className="flex items-center w-full px-2 py-2"
                      >
                        Dashboard
                      </NavLink>
                    </DropdownMenuItem>
                  </>
                )}
                {isAuthenticated && user?.role === 'student' && (
                  <DropdownMenuItem asChild>
                    <NavLink
                      to="/student/dashboard"
                      onClick={handleMobileLinkClick}
                      className="flex items-center w-full px-2 py-2"
                    >
                      Student Dashboard
                    </NavLink>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={toggleDarkMode}
                  className="flex items-center space-x-2"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  {isAuthenticated ? (
                    <>
                        {user?.role === 'student' && (
                      <DropdownMenuItem asChild>
                        <NavLink
                          to="/profile"
                          onClick={handleMobileLinkClick}
                          className="flex items-center space-x-2 w-full px-2 py-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </NavLink>
                      </DropdownMenuItem>
                        )}
                      {/* <DropdownMenuItem asChild>
                        <NavLink
                          to="/settings"
                          onClick={handleMobileLinkClick}
                          className="flex items-center space-x-2 w-full px-2 py-2"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </NavLink>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 flex items-center space-x-2 cursor-pointer"
                        disabled={isLoading}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <NavLink
                        to="/login"
                        onClick={handleMobileLinkClick}
                        className="flex items-center space-x-2 w-full px-2 py-2 cursor-pointer"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </NavLink>
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;