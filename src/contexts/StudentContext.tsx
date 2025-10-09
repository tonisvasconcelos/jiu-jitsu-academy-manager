import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'

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
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load students from localStorage on mount
  useEffect(() => {
    const loadStudents = () => {
      try {
        // First try to load from testData (from login)
        const testData = localStorage.getItem('testData')
        if (testData) {
          const parsed = JSON.parse(testData)
          if (parsed.students && Array.isArray(parsed.students)) {
            setStudents(parsed.students)
            return
          }
        }
        
        // If no test data, check for existing students in localStorage
        const existingStudents = localStorage.getItem('students')
        if (existingStudents) {
          const parsed = JSON.parse(existingStudents)
          if (Array.isArray(parsed)) {
            setStudents(parsed)
          }
        }
      } catch (err) {
        console.error('Error loading students:', err)
        setError('Failed to load students')
      }
    }

    loadStudents()
  }, [])

  // Save students to localStorage whenever students change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students))
      
      // Also update testData if it exists
      const testData = localStorage.getItem('testData')
      if (testData) {
        try {
          const parsed = JSON.parse(testData)
          parsed.students = students
          localStorage.setItem('testData', JSON.stringify(parsed))
        } catch (err) {
          console.error('Error updating testData:', err)
        }
      }
    }
  }, [students])

  const addStudent = async (student: Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const newStudent: Student = {
        ...student,
        id: `student_${Date.now()}`,
        tenantId: 'tubaraobjj-tenant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setStudents(prev => [...prev, newStudent])
    } catch (err: any) {
      setError(err.message || 'Failed to add student')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStudent = async (studentId: string, updatedStudent: Partial<Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      setStudents(prev => prev.map(student => 
        student.studentId === studentId 
          ? { ...student, ...updatedStudent, updatedAt: new Date().toISOString() }
          : student
      ))
    } catch (err: any) {
      setError(err.message || 'Failed to update student')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteStudent = async (studentId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      setStudents(prev => prev.filter(student => student.studentId !== studentId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete student')
    } finally {
      setIsLoading(false)
    }
  }

  const getStudent = (studentId: string) => students.find(s => s.studentId === studentId)

  const refreshStudents = async () => {
    // Reload from localStorage
    const existingStudents = localStorage.getItem('students')
    if (existingStudents) {
      try {
        const parsed = JSON.parse(existingStudents)
        if (Array.isArray(parsed)) {
          setStudents(parsed)
        }
      } catch (err) {
        console.error('Error refreshing students:', err)
      }
    }
  }

  const clearError = () => setError(null)

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