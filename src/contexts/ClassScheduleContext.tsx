import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface ClassSchedule {
  classId: string
  className: string
  classDescription?: string
  branchId: string
  facilityId: string
  teacherId: string
  modalityIds: string[]
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  daysOfWeek: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  duration: number // in minutes
  maxCapacity: number
  currentEnrollment: number
  status: 'active' | 'inactive' | 'cancelled' | 'completed'
  classType: 'regular' | 'private' | 'seminar' | 'workshop' | 'competition'
  genderCategory: 'unisex' | 'womens'
  ageCategory: 'adult' | 'master' | 'kids1' | 'kids2'
  price?: number
  recurring: boolean
  recurringPattern?: 'weekly' | 'bi-weekly' | 'monthly'
  recurringEndDate?: string
  requirements?: string[]
  equipment?: string[]
  notes?: string
  createdDate: string
  lastModified: string
}

interface ClassScheduleContextType {
  classes: ClassSchedule[]
  addClass: (classSchedule: ClassSchedule) => void
  updateClass: (classSchedule: ClassSchedule) => void
  deleteClass: (classId: string) => void
  getClass: (classId: string) => ClassSchedule | undefined
  getClassesByBranch: (branchId: string) => ClassSchedule[]
  getClassesByTeacher: (teacherId: string) => ClassSchedule[]
  getClassesByModality: (modalityId: string) => ClassSchedule[]
  getActiveClasses: () => ClassSchedule[]
  getClassesByDay: (dayOfWeek: string) => ClassSchedule[]
}

const ClassScheduleContext = createContext<ClassScheduleContextType | undefined>(undefined)

// Sample data
const initialClasses: ClassSchedule[] = [
  {
    classId: 'CLS001',
    className: 'BJJ Fundamentals',
    classDescription: 'Basic Brazilian Jiu-Jitsu techniques for beginners',
    branchId: 'BR001',
    facilityId: 'FAC002',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    startTime: '18:00',
    endTime: '19:30',
    daysOfWeek: ['monday'],
    duration: 90,
    maxCapacity: 20,
    currentEnrollment: 15,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 50,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Gi', 'Water Bottle'],
    equipment: ['Mats', 'Timer'],
    notes: 'Focus on basic positions and submissions',
    createdDate: '2024-01-01',
    lastModified: '2024-01-15'
  },
  {
    classId: 'CLS002',
    className: 'Advanced BJJ',
    classDescription: 'Advanced techniques and competition preparation',
    branchId: 'BR001',
    facilityId: 'FAC002',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    startTime: '19:30',
    endTime: '21:00',
    daysOfWeek: ['monday'],
    duration: 90,
    maxCapacity: 15,
    currentEnrollment: 12,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 60,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Blue Belt or Higher', 'Gi'],
    equipment: ['Mats', 'Timer', 'Grappling Dummies'],
    notes: 'Competition-focused training',
    createdDate: '2024-01-01',
    lastModified: '2024-01-15'
  },
  {
    classId: 'CLS003',
    className: 'Boxing Basics',
    classDescription: 'Introduction to boxing fundamentals',
    branchId: 'BR001',
    facilityId: 'FAC001',
    teacherId: 'TCH002',
    modalityIds: ['MOD002'],
    startDate: '2024-01-16',
    endDate: '2024-12-31',
    startTime: '17:00',
    endTime: '18:00',
    daysOfWeek: ['tuesday'],
    duration: 60,
    maxCapacity: 25,
    currentEnrollment: 18,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 45,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Hand Wraps', 'Boxing Gloves'],
    equipment: ['Heavy Bags', 'Focus Mitts', 'Timer'],
    notes: 'Great for fitness and self-defense',
    createdDate: '2024-01-01',
    lastModified: '2024-01-16'
  },
  {
    classId: 'CLS004',
    className: 'Kids BJJ (Ages 6-12)',
    classDescription: 'Fun and safe BJJ training for children',
    branchId: 'BR001',
    facilityId: 'FAC008',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-17',
    endDate: '2024-12-31',
    startTime: '16:00',
    endTime: '17:00',
    daysOfWeek: ['wednesday'],
    duration: 60,
    maxCapacity: 20,
    currentEnrollment: 16,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'kids1',
    price: 40,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Kids Gi', 'Water Bottle'],
    equipment: ['Soft Mats', 'Colorful Equipment'],
    notes: 'Focus on fun, discipline, and basic techniques',
    createdDate: '2024-01-01',
    lastModified: '2024-01-17'
  },
  {
    classId: 'CLS005',
    className: 'Private Training Session',
    classDescription: 'One-on-one personalized training',
    branchId: 'BR001',
    facilityId: 'FAC002',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-18',
    endDate: '2024-01-18',
    startTime: '14:00',
    endTime: '15:00',
    daysOfWeek: ['thursday'],
    duration: 60,
    maxCapacity: 1,
    currentEnrollment: 1,
    status: 'active',
    classType: 'private',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 100,
    recurring: false,
    requirements: ['Gi'],
    equipment: ['Mats'],
    notes: 'Personalized technique development',
    createdDate: '2024-01-01',
    lastModified: '2024-01-18'
  },
  {
    classId: 'CLS006',
    className: 'Karate Fundamentals',
    classDescription: 'Traditional karate techniques and forms',
    branchId: 'BR002',
    facilityId: 'FAC001',
    teacherId: 'TCH002',
    modalityIds: ['MOD003'],
    startDate: '2024-01-19',
    endDate: '2024-12-31',
    startTime: '18:30',
    endTime: '19:30',
    daysOfWeek: ['friday'],
    duration: 60,
    maxCapacity: 20,
    currentEnrollment: 14,
    status: 'active',
    classType: 'regular',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 50,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Karate Gi', 'Belt'],
    equipment: ['Mats', 'Mirrors'],
    notes: 'Traditional karate training',
    createdDate: '2024-01-01',
    lastModified: '2024-01-19'
  },
  {
    classId: 'CLS007',
    className: 'BJJ Workshop - Guard Passing',
    classDescription: 'Intensive workshop on guard passing techniques',
    branchId: 'BR001',
    facilityId: 'FAC002',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    startTime: '10:00',
    endTime: '12:00',
    daysOfWeek: ['saturday'],
    duration: 120,
    maxCapacity: 30,
    currentEnrollment: 25,
    status: 'active',
    classType: 'workshop',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 80,
    recurring: false,
    requirements: ['Gi', 'Notebook'],
    equipment: ['Mats', 'Grappling Dummies', 'Timer'],
    notes: 'Specialized workshop for intermediate students',
    createdDate: '2024-01-01',
    lastModified: '2024-01-20'
  },
  {
    classId: 'CLS008',
    className: 'Competition Training',
    classDescription: 'Intensive training for upcoming competitions',
    branchId: 'BR001',
    facilityId: 'FAC002',
    teacherId: 'TCH001',
    modalityIds: ['MOD001'],
    startDate: '2024-01-21',
    endDate: '2024-12-31',
    startTime: '09:00',
    endTime: '11:00',
    daysOfWeek: ['sunday'],
    duration: 120,
    maxCapacity: 15,
    currentEnrollment: 10,
    status: 'active',
    classType: 'competition',
    genderCategory: 'unisex',
    ageCategory: 'adult',
    price: 70,
    recurring: true,
    recurringPattern: 'weekly',
    requirements: ['Competition Gi', 'Mouth Guard'],
    equipment: ['Mats', 'Timer', 'Scoreboard'],
    notes: 'High-intensity competition preparation',
    createdDate: '2024-01-01',
    lastModified: '2024-01-21'
  }
]

