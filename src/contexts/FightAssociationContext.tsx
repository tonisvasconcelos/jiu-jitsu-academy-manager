import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface FightAssociation {
  associationId: string
  name: string
  acronym: string
  type: 'international' | 'national' | 'regional' | 'affiliate_network'
  fightModalities: string[] // References fight modality IDs (multiple)
  country?: string
  region?: string
  website?: string
  description?: string
  establishedYear?: number
  headquarters?: string
  contactEmail?: string
  contactPhone?: string
  active: boolean
  isMainAssociation: boolean // For primary associations like IBJJF
}

interface FightAssociationContextType {
  fightAssociations: FightAssociation[]
  addFightAssociation: (association: FightAssociation) => void
  updateFightAssociation: (associationId: string, updatedAssociation: FightAssociation) => void
  deleteFightAssociation: (associationId: string) => void
  getFightAssociation: (associationId: string) => FightAssociation | undefined
  getAssociationsByModality: (modalityId: string) => FightAssociation[]
  clearAllFightAssociations: () => void
}

const FightAssociationContext = createContext<FightAssociationContextType | undefined>(undefined)

// Default fight associations based on the provided information
const defaultFightAssociations: FightAssociation[] = [
  // International Associations
  {
    associationId: 'IBJJF',
    name: 'International Brazilian Jiu-Jitsu Federation',
    acronym: 'IBJJF',
    type: 'international',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Brazil',
    website: 'https://ibjjf.com',
    description: 'The most influential organization, establishes the global standard for belt rankings, competition rules, and major tournaments like the World Jiu-Jitsu Championship.',
    establishedYear: 1994,
    headquarters: 'Rio de Janeiro, Brazil',
    contactEmail: 'info@ibjjf.com',
    active: true,
    isMainAssociation: true
  },
  {
    associationId: 'ADCC',
    name: 'Abu Dhabi Combat Club',
    acronym: 'ADCC',
    type: 'international',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'UAE',
    website: 'https://adcombatclub.com',
    description: 'Known for its prestigious grappling tournament, the ADCC World Submission Fighting Championship, which differs from IBJJF-style competitions.',
    establishedYear: 1998,
    headquarters: 'Abu Dhabi, UAE',
    contactEmail: 'info@adcombatclub.com',
    active: true,
    isMainAssociation: true
  },
  {
    associationId: 'UAEJJF',
    name: 'United Arab Emirates Jiu-Jitsu Federation',
    acronym: 'UAEJJF',
    type: 'international',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'UAE',
    website: 'https://uaejjf.com',
    description: 'A prominent federation, particularly in the Middle East, that promotes jiu-jitsu and hosts major events.',
    establishedYear: 2012,
    headquarters: 'Abu Dhabi, UAE',
    contactEmail: 'info@uaejjf.com',
    active: true,
    isMainAssociation: false
  },

  // Affiliate Networks
  {
    associationId: 'GRACIE_BARRA',
    name: 'Gracie Barra',
    acronym: 'GB',
    type: 'affiliate_network',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Brazil',
    website: 'https://graciebarra.com',
    description: 'A large and well-known affiliate network with hundreds of schools worldwide, led by Carlos Gracie Jr., who founded the IBJJF.',
    establishedYear: 1986,
    headquarters: 'Rio de Janeiro, Brazil',
    contactEmail: 'info@graciebarra.com',
    active: true,
    isMainAssociation: false
  },
  {
    associationId: 'BJJ_GLOBETROTTERS',
    name: 'BJJ Globetrotters',
    acronym: 'BJJGT',
    type: 'affiliate_network',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Denmark',
    website: 'https://bjjglobetrotters.com',
    description: 'One of the largest affiliations, focused on community and training opportunities worldwide.',
    establishedYear: 2013,
    headquarters: 'Copenhagen, Denmark',
    contactEmail: 'info@bjjglobetrotters.com',
    active: true,
    isMainAssociation: false
  },

  // National Federations
  {
    associationId: 'CBJJ',
    name: 'Confederação Brasileira de Jiu-Jitsu',
    acronym: 'CBJJ',
    type: 'national',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Brazil',
    website: 'https://cbjj.com.br',
    description: 'The sister organization to the IBJJF in Brazil, setting the rules for the sport in Brazil.',
    establishedYear: 1994,
    headquarters: 'Rio de Janeiro, Brazil',
    contactEmail: 'info@cbjj.com.br',
    active: true,
    isMainAssociation: false
  },
  {
    associationId: 'FPJJ',
    name: 'Federação Paulista de Jiu Jitsu',
    acronym: 'FPJJ',
    type: 'regional',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Brazil',
    region: 'São Paulo',
    website: 'https://fpjj.com.br',
    description: 'State federation for São Paulo, Brazil.',
    establishedYear: 1995,
    headquarters: 'São Paulo, Brazil',
    contactEmail: 'info@fpjj.com.br',
    active: true,
    isMainAssociation: false
  },
  {
    associationId: 'CFJJB',
    name: 'Confédération Française de Jiu-Jitsu Brésilien',
    acronym: 'CFJJB',
    type: 'national',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'France',
    website: 'https://cfjjb.fr',
    description: 'National federation for Brazilian Jiu-Jitsu in France.',
    establishedYear: 2000,
    headquarters: 'Paris, France',
    contactEmail: 'info@cfjjb.fr',
    active: true,
    isMainAssociation: false
  },
  {
    associationId: 'UFBJJ',
    name: 'Ukrainian Federation Brazilian Jiu Jitsu',
    acronym: 'UFBJJ',
    type: 'national',
    fightModalities: ['MOD001'], // Brazilian Jiu-Jitsu
    country: 'Ukraine',
    website: 'https://ufbjj.org',
    description: 'National federation for Brazilian Jiu-Jitsu in Ukraine.',
    establishedYear: 2005,
    headquarters: 'Kyiv, Ukraine',
    contactEmail: 'info@ufbjj.org',
    active: true,
    isMainAssociation: false
  },

  // Boxing Associations
  {
    associationId: 'WBC',
    name: 'World Boxing Council',
    acronym: 'WBC',
    type: 'international',
    fightModalities: ['MOD002'], // Boxing
    country: 'Mexico',
    website: 'https://wbcboxing.com',
    description: 'One of the major international boxing organizations.',
    establishedYear: 1963,
    headquarters: 'Mexico City, Mexico',
    contactEmail: 'info@wbcboxing.com',
    active: true,
    isMainAssociation: true
  },
  {
    associationId: 'WBA',
    name: 'World Boxing Association',
    acronym: 'WBA',
    type: 'international',
    fightModalities: ['MOD002'], // Boxing
    country: 'Panama',
    website: 'https://wbaboxing.com',
    description: 'The oldest of the four major international boxing organizations.',
    establishedYear: 1921,
    headquarters: 'Panama City, Panama',
    contactEmail: 'info@wbaboxing.com',
    active: true,
    isMainAssociation: true
  },

  // Judo Associations
  {
    associationId: 'IJF',
    name: 'International Judo Federation',
    acronym: 'IJF',
    type: 'international',
    fightModalities: ['MOD005'], // Judo (assuming we'll add this)
    country: 'Switzerland',
    website: 'https://ijf.org',
    description: 'The international governing body for judo.',
    establishedYear: 1951,
    headquarters: 'Lausanne, Switzerland',
    contactEmail: 'info@ijf.org',
    active: true,
    isMainAssociation: true
  }
]

