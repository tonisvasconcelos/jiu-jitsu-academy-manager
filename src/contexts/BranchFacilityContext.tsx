import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getTenantData, saveTenantData } from '../utils/tenantStorage'

export interface BranchFacility {
  facilityId: string
  facilityName: string
  facilityType: 'training-room' | 'tatami-dojo' | 'weights-room' | 'office' | 'reception' | 'locker-room' | 'parking' | 'other'
  capacity: number
  areaSize: number
  status: 'active' | 'inactive' | 'under-maintenance'
  branchId: string
  description?: string
  equipment?: string[]
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  notes?: string
}

interface BranchFacilityContextType {
  facilities: BranchFacility[]
  addFacility: (facility: BranchFacility) => void
  updateFacility: (facility: BranchFacility) => void
  deleteFacility: (facilityId: string) => void
  getFacility: (facilityId: string) => BranchFacility | undefined
  getFacilitiesByBranch: (branchId: string) => BranchFacility[]
  getActiveFacilities: () => BranchFacility[]
}

const BranchFacilityContext = createContext<BranchFacilityContextType | undefined>(undefined)

// Sample data
const initialFacilities: BranchFacility[] = [
  {
    facilityId: 'FAC001',
    facilityName: 'Main Training Hall',
    facilityType: 'training-room',
    capacity: 50,
    areaSize: 200.5,
    status: 'active',
    branchId: 'BR001',
    description: 'Main training area for classes and sparring',
    equipment: ['Mats', 'Mirrors', 'Sound System'],
    lastMaintenanceDate: '2024-01-15',
    nextMaintenanceDate: '2024-07-15',
    notes: 'Regular maintenance every 6 months'
  },
  {
    facilityId: 'FAC002',
    facilityName: 'BJJ Tatami',
    facilityType: 'tatami-dojo',
    capacity: 30,
    areaSize: 120.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Dedicated Brazilian Jiu-Jitsu training area',
    equipment: ['Tatami Mats', 'Grappling Dummies', 'Timer'],
    lastMaintenanceDate: '2024-02-01',
    nextMaintenanceDate: '2024-08-01',
    notes: 'High-quality tatami mats for BJJ training'
  },
  {
    facilityId: 'FAC003',
    facilityName: 'Weights Room',
    facilityType: 'weights-room',
    capacity: 15,
    areaSize: 80.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Strength and conditioning area',
    equipment: ['Dumbbells', 'Barbells', 'Bench Press', 'Squat Rack'],
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-07-20',
    notes: 'Well-equipped weights room for strength training'
  },
  {
    facilityId: 'FAC004',
    facilityName: 'Reception Area',
    facilityType: 'reception',
    capacity: 10,
    areaSize: 25.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Welcome area and customer service',
    equipment: ['Desk', 'Computer', 'Phone', 'Seating'],
    lastMaintenanceDate: '2024-01-10',
    nextMaintenanceDate: '2024-07-10',
    notes: 'First point of contact for students'
  },
  {
    facilityId: 'FAC005',
    facilityName: 'Locker Room A',
    facilityType: 'locker-room',
    capacity: 20,
    areaSize: 40.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Men\'s locker room with showers',
    equipment: ['Lockers', 'Showers', 'Benches', 'Mirrors'],
    lastMaintenanceDate: '2024-01-25',
    nextMaintenanceDate: '2024-07-25',
    notes: 'Clean and well-maintained facilities'
  },
  {
    facilityId: 'FAC006',
    facilityName: 'Parking Lot',
    facilityType: 'parking',
    capacity: 30,
    areaSize: 500.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Outdoor parking area for students and staff',
    equipment: ['Parking Spaces', 'Security Cameras'],
    lastMaintenanceDate: '2024-01-05',
    nextMaintenanceDate: '2024-07-05',
    notes: 'Well-lit and secure parking area'
  },
  {
    facilityId: 'FAC007',
    facilityName: 'Office Space',
    facilityType: 'office',
    capacity: 5,
    areaSize: 30.0,
    status: 'active',
    branchId: 'BR001',
    description: 'Administrative office for staff',
    equipment: ['Desk', 'Computer', 'Filing Cabinet', 'Printer'],
    lastMaintenanceDate: '2024-01-12',
    nextMaintenanceDate: '2024-07-12',
    notes: 'Private office for administrative work'
  },
  {
    facilityId: 'FAC008',
    facilityName: 'Kids Training Area',
    facilityType: 'training-room',
    capacity: 25,
    areaSize: 100.0,
    status: 'under-maintenance',
    branchId: 'BR002',
    description: 'Specialized area for children\'s classes',
    equipment: ['Soft Mats', 'Colorful Equipment', 'Safety Barriers'],
    lastMaintenanceDate: '2024-01-30',
    nextMaintenanceDate: '2024-02-15',
    notes: 'Currently under renovation for safety improvements'
  }
]

const loadFacilitiesFromStorage = (tenantId: string | null): BranchFacility[] => {
  return getTenantData<BranchFacility[]>('jiu-jitsu-branch-facilities', tenantId, initialFacilities)
}

const saveFacilitiesToStorage = (facilities: BranchFacility[], tenantId: string | null) => {
  saveTenantData('jiu-jitsu-branch-facilities', tenantId, facilities)
}

export const BranchFacilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tenant } = useAuth()
  const [facilities, setFacilities] = useState<BranchFacility[]>(loadFacilitiesFromStorage(tenant?.id || null))

  // Reload facilities when tenant changes
  useEffect(() => {
    const newFacilities = loadFacilitiesFromStorage(tenant?.id || null)
    setFacilities(newFacilities)
  }, [tenant?.id])

  const addFacility = (facility: BranchFacility) => {
    console.log('BranchFacilityContext: Adding facility:', facility)
    const newFacilities = [...facilities, facility]
    setFacilities(newFacilities)
    saveFacilitiesToStorage(newFacilities, tenant?.id || null)
  }

  const updateFacility = (facility: BranchFacility) => {
    console.log('BranchFacilityContext: Updating facility:', facility)
    const newFacilities = facilities.map(f => f.facilityId === facility.facilityId ? facility : f)
    setFacilities(newFacilities)
    saveFacilitiesToStorage(newFacilities, tenant?.id || null)
  }

  const deleteFacility = (facilityId: string) => {
    console.log('BranchFacilityContext: Deleting facility:', facilityId)
    const newFacilities = facilities.filter(f => f.facilityId !== facilityId)
    setFacilities(newFacilities)
    saveFacilitiesToStorage(newFacilities, tenant?.id || null)
  }

  const getFacility = (facilityId: string) => {
    return facilities.find(facility => facility.facilityId === facilityId)
  }

  const getFacilitiesByBranch = (branchId: string) => {
    return facilities.filter(facility => facility.branchId === branchId)
  }

  const getActiveFacilities = () => {
    return facilities.filter(facility => facility.status === 'active')
  }

  const value: BranchFacilityContextType = {
    facilities,
    addFacility,
    updateFacility,
    deleteFacility,
    getFacility,
    getFacilitiesByBranch,
    getActiveFacilities
  }

  return (
    <BranchFacilityContext.Provider value={value}>
      {children}
    </BranchFacilityContext.Provider>
  )
}

export const useBranchFacilities = () => {
  const context = useContext(BranchFacilityContext)
  if (context === undefined) {
    throw new Error('useBranchFacilities must be used within a BranchFacilityProvider')
  }
  return context
}




