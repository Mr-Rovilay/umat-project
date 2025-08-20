import React, { useState } from 'react';
import { Search, Users, Calendar, MapPin, User, Award } from 'lucide-react';
import { toast } from 'sonner';

const StudentClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const clubs = [
    {
      id: 1,
      name: "Robotics Innovation Club",
      icon: "🤖",
      founded: "March 2019",
      department: "Engineering & Technology",
      president: "Akosua Serwaa",
      members: 45,
      description: "Build, program, and compete with cutting-edge robots",
      meetings: [
        { day: "Wednesday", time: "4:00 PM - 6:00 PM", type: "General Meeting" },
        { day: "Saturday", time: "10:00 AM - 2:00 PM", type: "Workshop" }
      ],
      location: "Engineering Lab Room 205",
      gradient: "from-emerald-400 to-teal-400"
    },
    {
      id: 2,
      name: "Multi-Sports Athletics Club",
      icon: "⚽",
      founded: "September 2018",
      department: "Physical Education",
      president: "Afia Nyarko",
      members: 78,
      description: "Basketball, Football, Tennis, and more sports activities",
      meetings: [
        { day: "Monday & Friday", time: "6:00 PM - 8:00 PM", type: "Training" },
        { day: "Sunday", time: "9:00 AM - 12:00 PM", type: "Tournaments" }
      ],
      location: "Sports Complex Gym",
      gradient: "from-teal-400 to-cyan-400"
    },
    {
      id: 3,
      name: "Entertainment & Arts Club",
      icon: "🎭",
      founded: "January 2020",
      department: "Fine Arts",
      president: "Adwoa Abena",
      members: 62,
      description: "Theater, music performances, and creative arts",
      meetings: [
        { day: "Tuesday", time: "5:00 PM - 7:00 PM", type: "Rehearsals" },
        { day: "Thursday", time: "4:30 PM - 6:30 PM", type: "Planning" }
      ],
      location: "Arts Center Studio B",
      gradient: "from-cyan-400 to-emerald-400"
    },
    {
      id: 4,
      name: "Debate Society",
      icon: "🗣️",
      founded: "October 2017",
      department: "Ama Boatemaa",
      president: "David Park",
      members: 35,
      description: "Parliamentary debates, public speaking, and argumentation",
      meetings: [
        { day: "Wednesday", time: "7:00 PM - 9:00 PM", type: "Debate Practice" },
        { day: "Saturday", time: "2:00 PM - 4:00 PM", type: "Speech Training" }
      ],
      location: "Lecture Hall 101",
      gradient: "from-emerald-500 to-cyan-400"
    },
    {
      id: 5,
      name: "Environmental Action Club",
      icon: "🌱",
      founded: "April 2019",
      department: "Environmental Science",
      president: "Esi Oforiwaa",
      members: 41,
      description: "Sustainability projects and environmental awareness",
      meetings: [
        { day: "Thursday", time: "3:30 PM - 5:30 PM", type: "Project Work" },
        { day: "Saturday", time: "8:00 AM - 11:00 AM", type: "Field Activities" }
      ],
      location: "Science Building Room 304",
      gradient: "from-green-400 to-teal-500"
    },
    {
      id: 6,
      name: "Photography Club",
      icon: "📸",
      founded: "November 2018",
      department: "Visual Arts",
      president: "Yaa Asieduwaa",
      members: 29,
      description: "Digital photography, editing, and visual storytelling",
      meetings: [
        { day: "Friday", time: "4:00 PM - 6:00 PM", type: "Photo Walks" },
        { day: "Sunday", time: "1:00 PM - 3:00 PM", type: "Editing Workshop" }
      ],
      location: "Media Lab Room 150",
      gradient: "from-teal-400 to-emerald-500"
    }
  ];
  
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.president.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleJoinClub = (clubName) => {
    toast(`Thanks for your interest in joining ${clubName}! Please contact the club president for more information.`);
  };
  
  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-90"></div>
        <div className="relative z-10 text-center py-16 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎓 Student Clubs Directory
          </h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Discover your passion and join a community of like-minded students
          </p>
        </div>
      </div>
      
      <div className="max-pad-container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs by name, department, or president..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-700 shadow-lg focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900 focus:outline-none transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-emerald-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">{clubs.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-emerald-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">
              {clubs.reduce((sum, club) => sum + club.members, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-emerald-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">6</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-emerald-100 dark:border-gray-700 shadow-sm">
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">12+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Events</div>
          </div>
        </div>
        
        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-emerald-100 dark:border-gray-700"
            >
              {/* Club Header */}
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${club.gradient} flex items-center justify-center text-2xl mr-4 shadow-lg`}>
                  {club.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{club.name}</h3>
                </div>
              </div>
              
              {/* Club Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-3 text-emerald-500" />
                  <span className="text-sm font-medium">Founded:</span>
                  <span className="ml-2 text-sm">{club.founded}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4 mr-3 text-emerald-500" />
                  <span className="text-sm font-medium">Department:</span>
                  <span className="ml-2 text-sm">{club.department}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4 mr-3 text-emerald-500" />
                  <span className="text-sm font-medium">President:</span>
                  <span className="ml-2 text-sm">{club.president}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-3 text-emerald-500" />
                  <span className="text-sm font-medium">Members:</span>
                  <span className="ml-2 text-sm">{club.members} Active</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 italic">{club.description}</p>
              
              {/* Meeting Schedule */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">
                  Meeting Schedule
                </h4>
                <div className="space-y-2">
                  {club.meetings.map((meeting, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3 border-l-4 border-emerald-400">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{meeting.day}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{meeting.type}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{meeting.time}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center mt-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                  <span className="text-sm">{club.location}</span>
                </div>
              </div>
              
              {/* Join Button */}
              <button
                onClick={() => handleJoinClub(club.name)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Join Club
              </button>
            </div>
          ))}
        </div>
        
        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">No clubs found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentClubsPage;