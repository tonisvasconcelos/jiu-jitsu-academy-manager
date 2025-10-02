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
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

// Sample initial data
const initialStudents: Student[] = [
  {
    studentId: 'STU001',
    firstName: 'João',
    lastName: 'Silva',
    displayName: 'João Silva',
    birthDate: '1995-03-15',
    gender: 'male',
    beltLevel: 'blue',
    documentId: '12345678901',
    email: 'joao.silva@email.com',
    phone: '+55 11 99999-9999',
    branchId: 'BR001',
    active: true,
    photoUrl: ''
  },
  {
    studentId: 'STU002',
    firstName: 'Maria',
    lastName: 'Santos',
    displayName: 'Maria Santos',
    birthDate: '1998-07-22',
    gender: 'female',
    beltLevel: 'purple',
    documentId: '98765432100',
    email: 'maria.santos@email.com',
    phone: '+55 11 88888-8888',
    branchId: 'BR001',
    active: true,
    photoUrl: ''
  }
]

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents)

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student])
  }

  const updateStudent = (studentId: string, updatedStudent: Student) => {
    setStudents(prev => 
      prev.map(student => 
        student.studentId === studentId ? updatedStudent : student
      )
    )
  }

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.studentId !== studentId))
  }

  const getStudent = (studentId: string) => {
    return students.find(student => student.studentId === studentId)
  }

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudent
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
