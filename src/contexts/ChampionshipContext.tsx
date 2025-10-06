import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Championship {
  championshipId: string
  associationId: string
  name: string
  qualifiedLocationId: string
  startDate: string
  endDate: string
  fightModality: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registrationDeadline: string
  description?: string
  maxParticipants?: number
  entryFee?: number
  organizer?: string
  contactEmail?: string
  contactPhone?: string
}

interface ChampionshipContextType {
  championships: Championship[]
  addChampionship: (championship: Omit<Championship, 'championshipId'>) => void
  updateChampionship: (id: string, championship: Partial<Championship>) => void
  deleteChampionship: (id: string) => void
  getChampionship: (id: string) => Championship | undefined
  getChampionshipsByAssociation: (associationId: string) => Championship[]
  getChampionshipsByModality: (modality: string) => Championship[]
}

const ChampionshipContext = createContext<ChampionshipContextType | undefined>(undefined)

export const useChampionships = () => {
  const context = useContext(ChampionshipContext)
  if (!context) {
    throw new Error('useChampionships must be used within a ChampionshipProvider')
  }
  return context
}

export const ChampionshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [championships, setChampionships] = useState<Championship[]>([])

  // Load championships from localStorage on mount
  useEffect(() => {
    const savedChampionships = localStorage.getItem('championships')
    if (savedChampionships) {
      try {
        setChampionships(JSON.parse(savedChampionships))
      } catch (error) {
        console.error('Error loading championships from localStorage:', error)
      }
    }
  }, [])

  // Save championships to localStorage whenever championships change
  useEffect(() => {
    localStorage.setItem('championships', JSON.stringify(championships))
  }, [championships])

  const addChampionship = (championship: Omit<Championship, 'championshipId'>) => {
    const newChampionship: Championship = {
      ...championship,
      championshipId: `CHP${Date.now().toString().slice(-6)}`
    }
    setChampionships(prev => [...prev, newChampionship])
  }

  const updateChampionship = (id: string, updatedChampionship: Partial<Championship>) => {
    setChampionships(prev => 
      prev.map(championship => 
        championship.championshipId === id 
          ? { ...championship, ...updatedChampionship }
          : championship
      )
    )
  }

  const deleteChampionship = (id: string) => {
    setChampionships(prev => prev.filter(championship => championship.championshipId !== id))
  }

  const getChampionship = (id: string) => {
    return championships.find(championship => championship.championshipId === id)
  }

  const getChampionshipsByAssociation = (associationId: string) => {
    return championships.filter(championship => championship.associationId === associationId)
  }

  const getChampionshipsByModality = (modality: string) => {
    return championships.filter(championship => championship.fightModality === modality)
  }

  const value: ChampionshipContextType = {
    championships,
    addChampionship,
    updateChampionship,
    deleteChampionship,
    getChampionship,
    getChampionshipsByAssociation,
    getChampionshipsByModality
  }

  return (
    <ChampionshipContext.Provider value={value}>
      {children}
    </ChampionshipContext.Provider>
  )
}
