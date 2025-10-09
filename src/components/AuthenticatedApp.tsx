import React, { useState, useEffect, ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { StudentProvider } from '../contexts/StudentContext'
import { TeacherProvider } from '../contexts/TeacherContext'
import { FightModalityProvider } from '../contexts/FightModalityContext'
import { StudentModalityProvider } from '../contexts/StudentModalityContext'
import { BranchProvider } from '../contexts/BranchContext'
import { BranchFacilityProvider } from '../contexts/BranchFacilityContext'
import { WeightDivisionProvider } from '../contexts/WeightDivisionContext'
import { FightAssociationProvider } from '../contexts/FightAssociationContext'
import { ClassScheduleProvider } from '../contexts/ClassScheduleContext'
import { ClassCheckInProvider } from '../contexts/ClassCheckInContext'
import { AffiliationProvider } from '../contexts/AffiliationContext'
import { ChampionshipProvider } from '../contexts/ChampionshipContext'
import { ChampionshipCategoryProvider } from '../contexts/ChampionshipCategoryContext'
import { ChampionshipRegistrationProvider } from '../contexts/ChampionshipRegistrationContext'
import { ChampionshipResultProvider } from '../contexts/ChampionshipResultContext'
import { ChampionshipOfficialProvider } from '../contexts/ChampionshipOfficialContext'
import { ChampionshipSponsorProvider } from '../contexts/ChampionshipSponsorContext'
import { ChampionshipQualifiedLocationProvider } from '../contexts/ChampionshipQualifiedLocationContext'
import { FightTeamProvider } from '../contexts/FightTeamContext'
import { FightPhaseProvider } from '../contexts/FightPhaseContext'
import { FightProvider } from '../contexts/FightContext'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import Championships from '../pages/Championships'
import Administration from '../pages/Administration'
import UserProfiles from '../pages/UserProfiles'
import AppSettings from '../pages/AppSettings'
import CompanyInfo from '../pages/CompanyInfo'
import StudentRegistration from '../pages/StudentRegistration'
import StudentForm from '../pages/StudentForm'
import TeacherRegistration from '../pages/TeacherRegistration'
import TeacherForm from '../pages/TeacherForm'
import BranchFacilityRegistration from '../pages/BranchFacilityRegistration'
import BranchFacilityForm from '../pages/BranchFacilityForm'
import FightPlans from '../pages/FightPlans'
import FightModalities from '../pages/FightModalities'
import FightModalityForm from '../pages/FightModalityForm'
import StudentModality from '../pages/StudentModality'
import StudentModalityForm from '../pages/StudentModalityForm'
import StudentDigitalID from '../pages/StudentDigitalID'
import WeightDivisions from '../pages/WeightDivisions'
import WeightDivisionForm from '../pages/WeightDivisionForm'
import FightAssociations from '../pages/FightAssociations'
import FightAssociationForm from '../pages/FightAssociationForm'
import ClassSchedules from '../pages/ClassSchedules'
import ClassScheduleForm from '../pages/ClassScheduleForm'
import ClassCheckIn from '../pages/ClassCheckIn'
import ClassCheckInForm from '../pages/ClassCheckInForm'
import Affiliations from '../pages/Affiliations'
import AffiliationForm from '../pages/AffiliationForm'
import ChampionshipCategories from '../pages/ChampionshipCategories'
import ChampionshipCategoryForm from '../pages/ChampionshipCategoryForm'
import ChampionshipRegistrations from '../pages/ChampionshipRegistrations'
import ChampionshipRegistrationForm from '../pages/ChampionshipRegistrationForm'
import ChampionshipResults from '../pages/ChampionshipResults'
import ChampionshipQualifiedLocations from '../pages/ChampionshipQualifiedLocations'
import ChampionshipQualifiedLocationForm from '../pages/ChampionshipQualifiedLocationForm'
import FightTeams from '../pages/FightTeams'
import FightTeamForm from '../pages/FightTeamForm'
import FightPhases from '../pages/FightPhases'
import FightPhaseForm from '../pages/FightPhaseForm'
import BranchRegistration from '../pages/BranchRegistration'
import BranchForm from '../pages/BranchForm'

interface AuthenticatedAppProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  isMobile: boolean
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ 
  sidebarCollapsed, 
  onToggleSidebar, 
  isMobile 
}) => {
  return (
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
                                          <FightPhaseProvider>
                                            <FightProvider>
                                              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                                                <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} />
                                                <div className={`transition-all duration-300 ${
                                                  isMobile 
                                                    ? 'ml-0' 
                                                    : sidebarCollapsed 
                                                      ? 'ml-16' 
                                                      : 'ml-64'
                                                } min-h-screen`}>
                                                  <Header onToggleSidebar={onToggleSidebar} />
                                                  <main className="relative">
                                                    <Routes>
                                                      {/* Protected Routes */}
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
                                                      <Route path="/students/digital-id" element={<StudentDigitalID />} />
                                                      <Route path="/students/digital-id/:id" element={<StudentDigitalID />} />
                                                    
                                                      {/* Sub-menu Routes - Teachers (now accessible via /students menu) */}
                                                      <Route path="/teachers/registration" element={<TeacherRegistration />} />
                                                      <Route path="/teachers/registration/:action" element={<TeacherForm />} />
                                                      <Route path="/teachers/registration/:action/:id" element={<TeacherForm />} />
                                                      {/* Redirect old routes to new structure */}
                                                      <Route path="/teachers/new" element={<Navigate to="/teachers/registration/new" replace />} />
                                                      <Route path="/teachers/edit/:id" element={<Navigate to="/teachers/registration/edit/:id" replace />} />
                                                      <Route path="/teachers" element={<Navigate to="/teachers/registration" replace />} />
                                                    
                                                      {/* Sub-menu Routes - Fight Plans */}
                                                      <Route path="/fight-plans" element={<FightPlans />} />
                                                      <Route path="/fight-plans/modalities" element={<FightModalities />} />
                                                      <Route path="/fight-plans/modalities/:action" element={<FightModalityForm />} />
                                                      <Route path="/fight-plans/modalities/:action/:id" element={<FightModalityForm />} />
                                                      <Route path="/fight-plans/weight-divisions" element={<WeightDivisions />} />
                                                      <Route path="/fight-plans/weight-divisions/:action" element={<WeightDivisionForm />} />
                                                      <Route path="/fight-plans/weight-divisions/:action/:id" element={<WeightDivisionForm />} />
                                                      <Route path="/fight-plans/associations" element={<FightAssociations />} />
                                                      <Route path="/fight-plans/associations/:action" element={<FightAssociationForm />} />
                                                      <Route path="/fight-plans/associations/:action/:id" element={<FightAssociationForm />} />
                                                    
                                                      {/* Sub-menu Routes - Class Management */}
                                                      <Route path="/class-management" element={<ClassSchedules />} />
                                                      <Route path="/class-management/schedules" element={<ClassSchedules />} />
                                                      <Route path="/class-management/schedules/:action" element={<ClassScheduleForm />} />
                                                      <Route path="/class-management/schedules/:action/:id" element={<ClassScheduleForm />} />
                                                      <Route path="/class-management/check-ins" element={<ClassCheckIn />} />
                                                      <Route path="/class-management/check-ins/:action" element={<ClassCheckInForm />} />
                                                      <Route path="/class-management/check-ins/:action/:id" element={<ClassCheckInForm />} />
                                                      <Route path="/class-management/check-ins/:action/:id/:studentId" element={<ClassCheckInForm />} />
                                                    
                                                      {/* Sub-menu Routes - Championships */}
                                                      <Route path="/championships/categories" element={<ChampionshipCategories />} />
                                                      <Route path="/championships/categories/:action" element={<ChampionshipCategoryForm />} />
                                                      <Route path="/championships/categories/:action/:id" element={<ChampionshipCategoryForm />} />
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
                                                      <Route path="/championships/fight-phases" element={<FightPhases />} />
                                                      <Route path="/championships/fight-phases/:action" element={<FightPhaseForm />} />
                                                      <Route path="/championships/fight-phases/:action/:id" element={<FightPhaseForm />} />
                                                    
                                                      {/* Sub-menu Routes - Administration */}
                                                      <Route path="/administration/user-profiles" element={<UserProfiles />} />
                                                      <Route path="/administration/app-settings" element={<AppSettings />} />
                                                      <Route path="/administration/company-info" element={<CompanyInfo />} />
                                                      <Route path="/administration/affiliations" element={<Affiliations />} />
                                                      <Route path="/administration/affiliations/:action" element={<AffiliationForm />} />
                                                      <Route path="/administration/affiliations/:action/:id" element={<AffiliationForm />} />
                                                      <Route path="/administration/branches" element={<BranchRegistration />} />
                                                      <Route path="/administration/branches/:action" element={<BranchForm />} />
                                                      <Route path="/administration/branches/:action/:id" element={<BranchForm />} />
                                                      <Route path="/administration/branches/registration" element={<BranchRegistration />} />
                                                      <Route path="/administration/branches/registration/:action" element={<BranchForm />} />
                                                      <Route path="/administration/branches/registration/:action/:id" element={<BranchForm />} />
                                                      <Route path="/administration/branches/facilities" element={<BranchFacilityRegistration />} />
                                                      <Route path="/administration/branches/facilities/:action" element={<BranchFacilityForm />} />
                                                      <Route path="/administration/branches/facilities/:action/:id" element={<BranchFacilityForm />} />
                                                    </Routes>
                                                  </main>
                                                </div>
                                              </div>
                                            </FightProvider>
                                          </FightPhaseProvider>
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
  )
}

export default AuthenticatedApp
