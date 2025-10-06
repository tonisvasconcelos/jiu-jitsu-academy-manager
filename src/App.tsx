import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { StudentProvider } from './contexts/StudentContext'
import { TeacherProvider } from './contexts/TeacherContext'
import { FightModalityProvider } from './contexts/FightModalityContext'
import { StudentModalityProvider } from './contexts/StudentModalityContext'
import { BranchProvider } from './contexts/BranchContext'
import { BranchFacilityProvider } from './contexts/BranchFacilityContext'
import { WeightDivisionProvider } from './contexts/WeightDivisionContext'
import { FightAssociationProvider } from './contexts/FightAssociationContext'
import { ClassScheduleProvider } from './contexts/ClassScheduleContext'
import { ClassCheckInProvider } from './contexts/ClassCheckInContext'
import { AffiliationProvider } from './contexts/AffiliationContext'
import { ChampionshipProvider } from './contexts/ChampionshipContext'
import { ChampionshipCategoryProvider } from './contexts/ChampionshipCategoryContext'
import { ChampionshipRegistrationProvider } from './contexts/ChampionshipRegistrationContext'
import { ChampionshipResultProvider } from './contexts/ChampionshipResultContext'
import { ChampionshipOfficialProvider } from './contexts/ChampionshipOfficialContext'
import { ChampionshipSponsorProvider } from './contexts/ChampionshipSponsorContext'
import { ChampionshipQualifiedLocationProvider } from './contexts/ChampionshipQualifiedLocationContext'
import { FightTeamProvider } from './contexts/FightTeamContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Championships from './pages/Championships'
import Administration from './pages/Administration'
import UserProfiles from './pages/UserProfiles'
import AppSettings from './pages/AppSettings'
import CompanyInfo from './pages/CompanyInfo'
import StudentRegistration from './pages/StudentRegistration'
import StudentForm from './pages/StudentForm'
import TeacherRegistration from './pages/TeacherRegistration'
import TeacherForm from './pages/TeacherForm'
import BranchFacilityRegistration from './pages/BranchFacilityRegistration'
import BranchFacilityForm from './pages/BranchFacilityForm'
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
import ClassSchedules from './pages/ClassSchedules'
import ClassScheduleRegistration from './pages/ClassScheduleRegistration'
import ClassScheduleForm from './pages/ClassScheduleForm'
import ClassCalendar from './pages/ClassCalendar'
import ClassCheckIn from './pages/ClassCheckIn'
import ClassCheckInForm from './pages/ClassCheckInForm'
import ArchivedCheckIns from './pages/ArchivedCheckIns'
import Affiliations from './pages/Affiliations'
import AffiliationForm from './pages/AffiliationForm'
import ChampionshipRegistration from './pages/ChampionshipRegistration'
import ChampionshipForm from './pages/ChampionshipForm'
import ChampionshipCategories from './pages/ChampionshipCategories'
import ChampionshipCategoryForm from './pages/ChampionshipCategoryForm'
import AthleteEnrollmentList from './pages/AthleteEnrollmentList'
import ChampionshipRegistrations from './pages/ChampionshipRegistrations'
import ChampionshipRegistrationForm from './pages/ChampionshipRegistrationForm'
import ChampionshipResults from './pages/ChampionshipResults'
import ChampionshipQualifiedLocations from './pages/ChampionshipQualifiedLocations'
import ChampionshipQualifiedLocationForm from './pages/ChampionshipQualifiedLocationForm'
import FightTeams from './pages/FightTeams'
import FightTeamForm from './pages/FightTeamForm'

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
                    <BranchFacilityProvider>
                      <WeightDivisionProvider>
                        <FightAssociationProvider>
                          <ClassScheduleProvider>
                            <ClassCheckInProvider>
                              <AffiliationProvider>
                                <ChampionshipProvider>
                                  <ChampionshipCategoryProvider>
                                    <ChampionshipRegistrationProvider>
                                      <ChampionshipResultProvider>
                                        <ChampionshipOfficialProvider>
                                          <ChampionshipSponsorProvider>
                        <ChampionshipQualifiedLocationProvider>
                          <FightTeamProvider>
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
                    
                    {/* Sub-menu Routes - Teachers (now accessible via /students menu) */}
                    <Route path="/teachers/registration" element={<TeacherRegistration />} />
                    <Route path="/teachers/registration/:action" element={<TeacherForm />} />
                    <Route path="/teachers/registration/:action/:id" element={<TeacherForm />} />
                    {/* Redirect old routes to new structure */}
                    <Route path="/teachers/new" element={<Navigate to="/teachers/registration/new" replace />} />
                    <Route path="/teachers/edit/:id" element={<Navigate to="/teachers/registration/edit/:id" replace />} />
                    <Route path="/teachers/view/:id" element={<Navigate to="/teachers/registration/view/:id" replace />} />
                    
                    {/* Sub-menu Routes - Championships */}
                    <Route path="/championships/registration" element={<ChampionshipRegistration />} />
                    <Route path="/championships/registration/:action" element={<ChampionshipForm />} />
                    <Route path="/championships/registration/:action/:id" element={<ChampionshipForm />} />
                    <Route path="/championships/enrollment" element={<div className="p-6">Student Enrollment in Championships</div>} />
                    <Route path="/championships/results" element={<div className="p-6">Championship Results</div>} />
                    <Route path="/championships/ranking" element={<div className="p-6">Ranking & Statistics</div>} />
                    <Route path="/championships/fight-associations" element={<FightAssociations />} />
                    <Route path="/championships/fight-associations/:action" element={<FightAssociationForm />} />
                    <Route path="/championships/fight-associations/:action/:id" element={<FightAssociationForm />} />
                    
                    {/* Championship Module Routes */}
                    <Route path="/championships/affiliations" element={<Affiliations />} />
                    <Route path="/championships/affiliations/:action" element={<AffiliationForm />} />
                    <Route path="/championships/affiliations/:action/:id" element={<AffiliationForm />} />
                    <Route path="/championships/categories" element={<ChampionshipCategories />} />
            <Route path="/championships/categories/:action" element={<ChampionshipCategoryForm />} />
            <Route path="/championships/categories/:action/:id" element={<ChampionshipCategoryForm />} />
            <Route path="/championships/athlete-enrollment" element={<AthleteEnrollmentList />} />
                    <Route path="/championships/registrations" element={<ChampionshipRegistrations />} />
                    <Route path="/championships/registrations/:action" element={<ChampionshipRegistrationForm />} />
                    <Route path="/championships/registrations/:action/:id" element={<ChampionshipRegistrationForm />} />
                    <Route path="/championships/results" element={<ChampionshipResults />} />
                            <Route path="/championships/qualified-locations" element={<ChampionshipQualifiedLocations />} />
                            <Route path="/championships/qualified-locations/:action" element={<ChampionshipQualifiedLocationForm />} />
                            <Route path="/championships/qualified-locations/:action/:id" element={<ChampionshipQualifiedLocationForm />} />
                            <Route path="/championships/fight-teams" element={<FightTeams />} />
                            <Route path="/championships/fight-teams/:action" element={<FightTeamForm />} />
                            <Route path="/championships/fight-teams/:action/:id" element={<FightTeamForm />} />
                    
                    {/* Sub-menu Routes - Administration */}
                    <Route path="/administration/profiles" element={<UserProfiles />} />
                    <Route path="/administration/company" element={<CompanyInfo />} />
                    <Route path="/administration/language" element={<LanguageSelector />} />
                    <Route path="/administration/settings" element={<AppSettings />} />
                    
                    {/* Class Schedule Routes */}
                    <Route path="/classes" element={<ClassSchedules />} />
                    <Route path="/classes/registration" element={<ClassScheduleRegistration />} />
                    <Route path="/classes/registration/:action" element={<ClassScheduleForm />} />
                    <Route path="/classes/registration/:action/:id" element={<ClassScheduleForm />} />
                    <Route path="/classes/calendar" element={<ClassCalendar />} />
                    <Route path="/classes/check-in" element={<ClassCheckIn />} />
                    <Route path="/classes/check-in/new" element={<ClassCheckInForm />} />
                    <Route path="/classes/check-in/archived" element={<ArchivedCheckIns />} />
                    <Route path="/classes/attendance" element={<div className="p-6">Class Attendance Tracking</div>} />
                    <Route path="/classes/evaluation" element={<div className="p-6">Class Evaluation & Feedback</div>} />
                    
                    {/* Placeholder Routes for other main pages */}
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
                            
                            {/* Sub-menu Routes - Quality Evaluation */}
                            <Route path="/quality/student-evaluation" element={<div className="p-6">Student Evaluation & Grades</div>} />
                            <Route path="/quality/teacher-evaluations" element={<div className="p-6">Teacher Evaluations</div>} />
                            <Route path="/branches" element={<Branches />} />
                            
                            {/* Sub-menu Routes - Branches */}
                            <Route path="/branches/registration" element={<BranchRegistration />} />
                            <Route path="/branches/registration/:action" element={<BranchForm />} />
                            <Route path="/branches/registration/:action/:id" element={<BranchForm />} />
                            <Route path="/branches/facilities" element={<BranchFacilityRegistration />} />
                            <Route path="/branches/facilities/:action" element={<BranchFacilityForm />} />
                            <Route path="/branches/facilities/:action/:id" element={<BranchFacilityForm />} />
                  </Routes>
                </main>
          </div>
        </div>
                            </Router>
                          </FightTeamProvider>
                        </ChampionshipQualifiedLocationProvider>
                                          </ChampionshipSponsorProvider>
                                        </ChampionshipOfficialProvider>
                                      </ChampionshipResultProvider>
                                    </ChampionshipRegistrationProvider>
                                  </ChampionshipCategoryProvider>
                                </ChampionshipProvider>
                              </AffiliationProvider>
                            </ClassCheckInProvider>
                          </ClassScheduleProvider>
                        </FightAssociationProvider>
                      </WeightDivisionProvider>
                    </BranchFacilityProvider>
                  </BranchProvider>
                </StudentModalityProvider>
              </FightModalityProvider>
            </TeacherProvider>
          </StudentProvider>
        </LanguageProvider>
  )
}

export default App