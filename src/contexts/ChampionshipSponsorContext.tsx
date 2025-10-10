import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface ChampionshipSponsor {
  sponsorId: string
  name: string
  logo?: string
  link?: string
  description?: string
  championshipId?: string
  sponsorType: 'title' | 'gold' | 'silver' | 'bronze' | 'supporting'
  contactEmail?: string
  contactPhone?: string
  contributionAmount?: number
  status: 'active' | 'inactive'
  startDate?: string
  endDate?: string
}

interface ChampionshipSponsorContextType {
  sponsors: ChampionshipSponsor[]
  addSponsor: (sponsor: Omit<ChampionshipSponsor, 'sponsorId'>) => void
  updateSponsor: (id: string, sponsor: Partial<ChampionshipSponsor>) => void
  deleteSponsor: (id: string) => void
  getSponsor: (id: string) => ChampionshipSponsor | undefined
  getSponsorsByChampionship: (championshipId: string) => ChampionshipSponsor[]
  getSponsorsByType: (type: string) => ChampionshipSponsor[]
}

const ChampionshipSponsorContext = createContext<ChampionshipSponsorContextType | undefined>(undefined)

export const useChampionshipSponsors = () => {
  const context = useContext(ChampionshipSponsorContext)
  if (!context) {
    throw new Error('useChampionshipSponsors must be used within a ChampionshipSponsorProvider')
  }
  return context
}

export const ChampionshipSponsorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sponsors, setSponsors] = useTenantData<ChampionshipSponsor[]>('championshipSponsors', [])

  const addSponsor = (sponsor: Omit<ChampionshipSponsor, 'sponsorId'>) => {
    const newSponsor: ChampionshipSponsor = {
      ...sponsor,
      sponsorId: `SPO${Date.now().toString().slice(-6)}`
    }
    setSponsors(prev => [...prev, newSponsor])
  }

  const updateSponsor = (id: string, updatedSponsor: Partial<ChampionshipSponsor>) => {
    setSponsors(prev => 
      prev.map(sponsor => 
        sponsor.sponsorId === id 
          ? { ...sponsor, ...updatedSponsor }
          : sponsor
      )
    )
  }

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(sponsor => sponsor.sponsorId !== id))
  }

  const getSponsor = (id: string) => {
    return sponsors.find(sponsor => sponsor.sponsorId === id)
  }

  const getSponsorsByChampionship = (championshipId: string) => {
    return sponsors.filter(sponsor => sponsor.championshipId === championshipId)
  }

  const getSponsorsByType = (type: string) => {
    return sponsors.filter(sponsor => sponsor.sponsorType === type)
  }

  const value: ChampionshipSponsorContextType = {
    sponsors,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    getSponsor,
    getSponsorsByChampionship,
    getSponsorsByType
  }

  return (
    <ChampionshipSponsorContext.Provider value={value}>
      {children}
    </ChampionshipSponsorContext.Provider>
  )
}
