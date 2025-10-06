import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Branch } from '../contexts/BranchContext'
import 'leaflet/dist/leaflet.css'

interface BranchMapProps {
  branches: Branch[]
}

interface BranchLocation {
  branch: Branch
  lat: number
  lng: number
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${isActive ? '#10B981' : '#EF4444'};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">🏢</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

const BranchMap: React.FC<BranchMapProps> = ({ branches }) => {
  const [branchLocations, setBranchLocations] = useState<BranchLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Geocoding function using OpenStreetMap Nominatim (free)
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
      }
      return null
    } catch (error) {
      console.warn('Geocoding failed for address:', address, error)
      return null
    }
  }

  useEffect(() => {
    const loadBranchLocations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (branches.length === 0) {
          setIsLoading(false)
          return
        }

        const locations: BranchLocation[] = []
        
        // Geocode each branch address
        for (const branch of branches) {
          const fullAddress = `${branch.address}, ${branch.city}, ${branch.state}, ${branch.country}`
          const coords = await geocodeAddress(fullAddress)
          
          if (coords) {
            locations.push({
              branch,
              lat: coords.lat,
              lng: coords.lng
            })
          } else {
            // Fallback to approximate coordinates for Brazil
            locations.push({
              branch,
              lat: -22.9068 + (Math.random() - 0.5) * 0.1, // Rio de Janeiro area
              lng: -43.1729 + (Math.random() - 0.5) * 0.1
            })
          }
        }

        setBranchLocations(locations)
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading branch locations:', err)
        setError('Failed to load branch locations')
        setIsLoading(false)
      }
    }

    loadBranchLocations()
  }, [branches])

  if (error) {
    return (
      <div className="w-full h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-red-400 mb-2">Map Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden relative">
      <MapContainer
        center={[-22.9068, -43.1729]} // Rio de Janeiro, Brazil
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Branch markers */}
        {branchLocations.map((location) => (
          <Marker
            key={location.branch.branchId}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.branch.active)}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-semibold text-gray-800 mb-2">{location.branch.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>📍 Address:</strong> {location.branch.address}, {location.branch.city}</p>
                  <p><strong>👤 Manager:</strong> {location.branch.managerName}</p>
                  <p><strong>📧 Email:</strong> {location.branch.managerEmail}</p>
                  <p><strong>📞 Phone:</strong> {location.branch.managerPhone}</p>
                  <p><strong>👥 Capacity:</strong> {location.branch.capacity} students</p>
                  <p><strong>🏢 Facilities:</strong> {location.branch.facilities.join(', ')}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      location.branch.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.branch.active ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="text-sm font-medium text-gray-800 mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-700">Active Branch</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-xs text-gray-700">Inactive Branch</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchMap
