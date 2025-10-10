import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface ChampionshipResult {
  resultId: string
  registrationId: string
  position: '1st' | '2nd' | '3rd' | '4th' | '5th' | 'participation'
  points: number
  medalType: 'gold' | 'silver' | 'bronze' | 'none'
  comments?: string
  studentId: string
  championshipId: string
  categoryId: string
  resultDate: string
  fightTime?: string
  submissionType?: string
  refereeNotes?: string
}

interface ChampionshipResultContextType {
  results: ChampionshipResult[]
  addResult: (result: Omit<ChampionshipResult, 'resultId'>) => void
  updateResult: (id: string, result: Partial<ChampionshipResult>) => void
  deleteResult: (id: string) => void
  getResult: (id: string) => ChampionshipResult | undefined
  getResultsByStudent: (studentId: string) => ChampionshipResult[]
  getResultsByChampionship: (championshipId: string) => ChampionshipResult[]
  getResultsByCategory: (categoryId: string) => ChampionshipResult[]
  getResultsByRegistration: (registrationId: string) => ChampionshipResult[]
}

const ChampionshipResultContext = createContext<ChampionshipResultContextType | undefined>(undefined)

export const useChampionshipResults = () => {
  const context = useContext(ChampionshipResultContext)
  if (!context) {
    throw new Error('useChampionshipResults must be used within a ChampionshipResultProvider')
  }
  return context
}

export const ChampionshipResultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [results, setResults] = useTenantData<ChampionshipResult[]>('championshipResults', [])

  const addResult = (result: Omit<ChampionshipResult, 'resultId'>) => {
    const newResult: ChampionshipResult = {
      ...result,
      resultId: `RES${Date.now().toString().slice(-6)}`
    }
    setResults(prev => [...prev, newResult])
  }

  const updateResult = (id: string, updatedResult: Partial<ChampionshipResult>) => {
    setResults(prev => 
      prev.map(result => 
        result.resultId === id 
          ? { ...result, ...updatedResult }
          : result
      )
    )
  }

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(result => result.resultId !== id))
  }

  const getResult = (id: string) => {
    return results.find(result => result.resultId === id)
  }

  const getResultsByStudent = (studentId: string) => {
    return results.filter(result => result.studentId === studentId)
  }

  const getResultsByChampionship = (championshipId: string) => {
    return results.filter(result => result.championshipId === championshipId)
  }

  const getResultsByCategory = (categoryId: string) => {
    return results.filter(result => result.categoryId === categoryId)
  }

  const getResultsByRegistration = (registrationId: string) => {
    return results.filter(result => result.registrationId === registrationId)
  }

  const value: ChampionshipResultContextType = {
    results,
    addResult,
    updateResult,
    deleteResult,
    getResult,
    getResultsByStudent,
    getResultsByChampionship,
    getResultsByCategory,
    getResultsByRegistration
  }

  return (
    <ChampionshipResultContext.Provider value={value}>
      {children}
    </ChampionshipResultContext.Provider>
  )
}
