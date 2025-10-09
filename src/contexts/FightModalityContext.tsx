import React, { createContext, useContext, ReactNode } from 'react'
import { useMasterData } from '../hooks/useMasterData'

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
  const {
    data: fightModalities,
    isLoading,
    error,
    addItem: addFightModality,
    updateItem: updateFightModality,
    deleteItem: deleteFightModality,
    refreshData: refreshFightModalities,
    clearError
  } = useMasterData<FightModality>({
    dataType: 'fightModalities',
    initialData: []
  })

  // Helper function to get modality by id
  const getFightModality = (modalityId: string): FightModality | undefined => {
    return fightModalities.find(modality => modality.id === modalityId)
  }

  const contextValue: FightModalityContextType = {
    fightModalities,
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