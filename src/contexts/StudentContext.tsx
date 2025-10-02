import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface Student {
  studentId: string
  firstName: string
  lastName: string
  displayName: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black'
  documentId: string
  email: string
  phone: string
  branchId: string
  active: boolean
  photoUrl?: string
}

interface StudentContextType {
  students: Student[]
  addStudent: (student: Student) => void
  updateStudent: (studentId: string, updatedStudent: Student) => void
  deleteStudent: (studentId: string) => void
  getStudent: (studentId: string) => Student | undefined
  clearAllStudents: () => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

// Start with empty array - no sample data
const initialStudents: Student[] = []

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load students from localStorage or use initial data
  const loadStudentsFromStorage = (): Student[] => {
    try {
      const stored = localStorage.getItem('jiu-jitsu-students')
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('StudentContext: Loaded students from localStorage:', parsed)
        return parsed
      }
    } catch (error) {
      console.error('StudentContext: Error loading students from localStorage:', error)
    }
    console.log('StudentContext: No saved data found, starting with empty student list')
    return initialStudents
  }

  const [students, setStudents] = useState<Student[]>(loadStudentsFromStorage)

  // Save students to localStorage
  const saveStudentsToStorage = (studentsToSave: Student[]) => {
    try {
      localStorage.setItem('jiu-jitsu-students', JSON.stringify(studentsToSave))
      console.log('StudentContext: Saved students to localStorage:', studentsToSave)
    } catch (error) {
      console.error('StudentContext: Error saving students to localStorage:', error)
    }
  }

  const addStudent = (student: Student) => {
    console.log('=== STUDENT CONTEXT: ADD STUDENT CALLED ===')
    console.log('StudentContext: Adding student:', student)
    setStudents(prev => {
      const newStudents = [...prev, student]
      console.log('StudentContext: Previous students count:', prev.length)
      console.log('StudentContext: New students array:', newStudents)
      console.log('StudentContext: New students count:', newStudents.length)
      saveStudentsToStorage(newStudents)
      console.log('StudentContext: Students saved to localStorage')
      return newStudents
    })
  }

  const updateStudent = (studentId: string, updatedStudent: Student) => {
    setStudents(prev => {
      const updatedStudents = prev.map(student => 
        student.studentId === studentId ? updatedStudent : student
      )
      saveStudentsToStorage(updatedStudents)
      return updatedStudents
    })
  }

  const deleteStudent = (studentId: string) => {
    setStudents(prev => {
      const filteredStudents = prev.filter(student => student.studentId !== studentId)
      saveStudentsToStorage(filteredStudents)
      return filteredStudents
    })
  }

  const getStudent = (studentId: string) => {
    return students.find(student => student.studentId === studentId)
  }

  const clearAllStudents = () => {
    setStudents([])
    saveStudentsToStorage([])
  }

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudent,
      clearAllStudents
    }}>
      {children}
    </StudentContext.Provider>
  )
}

export const useStudents = () => {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider')
  }
  return context
}
