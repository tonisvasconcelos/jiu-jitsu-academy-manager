import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useTenantData } from '../hooks/useTenantData'

export interface FightModality {
  name: string
  description: string
  active: boolean
  // API fields
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

interface FightModalityContextType {
  fightModalities: FightModality[]
  modalities: FightModality[] // Alias for Dashboard compatibility
  isLoading: boolean
  error: string | null
  addFightModality: (modality: Omit<FightModality, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFightModality: (modalityId: string, updatedModality: Partial<Omit<FightModality, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteFightModality: (modalityId: string) => Promise<void>
  getFightModality: (modalityId: string) => FightModality | undefined
  refreshFightModalities: () => Promise<void>
  clearError: () => void
}

const FightModalityContext = createContext<FightModalityContextType | undefined>(undefined)

export const FightModalityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const fightModalities = useTenantData<FightModality>('jiu-jitsu-fight-modalities') // tenantId comes from AuthContext
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to get modality by id
  const addFightModality = async (modality: Omit<FightModality, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement localStorage save
    console.log('FightModalityProvider: addFightModality called with', modality);
  }

  const updateFightModality = async (modalityId: string, updatedModality: Partial<Omit<FightModality, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => {
    // TODO: Implement localStorage save
    console.log('FightModalityProvider: updateFightModality called with', modalityId, updatedModality);
  }

  const deleteFightModality = async (modalityId: string) => {
    // TODO: Implement localStorage save
    console.log('FightModalityProvider: deleteFightModality called with', modalityId);
  }

  const getFightModality = (modalityId: string): FightModality | undefined => {
    return fightModalities.find(modality => modality.id === modalityId)
  }

  const refreshFightModalities = async () => {
    // TODO: Implement localStorage refresh
    console.log('FightModalityProvider: refreshFightModalities called');
  }

  const clearError = () => {
    setError(null);
  }

  const contextValue: FightModalityContextType = {
    fightModalities,
    modalities: fightModalities, // Alias for Dashboard compatibility
    isLoading,
    error,
    addFightModality,
    updateFightModality,
    deleteFightModality,
    getFightModality,
    refreshFightModalities,
    clearError
  }

  return (
    <FightModalityContext.Provider value={contextValue}>
      {children}
    </FightModalityContext.Provider>
  )
}

export const useFightModalities = (): FightModalityContextType => {
  const context = useContext(FightModalityContext)
  if (context === undefined) {
    throw new Error('useFightModalities must be used within a FightModalityProvider')
  }
  return context
}