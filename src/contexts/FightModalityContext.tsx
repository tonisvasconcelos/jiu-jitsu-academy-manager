import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface FightModality {
  modalityId: string
  name: string
  description: string
  type: 'striking' | 'grappling' | 'mixed' | 'other'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration: number // in minutes
  active: boolean
  createdAt: string
}

interface FightModalityContextType {
  modalities: FightModality[]
  addModality: (modality: FightModality) => void
  updateModality: (modalityId: string, updatedModality: FightModality) => void
  deleteModality: (modalityId: string) => void
  getModality: (modalityId: string) => FightModality | undefined
}

const FightModalityContext = createContext<FightModalityContextType | undefined>(undefined)

// Sample initial data
const initialModalities: FightModality[] = [
  {
    modalityId: 'MOD001',
    name: 'Brazilian Jiu-Jitsu',
    description: 'Ground fighting and submission grappling martial art',
    type: 'grappling',
    level: 'intermediate',
    duration: 90,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    modalityId: 'MOD002',
    name: 'Boxing',
    description: 'Striking martial art using punches',
    type: 'striking',
    level: 'beginner',
    duration: 60,
    active: true,
    createdAt: new Date().toISOString()
  }
]

export const FightModalityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load modalities from localStorage or use initial data
  const loadModalitiesFromStorage = (): FightModality[] => {
    try {
      const stored = localStorage.getItem('jiu-jitsu-modalities')
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('FightModalityContext: Loaded modalities from localStorage:', parsed)
        return parsed
      }
    } catch (error) {
      console.error('FightModalityContext: Error loading modalities from localStorage:', error)
    }
    console.log('FightModalityContext: No saved data found, starting with initial modalities data')
    return initialModalities
  }

  const [modalities, setModalities] = useState<FightModality[]>(loadModalitiesFromStorage)

  // Save modalities to localStorage
  const saveModalitiesToStorage = (modalitiesToSave: FightModality[]) => {
    try {
      localStorage.setItem('jiu-jitsu-modalities', JSON.stringify(modalitiesToSave))
      console.log('FightModalityContext: Saved modalities to localStorage:', modalitiesToSave)
    } catch (error) {
      console.error('FightModalityContext: Error saving modalities to localStorage:', error)
    }
  }

  const addModality = (modality: FightModality) => {
    console.log('=== FIGHT MODALITY CONTEXT: ADD MODALITY CALLED ===')
    console.log('FightModalityContext: Adding modality:', modality)
    setModalities(prev => {
      const newModalities = [...prev, modality]
      console.log('FightModalityContext: Previous modalities count:', prev.length)
      console.log('FightModalityContext: New modalities array:', newModalities)
      console.log('FightModalityContext: New modalities count:', newModalities.length)
      saveModalitiesToStorage(newModalities)
      console.log('FightModalityContext: Modalities saved to localStorage')
      return newModalities
    })
  }

  const updateModality = (modalityId: string, updatedModality: FightModality) => {
    setModalities(prev => {
      const updatedModalities = prev.map(modality => 
        modality.modalityId === modalityId ? updatedModality : modality
      )
      saveModalitiesToStorage(updatedModalities)
      return updatedModalities
    })
  }

  const deleteModality = (modalityId: string) => {
    setModalities(prev => {
      const filteredModalities = prev.filter(modality => modality.modalityId !== modalityId)
      saveModalitiesToStorage(filteredModalities)
      return filteredModalities
    })
  }

  const getModality = (modalityId: string) => {
    return modalities.find(modality => modality.modalityId === modalityId)
  }

  return (
    <FightModalityContext.Provider value={{
      modalities,
      addModality,
      updateModality,
      deleteModality,
      getModality
    }}>
      {children}
    </FightModalityContext.Provider>
  )
}

export const useFightModalities = () => {
  const context = useContext(FightModalityContext)
  if (context === undefined) {
    throw new Error('useFightModalities must be used within a FightModalityProvider')
  }
  return context
}