export const ClassScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useTenantData<ClassSchedule[]>('jiu-jitsu-class-schedules', initialClasses)

  const addClass = (classSchedule: ClassSchedule) => {
    console.log('ClassScheduleContext: Adding class:', classSchedule)
    setClasses(prev => [...prev, classSchedule])
  }

  const updateClass = (classSchedule: ClassSchedule) => {
    console.log('ClassScheduleContext: Updating class:', classSchedule)
    setClasses(prev => prev.map(c => c.classId === classSchedule.classId ? classSchedule : c))
  }

  const deleteClass = (classId: string) => {
    console.log('ClassScheduleContext: Deleting class:', classId)
    setClasses(prev => prev.filter(c => c.classId !== classId))
  }

  const getClass = (classId: string) => {
    return classes.find(classSchedule => classSchedule.classId === classId)
  }

  const getClassesByBranch = (branchId: string) => {
    return classes.filter(classSchedule => classSchedule.branchId === branchId)
  }

  const getClassesByTeacher = (teacherId: string) => {
    return classes.filter(classSchedule => classSchedule.teacherId === teacherId)
  }

  const getClassesByModality = (modalityId: string) => {
    return classes.filter(classSchedule => classSchedule.modalityIds.includes(modalityId))
  }

  const getActiveClasses = () => {
    return classes.filter(classSchedule => classSchedule.status === 'active')
  }

  const getClassesByDay = (dayOfWeek: string) => {
    return classes.filter(classSchedule => classSchedule.daysOfWeek.includes(dayOfWeek as any))
  }

  const value: ClassScheduleContextType = {
    classes,
    addClass,
    updateClass,
    deleteClass,
    getClass,
    getClassesByBranch,
    getClassesByTeacher,
    getClassesByModality,
    getActiveClasses,
    getClassesByDay
  }

  return (
    <ClassScheduleContext.Provider value={value}>
      {children}
    </ClassScheduleContext.Provider>
  )
}

export const useClassSchedules = () => {
  const context = useContext(ClassScheduleContext)
  if (context === undefined) {
    throw new Error('useClassSchedules must be used within a ClassScheduleProvider')
  }
  return context
}

