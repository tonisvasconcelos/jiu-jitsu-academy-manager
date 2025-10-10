import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface ChampionshipQualifiedLocation {
  locationId: string
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode?: string
  capacity: number
  facilities: string[]
  contactPerson: string
  contactEmail: string
  contactPhone: string
  imageUrl?: string
  isActive: boolean
  certificationLevel: 'basic' | 'intermediate' | 'advanced' | 'premium'
  certificationDate: string
  certificationExpiry: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ChampionshipQualifiedLocationContextType {
  qualifiedLocations: ChampionshipQualifiedLocation[]
  addQualifiedLocation: (location: Omit<ChampionshipQualifiedLocation, 'locationId' | 'createdAt' | 'updatedAt'>) => void
  updateQualifiedLocation: (id: string, location: Partial<ChampionshipQualifiedLocation>) => void
  deleteQualifiedLocation: (id: string) => void
  getQualifiedLocation: (id: string) => ChampionshipQualifiedLocation | undefined
  getQualifiedLocationsByCountry: (country: string) => ChampionshipQualifiedLocation[]
  getQualifiedLocationsByCertificationLevel: (level: string) => ChampionshipQualifiedLocation[]
}

const ChampionshipQualifiedLocationContext = createContext<ChampionshipQualifiedLocationContextType | undefined>(undefined)

export const useChampionshipQualifiedLocations = () => {
  const context = useContext(ChampionshipQualifiedLocationContext)
  if (!context) {
    throw new Error('useChampionshipQualifiedLocations must be used within a ChampionshipQualifiedLocationProvider')
  }
  return context
}

export const ChampionshipQualifiedLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qualifiedLocations = useTenantData<ChampionshipQualifiedLocation>('championshipQualifiedLocations') // tenantId comes from AuthContext

  const addQualifiedLocation = (location: Omit<ChampionshipQualifiedLocation, 'locationId' | 'createdAt' | 'updatedAt'>) => {
    const newLocation: ChampionshipQualifiedLocation = {
      ...location,
      locationId: `QL${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setQualifiedLocations(prev => [...prev, newLocation])
  }

  const updateQualifiedLocation = (id: string, updatedLocation: Partial<ChampionshipQualifiedLocation>) => {
    setQualifiedLocations(prev => 
      prev.map(location => 
        location.locationId === id 
          ? { ...location, ...updatedLocation, updatedAt: new Date().toISOString() }
          : location
      )
    )
  }

  const deleteQualifiedLocation = (id: string) => {
    setQualifiedLocations(prev => prev.filter(location => location.locationId !== id))
  }

  const getQualifiedLocation = (id: string) => {
    return qualifiedLocations.find(location => location.locationId === id)
  }

  const getQualifiedLocationsByCountry = (country: string) => {
    return qualifiedLocations.filter(location => location.country === country)
  }

  const getQualifiedLocationsByCertificationLevel = (level: string) => {
    return qualifiedLocations.filter(location => location.certificationLevel === level)
  }

  const value: ChampionshipQualifiedLocationContextType = {
    qualifiedLocations,
    addQualifiedLocation,
    updateQualifiedLocation,
    deleteQualifiedLocation,
    getQualifiedLocation,
    getQualifiedLocationsByCountry,
    getQualifiedLocationsByCertificationLevel
  }

  return (
    <ChampionshipQualifiedLocationContext.Provider value={value}>
      {children}
    </ChampionshipQualifiedLocationContext.Provider>
  )
}
