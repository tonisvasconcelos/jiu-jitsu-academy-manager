import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Instructors from './pages/Instructors'
import MartialArtTypes from './pages/MartialArtTypes'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // On mobile, always start with collapsed sidebar
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <LanguageProvider>
      <Router basename="/jiu-jitsu-academy-manager">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
              <div className={`transition-all duration-300 ${
                isMobile 
                  ? 'ml-0' 
                  : sidebarCollapsed 
                    ? 'ml-16' 
                    : 'ml-64'
              } min-h-screen`}>
            <Header onToggleSidebar={toggleSidebar} />
            <main className="relative">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                
                {/* Students Routes */}
                <Route path="/students/registration" element={<div className="p-6">Student Registration</div>} />
                <Route path="/students/profiles" element={<div className="p-6">Student Profiles</div>} />
                <Route path="/students/fight-plans" element={<div className="p-6">Fight Plans by Student</div>} />
                <Route path="/students/evaluation" element={<div className="p-6">Student Evaluation & Grades</div>} />
                <Route path="/students/attendance" element={<div className="p-6">Student Attendance</div>} />
                
                {/* Teachers Routes */}
                <Route path="/teachers/registration" element={<div className="p-6">Teacher Registration</div>} />
                <Route path="/teachers/profiles" element={<div className="p-6">Teacher Profiles</div>} />
                <Route path="/teachers/assign" element={<div className="p-6">Assign Teachers to Classes</div>} />
                <Route path="/teachers/evaluations" element={<div className="p-6">Teacher Evaluations</div>} />
                
                {/* Championships Routes */}
                <Route path="/championships/registration" element={<div className="p-6">Championship Registration</div>} />
                <Route path="/championships/enrollment" element={<div className="p-6">Student Enrollment in Championships</div>} />
                <Route path="/championships/results" element={<div className="p-6">Championship Results</div>} />
                <Route path="/championships/ranking" element={<div className="p-6">Ranking & Statistics</div>} />
                
                {/* Classes Routes */}
                <Route path="/classes/setup" element={<div className="p-6">Class Setup by Modality</div>} />
                <Route path="/classes/schedule" element={<div className="p-6">Schedule Management</div>} />
                <Route path="/classes/attendance" element={<div className="p-6">Check-In / Attendance Tracking</div>} />
                <Route path="/classes/capacity" element={<div className="p-6">Class Capacity & Limits</div>} />
                
                {/* Fight Plans Routes */}
                <Route path="/fight-plans/templates" element={<div className="p-6">Plan Templates</div>} />
                <Route path="/fight-plans/assign" element={<div className="p-6">Assign Plans to Students</div>} />
                <Route path="/fight-plans/phases" element={<div className="p-6">Training Phases & Milestones</div>} />
                
                {/* Quality & Evaluation Routes */}
                <Route path="/quality/progress" element={<div className="p-6">Student Progress Reports</div>} />
                <Route path="/quality/feedback" element={<div className="p-6">Teacher Feedback</div>} />
                <Route path="/quality/fitness" element={<div className="p-6">Fitness Tests & Metrics</div>} />
                
                {/* Branches Routes */}
                <Route path="/branches/registration" element={<div className="p-6">Branch Registration</div>} />
                <Route path="/branches/details" element={<div className="p-6">Branch Details (location, contact)</div>} />
                <Route path="/branches/assign" element={<div className="p-6">Assign Students/Teachers per Branch</div>} />
                
                {/* Schedules & Check-Ins Routes */}
                <Route path="/schedules/timetable" element={<div className="p-6">Weekly Timetable</div>} />
                <Route path="/schedules/booking" element={<div className="p-6">Student Booking System</div>} />
                <Route path="/schedules/attendance" element={<div className="p-6">Real-Time Attendance Log</div>} />
                
                {/* Administration Routes */}
                <Route path="/admin/profiles" element={<div className="p-6">User Profiles & Roles</div>} />
                <Route path="/admin/language" element={<LanguageSelector />} />
                <Route path="/admin/settings" element={<div className="p-6">App Settings</div>} />
                
                {/* Legacy Routes for backward compatibility */}
                <Route path="/students" element={<Students />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/martial-art-types" element={<MartialArtTypes />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App