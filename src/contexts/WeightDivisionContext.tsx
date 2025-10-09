import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

export interface WeightDivision {
  divisionId: string
  name: string
  minWeight: number
  maxWeight: number
  gender: 'male' | 'female' | 'both'
  ageGroup: 'adult' | 'kids' | 'both'
  active: boolean
  description?: string
}

interface WeightDivisionContextType {
  weightDivisions: WeightDivision[]
  addWeightDivision: (weightDivision: WeightDivision) => void
  updateWeightDivision: (divisionId: string, updatedWeightDivision: WeightDivision) => void
  deleteWeightDivision: (divisionId: string) => void
  getWeightDivision: (divisionId: string) => WeightDivision | undefined
  getWeightDivisionByWeight: (weight: number, gender: 'male' | 'female' | 'other', isKidsStudent: boolean) => WeightDivision | undefined
  clearAllWeightDivisions: () => void
}

const WeightDivisionContext = createContext<WeightDivisionContextType | undefined>(undefined)

// Default weight divisions based on common martial arts standards
const defaultWeightDivisions: WeightDivision[] = [
  // Adult Male Divisions
  { divisionId: 'ADULT_MALE_ROOSTER', name: 'Rooster', minWeight: 0, maxWeight: 57.5, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Rooster Weight Division' },
  { divisionId: 'ADULT_MALE_LIGHT_FEATHER', name: 'Light Feather', minWeight: 57.5, maxWeight: 64, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Light Feather Weight Division' },
  { divisionId: 'ADULT_MALE_FEATHER', name: 'Feather', minWeight: 64, maxWeight: 70, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Feather Weight Division' },
  { divisionId: 'ADULT_MALE_LIGHT', name: 'Light', minWeight: 70, maxWeight: 76, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Light Weight Division' },
  { divisionId: 'ADULT_MALE_MIDDLE', name: 'Middle', minWeight: 76, maxWeight: 82.3, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Middle Weight Division' },
  { divisionId: 'ADULT_MALE_MIDDLE_HEAVY', name: 'Middle Heavy', minWeight: 82.3, maxWeight: 88.3, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Middle Heavy Weight Division' },
  { divisionId: 'ADULT_MALE_HEAVY', name: 'Heavy', minWeight: 88.3, maxWeight: 94.3, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Heavy Weight Division' },
  { divisionId: 'ADULT_MALE_SUPER_HEAVY', name: 'Super Heavy', minWeight: 94.3, maxWeight: 100.5, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Super Heavy Weight Division' },
  { divisionId: 'ADULT_MALE_ULTRA_HEAVY', name: 'Ultra Heavy', minWeight: 100.5, maxWeight: 999, gender: 'male', ageGroup: 'adult', active: true, description: 'Adult Male Ultra Heavy Weight Division' },

  // Adult Female Divisions
  { divisionId: 'ADULT_FEMALE_ROOSTER', name: 'Rooster', minWeight: 0, maxWeight: 48.5, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Rooster Weight Division' },
  { divisionId: 'ADULT_FEMALE_LIGHT_FEATHER', name: 'Light Feather', minWeight: 48.5, maxWeight: 53.5, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Light Feather Weight Division' },
  { divisionId: 'ADULT_FEMALE_FEATHER', name: 'Feather', minWeight: 53.5, maxWeight: 58.5, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Feather Weight Division' },
  { divisionId: 'ADULT_FEMALE_LIGHT', name: 'Light', minWeight: 58.5, maxWeight: 64, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Light Weight Division' },
  { divisionId: 'ADULT_FEMALE_MIDDLE', name: 'Middle', minWeight: 64, maxWeight: 69, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Middle Weight Division' },
  { divisionId: 'ADULT_FEMALE_MIDDLE_HEAVY', name: 'Middle Heavy', minWeight: 69, maxWeight: 74, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Middle Heavy Weight Division' },
  { divisionId: 'ADULT_FEMALE_HEAVY', name: 'Heavy', minWeight: 74, maxWeight: 79.3, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Heavy Weight Division' },
  { divisionId: 'ADULT_FEMALE_SUPER_HEAVY', name: 'Super Heavy', minWeight: 79.3, maxWeight: 999, gender: 'female', ageGroup: 'adult', active: true, description: 'Adult Female Super Heavy Weight Division' },

  // Kids Male Divisions (simplified)
  { divisionId: 'KIDS_MALE_LIGHT', name: 'Light', minWeight: 0, maxWeight: 30, gender: 'male', ageGroup: 'kids', active: true, description: 'Kids Male Light Weight Division' },
  { divisionId: 'KIDS_MALE_MIDDLE', name: 'Middle', minWeight: 30, maxWeight: 40, gender: 'male', ageGroup: 'kids', active: true, description: 'Kids Male Middle Weight Division' },
  { divisionId: 'KIDS_MALE_HEAVY', name: 'Heavy', minWeight: 40, maxWeight: 999, gender: 'male', ageGroup: 'kids', active: true, description: 'Kids Male Heavy Weight Division' },

  // Kids Female Divisions (simplified)
  { divisionId: 'KIDS_FEMALE_LIGHT', name: 'Light', minWeight: 0, maxWeight: 30, gender: 'female', ageGroup: 'kids', active: true, description: 'Kids Female Light Weight Division' },
  { divisionId: 'KIDS_FEMALE_MIDDLE', name: 'Middle', minWeight: 30, maxWeight: 40, gender: 'female', ageGroup: 'kids', active: true, description: 'Kids Female Middle Weight Division' },
  { divisionId: 'KIDS_FEMALE_HEAVY', name: 'Heavy', minWeight: 40, maxWeight: 999, gender: 'female', ageGroup: 'kids', active: true, description: 'Kids Female Heavy Weight Division' }
]

export const WeightDivisionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tenant } = useAuth()
  
  // Load weight divisions from localStorage or use default data
  const loadWeightDivisionsFromStorage = (): WeightDivision[] => {
    return getTenantData<WeightDivision[]>('jiu-jitsu-weight-divisions', tenant?.id || null, defaultWeightDivisions)
  }

  const [weightDivisions, setWeightDivisions] = useState<WeightDivision[]>(loadWeightDivisionsFromStorage)

  // Reload weight divisions when tenant changes
  useEffect(() => {
    const newWeightDivisions = loadWeightDivisionsFromStorage()
    setWeightDivisions(newWeightDivisions)
  }, [tenant?.id])

  // Save weight divisions to localStorage
  const saveWeightDivisionsToStorage = (divisionsToSave: WeightDivision[]) => {
    saveTenantData('jiu-jitsu-weight-divisions', tenant?.id || null, divisionsToSave)
  }

  // Update localStorage whenever weightDivisions changes
  React.useEffect(() => {
    saveWeightDivisionsToStorage(weightDivisions)
  }, [weightDivisions])

  const addWeightDivision = (weightDivision: WeightDivision) => {
    setWeightDivisions(prev => [...prev, weightDivision])
  }

  const updateWeightDivision = (divisionId: string, updatedWeightDivision: WeightDivision) => {
    setWeightDivisions(prev => 
      prev.map(division => 
        division.divisionId === divisionId ? updatedWeightDivision : division
      )
    )
  }

  const deleteWeightDivision = (divisionId: string) => {
    setWeightDivisions(prev => prev.filter(division => division.divisionId !== divisionId))
  }

  const getWeightDivision = (divisionId: string) => {
    return weightDivisions.find(division => division.divisionId === divisionId)
  }

  const getWeightDivisionByWeight = (weight: number, gender: 'male' | 'female' | 'other', isKidsStudent: boolean) => {
    const ageGroup = isKidsStudent ? 'kids' : 'adult'
    const genderFilter = gender === 'other' ? 'both' : gender
    
    return weightDivisions.find(division => 
      division.active &&
      weight >= division.minWeight && 
      weight < division.maxWeight &&
      (division.gender === genderFilter || division.gender === 'both') &&
      (division.ageGroup === ageGroup || division.ageGroup === 'both')
    )
  }

  const clearAllWeightDivisions = () => {
    setWeightDivisions([])
  }

  const value: WeightDivisionContextType = {
    weightDivisions,
    addWeightDivision,
    updateWeightDivision,
    deleteWeightDivision,
    getWeightDivision,
    getWeightDivisionByWeight,
    clearAllWeightDivisions
  }

  return (
    <WeightDivisionContext.Provider value={value}>
      {children}
    </WeightDivisionContext.Provider>
  )
}

export const useWeightDivisions = () => {
  const context = useContext(WeightDivisionContext)
  if (context === undefined) {
    throw new Error('useWeightDivisions must be used within a WeightDivisionProvider')
  }
  return context
}




