import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface Teacher {
  teacherId: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  phone: string
  branchId: string
  active: boolean
  specialization: string
  beltLevel: string
  yearsExperience: number
  // API fields
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

interface TeacherContextType {
  teachers: Teacher[]
  isLoading: boolean
  error: string | null
  addTeacher: (teacher: Omit<Teacher, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTeacher: (teacherId: string, updatedTeacher: Partial<Omit<Teacher, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteTeacher: (teacherId: string) => Promise<void>
  getTeacher: (teacherId: string) => Teacher | undefined
  refreshTeachers: () => Promise<void>
  clearError: () => void
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined)

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const teachers = useTenantData<Teacher>('teachers') // tenantId comes from AuthContext
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const addTeacher = async (teacher: Omit<Teacher, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    console.log('TeacherProvider: addTeacher called with', teacher);
  }
  
  const updateTeacher = async (id: string, updates: Partial<Omit<Teacher, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => {
    console.log('TeacherProvider: updateTeacher called with', id, updates);
  }
  
  const deleteTeacher = async (id: string) => {
    console.log('TeacherProvider: deleteTeacher called with', id);
  }
  
  const refreshTeachers = async () => {
    console.log('TeacherProvider: refreshTeachers called');
  }
  
  const clearError = () => {
    setError(null);
  }

  // Helper function to get teacher by teacherId (not the API id)
  const getTeacher = (teacherId: string): Teacher | undefined => {
    return teachers.find(teacher => teacher.teacherId === teacherId)
  }

  const contextValue: TeacherContextType = {
    teachers,
    isLoading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacher,
    refreshTeachers,
    clearError
  }

  return (
    <TeacherContext.Provider value={contextValue}>
      {children}
    </TeacherContext.Provider>
  )
}

export const useTeachers = (): TeacherContextType => {
  const context = useContext(TeacherContext)
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeacherProvider')
  }
  return context
}