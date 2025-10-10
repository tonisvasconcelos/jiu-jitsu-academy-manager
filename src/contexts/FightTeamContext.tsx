import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface FightTeam {
  teamId: string
  teamName: string
  description?: string
  countryCode: string
  fightModalities: string[] // Array of fight modality IDs
  establishedDate: string
  teamSize: number
  isActive: boolean
  achievements?: string[]
  teamMembers: string[] // Array of student IDs
  teamLogo?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface FightTeamContextType {
  fightTeams: FightTeam[]
  addFightTeam: (team: Omit<FightTeam, 'teamId' | 'createdAt' | 'updatedAt'>) => void
  updateFightTeam: (id: string, team: Partial<FightTeam>) => void
  deleteFightTeam: (id: string) => void
  getFightTeam: (id: string) => FightTeam | undefined
}

const FightTeamContext = createContext<FightTeamContextType | undefined>(undefined)

export const useFightTeams = () => {
  const context = useContext(FightTeamContext)
  if (!context) {
    throw new Error('useFightTeams must be used within a FightTeamProvider')
  }
  return context
}

export const FightTeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fightTeams = useTenantData<FightTeam>('fightTeams') // tenantId comes from AuthContext

  const addFightTeam = (team: Omit<FightTeam, 'teamId' | 'createdAt' | 'updatedAt'>) => {
    const newTeam: FightTeam = {
      ...team,
      teamId: `FT${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFightTeams(prev => [...prev, newTeam])
  }

  const updateFightTeam = (id: string, updatedTeam: Partial<FightTeam>) => {
    setFightTeams(prev => 
      prev.map(team => 
        team.teamId === id 
          ? { ...team, ...updatedTeam, updatedAt: new Date().toISOString() }
          : team
      )
    )
  }

  const deleteFightTeam = (id: string) => {
    setFightTeams(prev => prev.filter(team => team.teamId !== id))
  }

  const getFightTeam = (id: string) => {
    return fightTeams.find(team => team.teamId === id)
  }

  const value: FightTeamContextType = {
    fightTeams,
    addFightTeam,
    updateFightTeam,
    deleteFightTeam,
    getFightTeam
  }

  return (
    <FightTeamContext.Provider value={value}>
      {children}
    </FightTeamContext.Provider>
  )
}
