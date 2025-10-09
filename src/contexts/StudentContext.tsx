import React, { createContext, useContext, ReactNode } from 'react'
import { useMasterData } from '../hooks/useMasterData'

export interface Student {
  studentId: string
  firstName: string
  lastName: string
  displayName: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black' | 
    'kids-white' | 'kids-gray-white' | 'kids-gray' | 'kids-gray-black' | 
    'kids-yellow-white' | 'kids-yellow' | 'kids-yellow-black' | 
    'kids-orange-white' | 'kids-orange' | 'kids-orange-black' | 
    'kids-green-white' | 'kids-green' | 'kids-green-black' |
    'judo-kids-white' | 'judo-kids-white-yellow' | 'judo-kids-yellow' | 
    'judo-kids-yellow-orange' | 'judo-kids-orange' | 'judo-kids-orange-green' | 'judo-kids-green'
  documentId: string
  email: string
  phone: string
  branchId: string
  active: boolean
  isKidsStudent: boolean
  weight?: number
  weightDivisionId?: string
  photoUrl?: string
  preferredLanguage?: 'ENU' | 'PTB' | 'ESP' | 'FRA' | 'GER' | 'JPN' | 'ITA' | 'RUS' | 'ARA' | 'KOR'
  // API fields
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

interface StudentContextType {
  students: Student[]
  isLoading: boolean
  error: string | null
  addStudent: (student: Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateStudent: (studentId: string, updatedStudent: Partial<Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteStudent: (studentId: string) => Promise<void>
  getStudent: (studentId: string) => Student | undefined
  refreshStudents: () => Promise<void>
  clearError: () => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    data: students,
    isLoading,
    error,
    addItem: addStudent,
    updateItem: updateStudent,
    deleteItem: deleteStudent,
    refreshData: refreshStudents,
    clearError
  } = useMasterData<Student>({
    dataType: 'students',
    initialData: []
  })

  // Helper function to get student by studentId (not the API id)
  const getStudent = (studentId: string): Student | undefined => {
    return students.find(student => student.studentId === studentId)
  }

  const contextValue: StudentContextType = {
    students,
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    refreshStudents,
    clearError
  }

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  )
}

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider')
  }
  return context
}