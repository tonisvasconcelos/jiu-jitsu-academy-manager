import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

export interface Affiliation {
  affiliationId: string
  studentId: string
  associationId: string
  affiliationDate: string
  status: 'active' | 'inactive' | 'suspended'
  membershipNumber?: string
  notes?: string
}

interface AffiliationContextType {
  affiliations: Affiliation[]
  addAffiliation: (affiliation: Omit<Affiliation, 'affiliationId'>) => void
  updateAffiliation: (id: string, affiliation: Partial<Affiliation>) => void
  deleteAffiliation: (id: string) => void
  getAffiliation: (id: string) => Affiliation | undefined
  getAffiliationsByStudent: (studentId: string) => Affiliation[]
  getAffiliationsByAssociation: (associationId: string) => Affiliation[]
}

const AffiliationContext = createContext<AffiliationContextType | undefined>(undefined)

export const useAffiliations = () => {
  const context = useContext(AffiliationContext)
  if (!context) {
    throw new Error('useAffiliations must be used within an AffiliationProvider')
  }
  return context
}

export const AffiliationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useAuth()
  const [affiliations, setAffiliations] = useState<Affiliation[]>([])

  // Load affiliations from localStorage on mount
  useEffect(() => {
    const savedAffiliations = getTenantData<Affiliation[]>('affiliations', tenant?.id || null, [])
    setAffiliations(savedAffiliations)
  }, [tenant?.id])

  // Save affiliations to localStorage whenever affiliations change
  useEffect(() => {
    saveTenantData('affiliations', tenant?.id || null, affiliations)
  }, [affiliations, tenant?.id])

  const addAffiliation = (affiliation: Omit<Affiliation, 'affiliationId'>) => {
    const newAffiliation: Affiliation = {
      ...affiliation,
      affiliationId: `AFF${Date.now().toString().slice(-6)}`
    }
    setAffiliations(prev => [...prev, newAffiliation])
  }

  const updateAffiliation = (id: string, updatedAffiliation: Partial<Affiliation>) => {
    setAffiliations(prev => 
      prev.map(affiliation => 
        affiliation.affiliationId === id 
          ? { ...affiliation, ...updatedAffiliation }
          : affiliation
      )
    )
  }

  const deleteAffiliation = (id: string) => {
    setAffiliations(prev => prev.filter(affiliation => affiliation.affiliationId !== id))
  }

  const getAffiliation = (id: string) => {
    return affiliations.find(affiliation => affiliation.affiliationId === id)
  }

  const getAffiliationsByStudent = (studentId: string) => {
    return affiliations.filter(affiliation => affiliation.studentId === studentId)
  }

  const getAffiliationsByAssociation = (associationId: string) => {
    return affiliations.filter(affiliation => affiliation.associationId === associationId)
  }

  const value: AffiliationContextType = {
    affiliations,
    addAffiliation,
    updateAffiliation,
    deleteAffiliation,
    getAffiliation,
    getAffiliationsByStudent,
    getAffiliationsByAssociation
  }

  return (
    <AffiliationContext.Provider value={value}>
      {children}
    </AffiliationContext.Provider>
  )
}
