import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

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
  const phases = useTenantData<FightPhase>('fightPhases') // tenantId comes from AuthContext

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
