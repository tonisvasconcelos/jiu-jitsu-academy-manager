import React, { createContext, useContext, ReactNode } from 'react'
import { useMasterData } from '../hooks/useMasterData'

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
  const {
    data: branches,
    isLoading,
    error,
    addItem: addBranch,
    updateItem: updateBranch,
    deleteItem: deleteBranch,
    refreshData: refreshBranches,
    clearError
  } = useMasterData<Branch>({
    dataType: 'branches',
    initialData: []
  })

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