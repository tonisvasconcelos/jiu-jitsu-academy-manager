import React, { createContext, useContext, ReactNode } from 'react'
import { useMasterData } from '../hooks/useMasterData'

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
  const {
    data: teachers,
    isLoading,
    error,
    addItem: addTeacher,
    updateItem: updateTeacher,
    deleteItem: deleteTeacher,
    refreshData: refreshTeachers,
    clearError
  } = useMasterData<Teacher>({
    dataType: 'teachers',
    initialData: []
  })

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