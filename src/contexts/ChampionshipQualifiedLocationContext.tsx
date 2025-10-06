import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [qualifiedLocations, setQualifiedLocations] = useState<ChampionshipQualifiedLocation[]>([])

  // Load qualified locations from localStorage on mount
  useEffect(() => {
    const savedLocations = localStorage.getItem('championshipQualifiedLocations')
    if (savedLocations) {
      try {
        setQualifiedLocations(JSON.parse(savedLocations))
      } catch (error) {
        console.error('Error loading qualified locations from localStorage:', error)
      }
    } else {
      // Initialize with sample data
      const sampleLocations: ChampionshipQualifiedLocation[] = [
        {
          locationId: 'QL001',
          name: 'Rio de Janeiro Convention Center',
          address: 'Av. Salvador Allende, 6555',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'Brazil',
          postalCode: '22783-127',
          capacity: 5000,
          facilities: ['Main Arena', 'Warm-up Areas', 'Medical Station', 'Parking', 'Food Court'],
          contactPerson: 'João Silva',
          contactEmail: 'joao.silva@rjcc.com.br',
          contactPhone: '+55 21 99999-9999',
          isActive: true,
          certificationLevel: 'premium',
          certificationDate: '2024-01-15',
          certificationExpiry: '2025-01-15',
          notes: 'Premium venue with full championship facilities',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          locationId: 'QL002',
          name: 'Abu Dhabi National Exhibition Centre',
          address: 'Al Khaleej Al Arabi Street',
          city: 'Abu Dhabi',
          state: 'Abu Dhabi',
          country: 'UAE',
          postalCode: '00000',
          capacity: 8000,
          facilities: ['Main Arena', 'Training Areas', 'Medical Center', 'VIP Lounge', 'Media Center'],
          contactPerson: 'Ahmed Al-Rashid',
          contactEmail: 'ahmed.rashid@adnec.ae',
          contactPhone: '+971 50 123 4567',
          isActive: true,
          certificationLevel: 'premium',
          certificationDate: '2024-02-01',
          certificationExpiry: '2025-02-01',
          notes: 'World-class facility for international championships',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          locationId: 'QL003',
          name: 'Los Angeles Convention Center',
          address: '1201 S Figueroa St',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          postalCode: '90015',
          capacity: 3000,
          facilities: ['Main Hall', 'Warm-up Rooms', 'First Aid', 'Parking'],
          contactPerson: 'Maria Rodriguez',
          contactEmail: 'maria.rodriguez@lacc.com',
          contactPhone: '+1 213 741-1151',
          isActive: true,
          certificationLevel: 'advanced',
          certificationDate: '2024-01-20',
          certificationExpiry: '2025-01-20',
          notes: 'Excellent facility for regional championships',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setQualifiedLocations(sampleLocations)
    }
  }, [])

  // Save qualified locations to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('championshipQualifiedLocations', JSON.stringify(qualifiedLocations))
  }, [qualifiedLocations])

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
