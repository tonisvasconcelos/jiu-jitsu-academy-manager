import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Fight {
  fightId: string
  phaseId: string
  championshipId: string
  fightNumber: string
  categoryId: string
  athlete1Id: string
  athlete2Id: string
  scheduledTime: string
  actualStartTime?: string
  actualEndTime?: string
  duration?: number // in minutes
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'postponed'
  result?: 'athlete1' | 'athlete2' | 'draw' | 'no-contest'
  winnerId?: string
  method?: 'submission' | 'points' | 'decision' | 'disqualification' | 'injury' | 'forfeit'
  score1?: number
  score2?: number
  refereeId?: string
  judge1Id?: string
  judge2Id?: string
  judge3Id?: string
  notes?: string
  videoUrl?: string
  isActive: boolean
}

interface FightContextType {
  fights: Fight[]
  addFight: (fight: Omit<Fight, 'fightId'>) => void
  updateFight: (fightId: string, fight: Partial<Fight>) => void
  deleteFight: (fightId: string) => void
  getFight: (fightId: string) => Fight | undefined
  getFightsByPhase: (phaseId: string) => Fight[]
  getFightsByChampionship: (championshipId: string) => Fight[]
  getFightsByAthlete: (athleteId: string) => Fight[]
  getActiveFights: () => Fight[]
  getCompletedFights: () => Fight[]
}

const FightContext = createContext<FightContextType | undefined>(undefined)

export const useFights = () => {
  const context = useContext(FightContext)
  if (!context) {
    throw new Error('useFights must be used within a FightProvider')
  }
  return context
}

interface FightProviderProps {
  children: ReactNode
}

export const FightProvider: React.FC<FightProviderProps> = ({ children }) => {
  const [fights, setFights] = useState<Fight[]>([])

  // Load fights from localStorage on component mount
  useEffect(() => {
    const savedFights = localStorage.getItem('fights')
    if (savedFights) {
      try {
        setFights(JSON.parse(savedFights))
      } catch (error) {
        console.error('Error loading fights from localStorage:', error)
        setFights([])
      }
    } else {
      // Initialize with sample data
      const initialFights: Fight[] = [
        {
          fightId: 'F001',
          phaseId: 'FP001',
          championshipId: 'CH001',
          fightNumber: 'F001',
          categoryId: 'CC001',
          athlete1Id: 'ST001',
          athlete2Id: 'ST002',
          scheduledTime: '2025-10-11T10:00:00',
          status: 'scheduled',
          isActive: true
        },
        {
          fightId: 'F002',
          phaseId: 'FP001',
          championshipId: 'CH001',
          fightNumber: 'F002',
          categoryId: 'CC001',
          athlete1Id: 'ST003',
          athlete2Id: 'ST004',
          scheduledTime: '2025-10-11T10:30:00',
          status: 'scheduled',
          isActive: true
        },
        {
          fightId: 'F003',
          phaseId: 'FP002',
          championshipId: 'CH001',
          fightNumber: 'F003',
          categoryId: 'CC001',
          athlete1Id: 'ST001',
          athlete2Id: 'ST003',
          scheduledTime: '2025-10-12T14:00:00',
          status: 'scheduled',
          isActive: true
        }
      ]
      setFights(initialFights)
      localStorage.setItem('fights', JSON.stringify(initialFights))
    }
  }, [])

  // Save fights to localStorage whenever fights change
  useEffect(() => {
    if (fights.length > 0) {
      localStorage.setItem('fights', JSON.stringify(fights))
    }
  }, [fights])

  const generateFightId = (): string => {
    const existingIds = fights.map(fight => fight.fightId)
    let counter = 1
    let newId = `F${counter.toString().padStart(3, '0')}`
    
    while (existingIds.includes(newId)) {
      counter++
      newId = `F${counter.toString().padStart(3, '0')}`
    }
    
    return newId
  }

  const generateFightNumber = (championshipId: string): string => {
    const championshipFights = fights.filter(fight => fight.championshipId === championshipId)
    const nextNumber = championshipFights.length + 1
    return `F${nextNumber.toString().padStart(3, '0')}`
  }

  const addFight = (fightData: Omit<Fight, 'fightId'>) => {
    const newFight: Fight = {
      ...fightData,
      fightId: generateFightId(),
      fightNumber: fightData.fightNumber || generateFightNumber(fightData.championshipId)
    }
    setFights(prev => [...prev, newFight])
  }

  const updateFight = (fightId: string, fightData: Partial<Fight>) => {
    setFights(prev => prev.map(fight => 
      fight.fightId === fightId ? { ...fight, ...fightData } : fight
    ))
  }

  const deleteFight = (fightId: string) => {
    setFights(prev => prev.filter(fight => fight.fightId !== fightId))
  }

  const getFight = (fightId: string): Fight | undefined => {
    return fights.find(fight => fight.fightId === fightId)
  }

  const getFightsByPhase = (phaseId: string): Fight[] => {
    return fights.filter(fight => fight.phaseId === phaseId)
  }

  const getFightsByChampionship = (championshipId: string): Fight[] => {
    return fights.filter(fight => fight.championshipId === championshipId)
  }

  const getFightsByAthlete = (athleteId: string): Fight[] => {
    return fights.filter(fight => fight.athlete1Id === athleteId || fight.athlete2Id === athleteId)
  }

  const getActiveFights = (): Fight[] => {
    return fights.filter(fight => fight.isActive && fight.status === 'active')
  }

  const getCompletedFights = (): Fight[] => {
    return fights.filter(fight => fight.status === 'completed')
  }

  const value: FightContextType = {
    fights,
    addFight,
    updateFight,
    deleteFight,
    getFight,
    getFightsByPhase,
    getFightsByChampionship,
    getFightsByAthlete,
    getActiveFights,
    getCompletedFights
  }

  return (
    <FightContext.Provider value={value}>
      {children}
    </FightContext.Provider>
  )
}
