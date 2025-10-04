import React, { createContext, useState, useContext, ReactNode } from 'react'

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
        
        // Migrate existing students to include isKidsStudent field
        const migratedStudents = parsed.map((student: any) => {
          if (student.isKidsStudent === undefined) {
            // Calculate age and set isKidsStudent based on birth date
            const today = new Date()
            const dob = new Date(student.birthDate)
            let age = today.getFullYear() - dob.getFullYear()
            const m = today.getMonth() - dob.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
              age--
            }
            student.isKidsStudent = age < 18
            console.log(`StudentContext: Migrated student ${student.firstName} ${student.lastName} - Age: ${age}, isKidsStudent: ${student.isKidsStudent}`)
          }
          return student
        })
        
        // Save migrated data back to localStorage
        localStorage.setItem('jiu-jitsu-students', JSON.stringify(migratedStudents))
        
        return migratedStudents
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
