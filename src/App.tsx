import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { StudentProvider } from './contexts/StudentContext'
import { TeacherProvider } from './contexts/TeacherContext'
import { FightModalityProvider } from './contexts/FightModalityContext'
import { StudentModalityProvider } from './contexts/StudentModalityContext'
import { BranchProvider } from './contexts/BranchContext'
import { WeightDivisionProvider } from './contexts/WeightDivisionContext'
import { FightAssociationProvider } from './contexts/FightAssociationContext'
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
import TeacherRegistration from './pages/TeacherRegistration'
import TeacherForm from './pages/TeacherForm'
import FightPlans from './pages/FightPlans'
import FightModalities from './pages/FightModalities'
import FightModalityForm from './pages/FightModalityForm'
import StudentModality from './pages/StudentModality'
import StudentModalityForm from './pages/StudentModalityForm'
import Branches from './pages/Branches'
import BranchRegistration from './pages/BranchRegistration'
import BranchForm from './pages/BranchForm'
import WeightDivisions from './pages/WeightDivisions'
import WeightDivisionForm from './pages/WeightDivisionForm'
import FightAssociations from './pages/FightAssociations'
import FightAssociationForm from './pages/FightAssociationForm'

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
              <StudentProvider>
                <TeacherProvider>
                  <FightModalityProvider>
                    <StudentModalityProvider>
                      <BranchProvider>
                        <WeightDivisionProvider>
                          <FightAssociationProvider>
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
                      <Route path="/students/registration/:action" element={<StudentForm />} />
                      <Route path="/students/registration/:action/:id" element={<StudentForm />} />
                      <Route path="/students/modality" element={<StudentModality />} />
                      <Route path="/students/modality/:action" element={<StudentModalityForm />} />
                      <Route path="/students/modality/:action/:id" element={<StudentModalityForm />} />
                      <Route path="/students/modality/:action/:id/:studentId" element={<StudentModalityForm />} />
                      <Route path="/students/evaluation" element={<div className="p-6">Student Evaluation & Grades</div>} />
                      <Route path="/students/attendance" element={<div className="p-6">Student Attendance</div>} />
                    
                    {/* Sub-menu Routes - Teachers */}
                    <Route path="/teachers/registration" element={<TeacherRegistration />} />
                    <Route path="/teachers/registration/:action" element={<TeacherForm />} />
                    <Route path="/teachers/registration/:action/:id" element={<TeacherForm />} />
                    <Route path="/teachers/profiles" element={<div className="p-6">Teacher Profiles</div>} />
                    <Route path="/teachers/assign" element={<div className="p-6">Assign Teachers to Classes</div>} />
                    <Route path="/teachers/evaluations" element={<div className="p-6">Teacher Evaluations</div>} />
                    
                    {/* Sub-menu Routes - Championships */}
                    <Route path="/championships/registration" element={<div className="p-6">Championship Registration</div>} />
                    <Route path="/championships/enrollment" element={<div className="p-6">Student Enrollment in Championships</div>} />
                    <Route path="/championships/results" element={<div className="p-6">Championship Results</div>} />
                    <Route path="/championships/ranking" element={<div className="p-6">Ranking & Statistics</div>} />
                    <Route path="/championships/fight-associations" element={<FightAssociations />} />
                    <Route path="/championships/fight-associations/:action" element={<FightAssociationForm />} />
                    <Route path="/championships/fight-associations/:action/:id" element={<FightAssociationForm />} />
                    
                    {/* Sub-menu Routes - Administration */}
                    <Route path="/admin/profiles" element={<div className="p-6">User Profiles & Roles</div>} />
                    <Route path="/admin/language" element={<LanguageSelector />} />
                    <Route path="/admin/settings" element={<div className="p-6">App Settings</div>} />
                    
                    {/* Placeholder Routes for other main pages */}
                    <Route path="/classes" element={<div className="p-6">Classes Management</div>} />
                    <Route path="/fight-plans" element={<FightPlans />} />
                    
                    {/* Sub-menu Routes - Fight Plans */}
                    <Route path="/fight-plans/modalities" element={<FightModalities />} />
                    <Route path="/fight-plans/modalities/:action" element={<FightModalityForm />} />
                    <Route path="/fight-plans/modalities/:action/:id" element={<FightModalityForm />} />
                    <Route path="/fight-plans/weight-divisions" element={<WeightDivisions />} />
                    <Route path="/fight-plans/weight-divisions/:action" element={<WeightDivisionForm />} />
                    <Route path="/fight-plans/weight-divisions/:action/:id" element={<WeightDivisionForm />} />
                    <Route path="/fight-plans/training-phases" element={<div className="p-6">Training Phases & Milestones</div>} />
                    
                            <Route path="/quality" element={<div className="p-6">Quality & Evaluation</div>} />
                            <Route path="/branches" element={<Branches />} />
                            <Route path="/schedules" element={<div className="p-6">Schedules & Check-Ins</div>} />
                            
                            {/* Sub-menu Routes - Branches */}
                            <Route path="/branches/registration" element={<BranchRegistration />} />
                            <Route path="/branches/registration/:action" element={<BranchForm />} />
                            <Route path="/branches/registration/:action/:id" element={<BranchForm />} />
                            <Route path="/branches/details" element={<div className="p-6">Branch Details</div>} />
                            <Route path="/branches/assign" element={<div className="p-6">Assign Branch</div>} />
                            <Route path="/branches/schedules" element={<div className="p-6">Branch Schedules</div>} />
                            <Route path="/branches/facilities" element={<div className="p-6">Branch Facilities</div>} />
                            <Route path="/branches/reports" element={<div className="p-6">Branch Reports</div>} />
                  </Routes>
                </main>
          </div>
        </div>
                </Router>
                        </FightAssociationProvider>
                      </WeightDivisionProvider>
                    </BranchProvider>
                  </StudentModalityProvider>
                </FightModalityProvider>
              </TeacherProvider>
            </StudentProvider>
                </LanguageProvider>
  )
}

export default App