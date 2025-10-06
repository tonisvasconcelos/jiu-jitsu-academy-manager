import React, { createContext, useState, useContext, ReactNode } from 'react'

export interface Branch {
  branchId: string
  name: string
  address: string
  city: string
  state: string
  country: string
  countryCode: string
  postalCode: string
  phone: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  workingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  facilities: string[]
  capacity: number
  active: boolean
  establishedDate: string
  managerName: string
  managerPhone: string
  managerEmail: string
  notes?: string
}

interface BranchContextType {
  branches: Branch[]
  addBranch: (branch: Branch) => void
  updateBranch: (branchId: string, updatedBranch: Branch) => void
  deleteBranch: (branchId: string) => void
  getBranch: (branchId: string) => Branch | undefined
  clearAllBranches: () => void
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

// Sample initial data
const initialBranches: Branch[] = [
  {
    branchId: 'BR001',
    name: 'Main Branch - São Paulo',
    address: 'Rua das Artes Marciais, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brazil',
    countryCode: 'BR',
    postalCode: '01234-567',
    phone: '+55 11 99999-9999',
    email: 'sao-paulo@academy.com',
    website: 'https://academy.com/sao-paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    workingHours: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '18:00', closed: false },
      sunday: { open: '08:00', close: '16:00', closed: false }
    },
    facilities: ['Mats', 'Weights', 'Shower', 'Parking', 'Locker Room'],
    capacity: 50,
    active: true,
    establishedDate: '2020-01-15',
    managerName: 'João Silva',
    managerPhone: '+55 11 88888-8888',
    managerEmail: 'joao.silva@academy.com',
    notes: 'Main training facility with full amenities'
  },
  {
    branchId: 'BR002',
    name: 'Branch - Rio de Janeiro',
    address: 'Avenida Copacabana, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brazil',
    countryCode: 'BR',
    postalCode: '22000-000',
    phone: '+55 21 77777-7777',
    email: 'rio@academy.com',
    website: 'https://academy.com/rio',
    latitude: -22.9068,
    longitude: -43.1729,
    workingHours: {
      monday: { open: '07:00', close: '21:00', closed: false },
      tuesday: { open: '07:00', close: '21:00', closed: false },
      wednesday: { open: '07:00', close: '21:00', closed: false },
      thursday: { open: '07:00', close: '21:00', closed: false },
      friday: { open: '07:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '15:00', closed: false }
    },
    facilities: ['Mats', 'Weights', 'Shower', 'Parking'],
    capacity: 30,
    active: true,
    establishedDate: '2021-03-20',
    managerName: 'Maria Santos',
    managerPhone: '+55 21 66666-6666',
    managerEmail: 'maria.santos@academy.com',
    notes: 'Beachside location with ocean view'
  }
]

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load branches from localStorage or use initial data
  const loadBranchesFromStorage = (): Branch[] => {
    try {
      const stored = localStorage.getItem('jiu-jitsu-branches')
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('BranchContext: Loaded branches from localStorage:', parsed)
        return parsed
      }
    } catch (error) {
      console.error('BranchContext: Error loading branches from localStorage:', error)
    }
    console.log('BranchContext: No saved data found, starting with initial branches data')
    return initialBranches
  }

  const [branches, setBranches] = useState<Branch[]>(loadBranchesFromStorage)

  // Save branches to localStorage
  const saveBranchesToStorage = (branchesToSave: Branch[]) => {
    try {
      localStorage.setItem('jiu-jitsu-branches', JSON.stringify(branchesToSave))
      console.log('BranchContext: Saved branches to localStorage:', branchesToSave)
    } catch (error) {
      console.error('BranchContext: Error saving branches to localStorage:', error)
    }
  }

  const addBranch = (branch: Branch) => {
    console.log('=== BRANCH CONTEXT: ADD BRANCH CALLED ===')
    console.log('BranchContext: Adding branch:', branch)
    setBranches(prev => {
      const newBranches = [...prev, branch]
      console.log('BranchContext: Previous branches count:', prev.length)
      console.log('BranchContext: New branches array:', newBranches)
      console.log('BranchContext: New branches count:', newBranches.length)
      saveBranchesToStorage(newBranches)
      console.log('BranchContext: Branches saved to localStorage')
      return newBranches
    })
  }

  const updateBranch = (branchId: string, updatedBranch: Branch) => {
    setBranches(prev => {
      const updatedBranches = prev.map(branch => 
        branch.branchId === branchId ? updatedBranch : branch
      )
      saveBranchesToStorage(updatedBranches)
      return updatedBranches
    })
  }

  const deleteBranch = (branchId: string) => {
    setBranches(prev => {
      const filteredBranches = prev.filter(branch => branch.branchId !== branchId)
      saveBranchesToStorage(filteredBranches)
      return filteredBranches
    })
  }

  const getBranch = (branchId: string) => {
    return branches.find(branch => branch.branchId === branchId)
  }

  const clearAllBranches = () => {
    setBranches([])
    saveBranchesToStorage([])
  }

  return (
    <BranchContext.Provider value={{
      branches,
      addBranch,
      updateBranch,
      deleteBranch,
      getBranch,
      clearAllBranches
    }}>
      {children}
    </BranchContext.Provider>
  )
}

export const useBranches = () => {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error('useBranches must be used within a BranchProvider')
  }
  return context
}

