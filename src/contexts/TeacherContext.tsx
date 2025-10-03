import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface Teacher {
  teacherId: string
  firstName: string
  lastName: string
  displayName: string
  birthDate: string
  gender: 'male' | 'female' | 'other'
  teacherType: 'professor' | 'instructor' | 'trainee'
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
  fightModalities: string[] // Array of fight modality IDs (multiple modalities)
  experience: number // Years of experience
  certifications: string[] // Array of certification names
  bio?: string
  hireDate: string
  salary?: number
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface TeacherContextType {
  teachers: Teacher[]
  addTeacher: (teacher: Teacher) => void
  updateTeacher: (teacherId: string, updatedTeacher: Teacher) => void
  deleteTeacher: (teacherId: string) => void
  getTeacher: (teacherId: string) => Teacher | undefined
  getTeachersByBranch: (branchId: string) => Teacher[]
  getActiveTeachers: () => Teacher[]
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined)

// Sample initial data
const initialTeachers: Teacher[] = [
  {
    teacherId: 'TCH001',
    firstName: 'Carlos',
    lastName: 'Silva',
    displayName: 'Carlos Silva',
    birthDate: '1985-03-15',
    gender: 'male',
    teacherType: 'professor',
    beltLevel: 'black',
    documentId: '12345678901',
    email: 'carlos.silva@academy.com',
    phone: '+55 11 99999-1111',
    branchId: 'BR001',
    active: true,
    isKidsStudent: false,
    weight: 75,
    weightDivisionId: 'WD001',
    photoUrl: '',
    fightModalities: ['MOD001', 'MOD002'], // BJJ and Boxing
    experience: 15,
    certifications: ['IBJJF Black Belt', 'Boxing Coach Level 2'],
    bio: 'Experienced martial arts instructor with 15 years of teaching experience.',
    hireDate: '2010-01-15',
    salary: 5000,
    emergencyContact: {
      name: 'Maria Silva',
      phone: '+55 11 99999-2222',
      relationship: 'Wife'
    }
  },
  {
    teacherId: 'TCH002',
    firstName: 'Ana',
    lastName: 'Santos',
    displayName: 'Ana Santos',
    birthDate: '1990-07-22',
    gender: 'female',
    teacherType: 'instructor',
    beltLevel: 'brown',
    documentId: '98765432100',
    email: 'ana.santos@academy.com',
    phone: '+55 11 99999-3333',
    branchId: 'BR001',
    active: true,
    isKidsStudent: false,
    weight: 60,
    weightDivisionId: 'WD002',
    photoUrl: '',
    fightModalities: ['MOD001'], // BJJ
    experience: 8,
    certifications: ['IBJJF Brown Belt', 'Kids BJJ Instructor'],
    bio: 'Specialized in kids BJJ instruction with a focus on character development.',
    hireDate: '2015-06-01',
    salary: 3500,
    emergencyContact: {
      name: 'João Santos',
      phone: '+55 11 99999-4444',
      relationship: 'Brother'
    }
  },
  {
    teacherId: 'TCH003',
    firstName: 'Pedro',
    lastName: 'Costa',
    displayName: 'Pedro Costa',
    birthDate: '1995-12-10',
    gender: 'male',
    teacherType: 'trainee',
    beltLevel: 'purple',
    documentId: '11122233344',
    email: 'pedro.costa@academy.com',
    phone: '+55 11 99999-5555',
    branchId: 'BR001',
    active: true,
    isKidsStudent: false,
    weight: 70,
    weightDivisionId: 'WD001',
    photoUrl: '',
    fightModalities: ['MOD001', 'MOD0938592'], // BJJ and Karate
    experience: 3,
    certifications: ['IBJJF Purple Belt'],
    bio: 'Young instructor in training, passionate about martial arts.',
    hireDate: '2022-03-01',
    salary: 2000,
    emergencyContact: {
      name: 'Lucia Costa',
      phone: '+55 11 99999-6666',
      relationship: 'Mother'
    }
  }
]

const loadTeachersFromStorage = (): Teacher[] => {
  try {
    const stored = localStorage.getItem('jiu-jitsu-teachers')
    if (stored) {
      const parsed = JSON.parse(stored)
      console.log('TeacherContext: Loaded teachers from localStorage:', parsed)
      return parsed
    }
  } catch (error) {
    console.error('TeacherContext: Error loading teachers from localStorage:', error)
  }
  console.log('TeacherContext: No saved data found, using default teachers')
  return initialTeachers
}

const saveTeachersToStorage = (teachers: Teacher[]) => {
  try {
    localStorage.setItem('jiu-jitsu-teachers', JSON.stringify(teachers))
    console.log('TeacherContext: Saved teachers to localStorage:', teachers)
  } catch (error) {
    console.error('TeacherContext: Error saving teachers to localStorage:', error)
  }
}

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(loadTeachersFromStorage)

  const addTeacher = (teacher: Teacher) => {
    console.log('TeacherContext: Adding teacher:', teacher)
    const newTeachers = [...teachers, teacher]
    setTeachers(newTeachers)
    saveTeachersToStorage(newTeachers)
  }

  const updateTeacher = (teacherId: string, updatedTeacher: Teacher) => {
    console.log('TeacherContext: Updating teacher:', teacherId, updatedTeacher)
    const newTeachers = teachers.map(teacher => 
      teacher.teacherId === teacherId ? updatedTeacher : teacher
    )
    setTeachers(newTeachers)
    saveTeachersToStorage(newTeachers)
  }

  const deleteTeacher = (teacherId: string) => {
    console.log('TeacherContext: Deleting teacher:', teacherId)
    const newTeachers = teachers.filter(teacher => teacher.teacherId !== teacherId)
    setTeachers(newTeachers)
    saveTeachersToStorage(newTeachers)
  }

  const getTeacher = (teacherId: string) => {
    console.log('TeacherContext: getTeacher called with ID:', teacherId)
    console.log('TeacherContext: Available teachers:', teachers)
    const foundTeacher = teachers.find(teacher => teacher.teacherId === teacherId)
    console.log('TeacherContext: Found teacher:', foundTeacher)
    return foundTeacher
  }

  const getTeachersByBranch = (branchId: string) => {
    return teachers.filter(teacher => teacher.branchId === branchId)
  }

  const getActiveTeachers = () => {
    return teachers.filter(teacher => teacher.active)
  }

  const value: TeacherContextType = {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacher,
    getTeachersByBranch,
    getActiveTeachers
  }

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  )
}

export const useTeachers = () => {
  const context = useContext(TeacherContext)
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeacherProvider')
  }
  return context
}
