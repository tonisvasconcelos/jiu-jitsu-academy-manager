import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface ChampionshipRegistration {
  registrationId: string
  studentId: string
  championshipId: string
  categoryId: string
  teacherId: string
  status: 'pending' | 'confirmed' | 'weighed-in' | 'disqualified' | 'withdrawn' | 'completed'
  registrationDate: string
  weight?: number
  notes?: string
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  paymentDate?: string
  medicalCertificate?: string
  insuranceNumber?: string
}

interface ChampionshipRegistrationContextType {
  registrations: ChampionshipRegistration[]
  addRegistration: (registration: Omit<ChampionshipRegistration, 'registrationId'>) => void
  updateRegistration: (id: string, registration: Partial<ChampionshipRegistration>) => void
  deleteRegistration: (id: string) => void
  getRegistration: (id: string) => ChampionshipRegistration | undefined
  getRegistrationsByStudent: (studentId: string) => ChampionshipRegistration[]
  getRegistrationsByChampionship: (championshipId: string) => ChampionshipRegistration[]
  getRegistrationsByCategory: (categoryId: string) => ChampionshipRegistration[]
  getRegistrationsByTeacher: (teacherId: string) => ChampionshipRegistration[]
}

const ChampionshipRegistrationContext = createContext<ChampionshipRegistrationContextType | undefined>(undefined)

export const useChampionshipRegistrations = () => {
  const context = useContext(ChampionshipRegistrationContext)
  if (!context) {
    throw new Error('useChampionshipRegistrations must be used within a ChampionshipRegistrationProvider')
  }
  return context
}

export const ChampionshipRegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useTenantData<ChampionshipRegistration[]>('championshipRegistrations', [])

  const addRegistration = (registration: Omit<ChampionshipRegistration, 'registrationId'>) => {
    const newRegistration: ChampionshipRegistration = {
      ...registration,
      registrationId: `REG${Date.now().toString().slice(-6)}`
    }
    setRegistrations(prev => [...prev, newRegistration])
  }

  const updateRegistration = (id: string, updatedRegistration: Partial<ChampionshipRegistration>) => {
    setRegistrations(prev => 
      prev.map(registration => 
        registration.registrationId === id 
          ? { ...registration, ...updatedRegistration }
          : registration
      )
    )
  }

  const deleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(registration => registration.registrationId !== id))
  }

  const getRegistration = (id: string) => {
    return registrations.find(registration => registration.registrationId === id)
  }

  const getRegistrationsByStudent = (studentId: string) => {
    return registrations.filter(registration => registration.studentId === studentId)
  }

  const getRegistrationsByChampionship = (championshipId: string) => {
    return registrations.filter(registration => registration.championshipId === championshipId)
  }

  const getRegistrationsByCategory = (categoryId: string) => {
    return registrations.filter(registration => registration.categoryId === categoryId)
  }

  const getRegistrationsByTeacher = (teacherId: string) => {
    return registrations.filter(registration => registration.teacherId === teacherId)
  }

  const value: ChampionshipRegistrationContextType = {
    registrations,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    getRegistration,
    getRegistrationsByStudent,
    getRegistrationsByChampionship,
    getRegistrationsByCategory,
    getRegistrationsByTeacher
  }

  return (
    <ChampionshipRegistrationContext.Provider value={value}>
      {children}
    </ChampionshipRegistrationContext.Provider>
  )
}
