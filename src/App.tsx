import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Championships from './pages/Championships'
import Administration from './pages/Administration'
import StudentRegistration from './pages/StudentRegistration'
import StudentForm from './pages/StudentForm'

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
                    
                    {/* Main Menu Pages */}
                    <Route path="/students" element={<Students />} />
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/championships" element={<Championships />} />
                    <Route path="/administration" element={<Administration />} />
                    
                    {/* Sub-menu Routes - Students */}
                    <Route path="/students/registration" element={<StudentRegistration />} />
                    <Route path="/students/registration/new" element={<StudentForm />} />
                    <Route path="/students/registration/edit/:id" element={<StudentForm />} />
                    <Route path="/students/registration/view/:id" element={<StudentForm />} />
                    <Route path="/students/profiles" element={<div className="p-6">Student Profiles</div>} />
                    <Route path="/students/fight-plans" element={<div className="p-6">Fight Plans by Student</div>} />
                    <Route path="/students/evaluation" element={<div className="p-6">Student Evaluation & Grades</div>} />
                    <Route path="/students/attendance" element={<div className="p-6">Student Attendance</div>} />
                    
                    {/* Sub-menu Routes - Teachers */}
                    <Route path="/teachers/registration" element={<div className="p-6">Teacher Registration</div>} />
                    <Route path="/teachers/profiles" element={<div className="p-6">Teacher Profiles</div>} />
                    <Route path="/teachers/assign" element={<div className="p-6">Assign Teachers to Classes</div>} />
                    <Route path="/teachers/evaluations" element={<div className="p-6">Teacher Evaluations</div>} />
                    
                    {/* Sub-menu Routes - Championships */}
                    <Route path="/championships/registration" element={<div className="p-6">Championship Registration</div>} />
                    <Route path="/championships/enrollment" element={<div className="p-6">Student Enrollment in Championships</div>} />
                    <Route path="/championships/results" element={<div className="p-6">Championship Results</div>} />
                    <Route path="/championships/ranking" element={<div className="p-6">Ranking & Statistics</div>} />
                    
                    {/* Sub-menu Routes - Administration */}
                    <Route path="/admin/profiles" element={<div className="p-6">User Profiles & Roles</div>} />
                    <Route path="/admin/language" element={<LanguageSelector />} />
                    <Route path="/admin/settings" element={<div className="p-6">App Settings</div>} />
                    
                    {/* Placeholder Routes for other main pages */}
                    <Route path="/classes" element={<div className="p-6">Classes Management</div>} />
                    <Route path="/fight-plans" element={<div className="p-6">Fight Plans Management</div>} />
                    <Route path="/quality" element={<div className="p-6">Quality & Evaluation</div>} />
                    <Route path="/branches" element={<div className="p-6">Branches Management</div>} />
                    <Route path="/schedules" element={<div className="p-6">Schedules & Check-Ins</div>} />
                  </Routes>
                </main>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App