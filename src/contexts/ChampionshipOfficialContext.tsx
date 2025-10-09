import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

export interface ChampionshipOfficial {
  officialId: string
  championshipId: string
  name: string
  level: 'national' | 'international' | 'regional' | 'local'
  assignedCategories: string[]
  contactEmail?: string
  contactPhone?: string
  certificationNumber?: string
  certificationExpiry?: string
  notes?: string
  status: 'active' | 'inactive'
}

interface ChampionshipOfficialContextType {
  officials: ChampionshipOfficial[]
  addOfficial: (official: Omit<ChampionshipOfficial, 'officialId'>) => void
  updateOfficial: (id: string, official: Partial<ChampionshipOfficial>) => void
  deleteOfficial: (id: string) => void
  getOfficial: (id: string) => ChampionshipOfficial | undefined
  getOfficialsByChampionship: (championshipId: string) => ChampionshipOfficial[]
  getOfficialsByLevel: (level: string) => ChampionshipOfficial[]
  getOfficialsByCategory: (categoryId: string) => ChampionshipOfficial[]
}

const ChampionshipOfficialContext = createContext<ChampionshipOfficialContextType | undefined>(undefined)

export const useChampionshipOfficials = () => {
  const context = useContext(ChampionshipOfficialContext)
  if (!context) {
    throw new Error('useChampionshipOfficials must be used within a ChampionshipOfficialProvider')
  }
  return context
}

export const ChampionshipOfficialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useAuth()
  const [officials, setOfficials] = useState<ChampionshipOfficial[]>([])

  // Load officials from localStorage on mount
  useEffect(() => {
    const savedOfficials = getTenantData<ChampionshipOfficial[]>('championshipOfficials', tenant?.id || null, [])
    setOfficials(savedOfficials)
  }, [tenant?.id])

  // Save officials to localStorage whenever officials change
  useEffect(() => {
    saveTenantData('championshipOfficials', tenant?.id || null, officials)
  }, [officials, tenant?.id])

  const addOfficial = (official: Omit<ChampionshipOfficial, 'officialId'>) => {
    const newOfficial: ChampionshipOfficial = {
      ...official,
      officialId: `OFF${Date.now().toString().slice(-6)}`
    }
    setOfficials(prev => [...prev, newOfficial])
  }

  const updateOfficial = (id: string, updatedOfficial: Partial<ChampionshipOfficial>) => {
    setOfficials(prev => 
      prev.map(official => 
        official.officialId === id 
          ? { ...official, ...updatedOfficial }
          : official
      )
    )
  }

  const deleteOfficial = (id: string) => {
    setOfficials(prev => prev.filter(official => official.officialId !== id))
  }

  const getOfficial = (id: string) => {
    return officials.find(official => official.officialId === id)
  }

  const getOfficialsByChampionship = (championshipId: string) => {
    return officials.filter(official => official.championshipId === championshipId)
  }

  const getOfficialsByLevel = (level: string) => {
    return officials.filter(official => official.level === level)
  }

  const getOfficialsByCategory = (categoryId: string) => {
    return officials.filter(official => official.assignedCategories.includes(categoryId))
  }

  const value: ChampionshipOfficialContextType = {
    officials,
    addOfficial,
    updateOfficial,
    deleteOfficial,
    getOfficial,
    getOfficialsByChampionship,
    getOfficialsByLevel,
    getOfficialsByCategory
  }

  return (
    <ChampionshipOfficialContext.Provider value={value}>
      {children}
    </ChampionshipOfficialContext.Provider>
  )
}