export const FightAssociationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fightAssociations, setFightAssociations] = useTenantData<FightAssociation[]>('jiu-jitsu-fight-associations', defaultFightAssociations)

  const addFightAssociation = (association: FightAssociation) => {
    setFightAssociations(prev => [...prev, association])
  }

  const updateFightAssociation = (associationId: string, updatedAssociation: FightAssociation) => {
    setFightAssociations(prev => 
      prev.map(association => 
        association.associationId === associationId ? updatedAssociation : association
      )
    )
  }

  const deleteFightAssociation = (associationId: string) => {
    setFightAssociations(prev => prev.filter(association => association.associationId !== associationId))
  }

  const getFightAssociation = (associationId: string) => {
    return (fightAssociations || []).find(association => association.associationId === associationId)
  }

  const getAssociationsByModality = (modalityId: string) => {
    return (fightAssociations || []).filter(association => 
      association.active && association.fightModalities.includes(modalityId)
    )
  }

  const clearAllFightAssociations = () => {
    setFightAssociations([])
  }

  const value: FightAssociationContextType = {
    fightAssociations,
    addFightAssociation,
    updateFightAssociation,
    deleteFightAssociation,
    getFightAssociation,
    getAssociationsByModality,
    clearAllFightAssociations
  }

  return (
    <FightAssociationContext.Provider value={value}>
      {children}
    </FightAssociationContext.Provider>
  )
}

export const useFightAssociations = () => {
  const context = useContext(FightAssociationContext)
  if (context === undefined) {
    throw new Error('useFightAssociations must be used within a FightAssociationProvider')
  }
  return context
}
