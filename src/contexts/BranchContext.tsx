import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTenantData } from '../hooks/useTenantData'

export interface Branch {
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  managerId: string
  active: boolean
  capacity: number
  facilities: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  // API fields
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

interface BranchContextType {
  branches: Branch[]
  isLoading: boolean
  error: string | null
  addBranch: (branch: Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBranch: (branchId: string, updatedBranch: Partial<Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteBranch: (branchId: string) => Promise<void>
  getBranch: (branchId: string) => Branch | undefined
  refreshBranches: () => Promise<void>
  clearError: () => void
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tenant } = useAuth()
  const branches = useTenantData<Branch>('branches', tenant?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const addBranch = async (branch: Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    console.log('BranchProvider: addBranch called with', branch);
  }
  
  const updateBranch = async (branchId: string, updatedBranch: Partial<Omit<Branch, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>) => {
    console.log('BranchProvider: updateBranch called with', branchId, updatedBranch);
  }
  
  const deleteBranch = async (branchId: string) => {
    console.log('BranchProvider: deleteBranch called with', branchId);
  }
  
  const refreshBranches = async () => {
    console.log('BranchProvider: refreshBranches called');
  }
  
  const clearError = () => {
    setError(null);
  }

  // Helper function to get branch by id
  const getBranch = (branchId: string): Branch | undefined => {
    return branches.find(branch => branch.id === branchId)
  }

  const contextValue: BranchContextType = {
    branches,
    isLoading,
    error,
    addBranch,
    updateBranch,
    deleteBranch,
    getBranch,
    refreshBranches,
    clearError
  }

  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  )
}

export const useBranches = (): BranchContextType => {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider')
  }
  return context
}