import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface FightPhase {
  phaseId: string
  championshipId: string
  phaseName: string
  phaseType: 'elimination' | 'round-robin' | 'bracket' | 'pool'
  phaseOrder: number
  startDate: string
  endDate: string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  description?: string
  maxParticipants?: number
  rules?: string
  isActive: boolean
}

interface FightPhaseContextType {
  phases: FightPhase[]
  addPhase: (phase: Omit<FightPhase, 'phaseId'>) => void
  updatePhase: (phaseId: string, phase: Partial<FightPhase>) => void
  deletePhase: (phaseId: string) => void
  getPhase: (phaseId: string) => FightPhase | undefined
  getPhasesByChampionship: (championshipId: string) => FightPhase[]
  getActivePhases: () => FightPhase[]
}

const FightPhaseContext = createContext<FightPhaseContextType | undefined>(undefined)

export const useFightPhases = () => {
  const context = useContext(FightPhaseContext)
  if (!context) {
    throw new Error('useFightPhases must be used within a FightPhaseProvider')
  }
  return context
}

interface FightPhaseProviderProps {
  children: ReactNode
}

export const FightPhaseProvider: React.FC<FightPhaseProviderProps> = ({ children }) => {
  const [phases, setPhases] = useState<FightPhase[]>([])

  // Load phases from localStorage on component mount
  useEffect(() => {
    const savedPhases = localStorage.getItem('fightPhases')
    if (savedPhases) {
      try {
        setPhases(JSON.parse(savedPhases))
      } catch (error) {
        console.error('Error loading fight phases from localStorage:', error)
        setPhases([])
      }
    } else {
      // Initialize with sample data
      const initialPhases: FightPhase[] = [
        {
          phaseId: 'FP001',
          championshipId: 'CH001',
          phaseName: 'Elimination Round',
          phaseType: 'elimination',
          phaseOrder: 1,
          startDate: '2025-10-11',
          endDate: '2025-10-11',
          status: 'scheduled',
          description: 'First elimination round',
          maxParticipants: 32,
          rules: 'Single elimination format',
          isActive: true
        },
        {
          phaseId: 'FP002',
          championshipId: 'CH001',
          phaseName: 'Quarter Finals',
          phaseType: 'bracket',
          phaseOrder: 2,
          startDate: '2025-10-12',
          endDate: '2025-10-12',
          status: 'scheduled',
          description: 'Quarter final matches',
          maxParticipants: 8,
          rules: 'Bracket format',
          isActive: true
        },
        {
          phaseId: 'FP003',
          championshipId: 'CH001',
          phaseName: 'Semi Finals',
          phaseType: 'bracket',
          phaseOrder: 3,
          startDate: '2025-10-12',
          endDate: '2025-10-12',
          status: 'scheduled',
          description: 'Semi final matches',
          maxParticipants: 4,
          rules: 'Bracket format',
          isActive: true
        },
        {
          phaseId: 'FP004',
          championshipId: 'CH001',
          phaseName: 'Finals',
          phaseType: 'bracket',
          phaseOrder: 4,
          startDate: '2025-10-12',
          endDate: '2025-10-12',
          status: 'scheduled',
          description: 'Final matches',
          maxParticipants: 2,
          rules: 'Bracket format',
          isActive: true
        }
      ]
      setPhases(initialPhases)
      localStorage.setItem('fightPhases', JSON.stringify(initialPhases))
    }
  }, [])

  // Save phases to localStorage whenever phases change
  useEffect(() => {
    if (phases.length > 0) {
      localStorage.setItem('fightPhases', JSON.stringify(phases))
    }
  }, [phases])

  const generatePhaseId = (): string => {
    const existingIds = phases.map(phase => phase.phaseId)
    let counter = 1
    let newId = `FP${counter.toString().padStart(3, '0')}`
    
    while (existingIds.includes(newId)) {
      counter++
      newId = `FP${counter.toString().padStart(3, '0')}`
    }
    
    return newId
  }

  const addPhase = (phaseData: Omit<FightPhase, 'phaseId'>) => {
    const newPhase: FightPhase = {
      ...phaseData,
      phaseId: generatePhaseId()
    }
    setPhases(prev => [...prev, newPhase])
  }

  const updatePhase = (phaseId: string, phaseData: Partial<FightPhase>) => {
    setPhases(prev => prev.map(phase => 
      phase.phaseId === phaseId ? { ...phase, ...phaseData } : phase
    ))
  }

  const deletePhase = (phaseId: string) => {
    setPhases(prev => prev.filter(phase => phase.phaseId !== phaseId))
  }

  const getPhase = (phaseId: string): FightPhase | undefined => {
    return phases.find(phase => phase.phaseId === phaseId)
  }

  const getPhasesByChampionship = (championshipId: string): FightPhase[] => {
    return phases.filter(phase => phase.championshipId === championshipId)
  }

  const getActivePhases = (): FightPhase[] => {
    return phases.filter(phase => phase.isActive)
  }

  const value: FightPhaseContextType = {
    phases,
    addPhase,
    updatePhase,
    deletePhase,
    getPhase,
    getPhasesByChampionship,
    getActivePhases
  }

  return (
    <FightPhaseContext.Provider value={value}>
      {children}
    </FightPhaseContext.Provider>
  )
}
