import React, { useEffect, useRef, useState } from 'react'
import { Branch } from '../contexts/BranchContext'

interface BranchMapProps {
  branches: Branch[]
}

interface MapMarker {
  marker: google.maps.Marker
  infoWindow: google.maps.InfoWindow
  branch: Branch
}

const BranchMap: React.FC<BranchMapProps> = ({ branches }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<MapMarker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if we have a valid API key
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        const isDemoMode = !apiKey || apiKey.includes('AIzaSyBvOkBw3cJ4XqJ8H9vL2M3N4O5P6Q7R8S9T0')
        
        if (isDemoMode) {
          // Demo mode - show static map with branch locations
          setIsLoading(false)
          return
        }
        
        // Load Google Maps script if not already loaded
        if (!window.google || !window.google.maps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
            script.async = true
            script.defer = true
            script.onload = () => resolve()
            script.onerror = () => {
              console.warn('Failed to load Google Maps, falling back to demo mode')
              setIsLoading(false)
              setError('Demo Mode: Google Maps API key required for interactive map')
            }
            document.head.appendChild(script)
          })
        }

        if (mapRef.current && !mapInstance.current) {
          // Initialize map with default center (Rio de Janeiro, Brazil)
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: { lat: -22.9068, lng: -43.1729 },
            zoom: 10,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ weight: '2.00' }]
              },
              {
                featureType: 'all',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#9c9c9c' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text',
                stylers: [{ visibility: 'on' }]
              },
              {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{ color: '#f2f2f2' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'landscape.man_made',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'road',
                elementType: 'all',
                stylers: [{ saturation: -100 }, { lightness: 45 }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: [{ color: '#eeeeee' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#7b7b7b' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'all',
                stylers: [{ visibility: 'simplified' }]
              },
              {
                featureType: 'road.arterial',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{ color: '#c8d7d4' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#070707' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#ffffff' }]
              }
            ]
          })
        }

        // Clear existing markers
        markersRef.current.forEach(({ marker }) => marker.setMap(null))
        markersRef.current = []

        if (branches.length === 0) {
          setIsLoading(false)
          return
        }

        // Geocode addresses and add markers
        const geocoder = new google.maps.Geocoder()
        const bounds = new google.maps.LatLngBounds()
        let processedCount = 0

        branches.forEach((branch) => {
          const fullAddress = `${branch.address}, ${branch.city}, ${branch.state}, ${branch.country}`
          
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            processedCount++
            
            if (status === 'OK' && results && results[0] && mapInstance.current) {
              const position = results[0].geometry.location
              
              // Create custom marker icon
              const markerIcon = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: branch.active ? '#10B981' : '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
              }

              // Create marker
              const marker = new google.maps.Marker({
                map: mapInstance.current,
                position: position,
                title: branch.name,
                icon: markerIcon,
                animation: google.maps.Animation.DROP
              })

              // Create info window content
              const infoWindowContent = `
                <div style="color: #1F2937; font-family: system-ui, -apple-system, sans-serif; max-width: 300px;">
                  <div style="padding: 16px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">
                      ${branch.name}
                    </h3>
                    <div style="margin-bottom: 8px;">
                      <p style="margin: 0; font-size: 14px; color: #6B7280;">
                        📍 ${branch.address}<br>
                        ${branch.city}, ${branch.state}<br>
                        ${branch.country}
                      </p>
                    </div>
                    <div style="margin-bottom: 8px;">
                      <p style="margin: 0; font-size: 14px; color: #6B7280;">
                        👤 Manager: ${branch.managerName}<br>
                        📧 ${branch.managerEmail}<br>
                        📞 ${branch.managerPhone}
                      </p>
                    </div>
                    <div style="margin-bottom: 8px;">
                      <p style="margin: 0; font-size: 14px; color: #6B7280;">
                        👥 Capacity: ${branch.capacity} students<br>
                        🏢 Facilities: ${branch.facilities.join(', ')}
                      </p>
                    </div>
                    <div style="margin-top: 12px;">
                      <span style="
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        background-color: ${branch.active ? '#D1FAE5' : '#FEE2E2'};
                        color: ${branch.active ? '#065F46' : '#991B1B'};
                      ">
                        ${branch.active ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              `

              // Create info window
              const infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
              })

              // Add click listener to marker
              marker.addListener('click', () => {
                // Close all other info windows
                markersRef.current.forEach(({ infoWindow: iw }) => iw.close())
                infoWindow.open(mapInstance.current, marker)
              })

              // Store marker reference
              markersRef.current.push({ marker, infoWindow, branch })
              bounds.extend(position)
            } else {
              console.warn(`Geocoding failed for branch "${branch.name}": ${status}`)
            }

            // If all branches have been processed, fit map to bounds
            if (processedCount === branches.length) {
              if (markersRef.current.length > 0) {
                mapInstance.current?.fitBounds(bounds)
                // Ensure minimum zoom level
                const listener = google.maps.event.addListener(mapInstance.current, 'idle', () => {
                  if (mapInstance.current && mapInstance.current.getZoom() && mapInstance.current.getZoom()! > 15) {
                    mapInstance.current.setZoom(15)
                  }
                  google.maps.event.removeListener(listener)
                })
              }
              setIsLoading(false)
            }
          })
        })
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('Failed to load map. Please check your internet connection.')
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [branches])

  // Check if we're in demo mode
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  const isDemoMode = !apiKey || apiKey.includes('AIzaSyBvOkBw3cJ4XqJ8H9vL2M3N4O5P6Q7R8S9T0')

  if (error || isDemoMode) {
    return (
      <div className="w-full h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🗺️</div>
          <h3 className="text-xl font-semibold text-white mb-4">Branch Locations Map</h3>
          <p className="text-gray-400 mb-6">
            {isDemoMode 
              ? "Demo Mode: Interactive map requires a valid Google Maps API key"
              : error
            }
          </p>
          
          {/* Show branch locations as cards */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {branches.map((branch, index) => (
              <div key={branch.branchId} className="bg-white/10 rounded-lg p-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${branch.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-white font-medium text-sm">{branch.name}</p>
                      <p className="text-gray-400 text-xs">{branch.address}, {branch.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-xs">{branch.capacity} students</p>
                    <p className="text-gray-400 text-xs">{branch.managerName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {isDemoMode && (
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>To enable interactive map:</strong><br/>
                1. Get a Google Maps API key from <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a><br/>
                2. Set REACT_APP_GOOGLE_MAPS_API_KEY environment variable
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
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
