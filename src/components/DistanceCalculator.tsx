import React, { useState, useEffect } from 'react'
import { Branch } from '../contexts/BranchContext'

interface DistanceCalculatorProps {
  branches: Branch[]
}

interface DistanceResult {
  distance: number
  unit: 'km' | 'miles'
  duration?: string
}

const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({ branches }) => {
  const [fromBranch, setFromBranch] = useState<string>('')
  const [toBranch, setToBranch] = useState<string>('')
  const [result, setResult] = useState<DistanceResult | null>(null)
  const [unit, setUnit] = useState<'km' | 'miles'>('km')
  const [isCalculating, setIsCalculating] = useState(false)

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Calculate estimated travel time (assuming average speed of 60 km/h)
  const calculateTravelTime = (distanceKm: number): string => {
    const avgSpeedKmh = 60
    const hours = distanceKm / avgSpeedKmh
    const minutes = Math.round(hours * 60)
    
    if (minutes < 60) {
      return `${minutes} minutes`
    } else {
      const hoursPart = Math.floor(minutes / 60)
      const minutesPart = minutes % 60
      return minutesPart > 0 ? `${hoursPart}h ${minutesPart}m` : `${hoursPart} hours`
    }
  }

  const handleCalculate = async () => {
    if (!fromBranch || !toBranch) {
      alert('Please select both branches')
      return
    }

    if (fromBranch === toBranch) {
      alert('Please select different branches')
      return
    }

    setIsCalculating(true)

    try {
      const from = branches.find(b => b.branchId === fromBranch)
      const to = branches.find(b => b.branchId === toBranch)

      if (!from || !to) {
        alert('Branch not found')
        return
      }

      // Check if both branches have coordinates
      if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
        alert('Both branches must have coordinates to calculate distance. Please add coordinates to the branches first.')
        return
      }

      // Calculate distance
      const distanceKm = calculateDistance(
        from.latitude, from.longitude,
        to.latitude, to.longitude
      )

      const distanceMiles = distanceKm * 0.621371
      const travelTime = calculateTravelTime(distanceKm)

      setResult({
        distance: unit === 'km' ? distanceKm : distanceMiles,
        unit,
        duration: travelTime
      })
    } catch (error) {
      console.error('Error calculating distance:', error)
      alert('Error calculating distance. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleUnitChange = (newUnit: 'km' | 'miles') => {
    setUnit(newUnit)
    if (result) {
      const distanceKm = unit === 'km' ? result.distance : result.distance / 0.621371
      const newDistance = newUnit === 'km' ? distanceKm : distanceKm * 0.621371
      setResult({
        ...result,
        distance: newDistance,
        unit: newUnit
      })
    }
  }

  const clearResult = () => {
    setResult(null)
    setFromBranch('')
    setToBranch('')
  }

  // Filter branches that have coordinates
  const branchesWithCoordinates = branches.filter(branch => 
    branch.latitude && branch.longitude
  )

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-3 text-2xl">📏</span>
          Distance Calculator
        </h2>
        {result && (
          <button
            onClick={clearResult}
            className="text-gray-400 hover:text-white transition-colors"
            title="Clear result"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Branch Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From Branch
            </label>
            <select
              value={fromBranch}
              onChange={(e) => setFromBranch(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select branch...</option>
              {branchesWithCoordinates.map(branch => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To Branch
            </label>
            <select
              value={toBranch}
              onChange={(e) => setToBranch(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select branch...</option>
              {branchesWithCoordinates.map(branch => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unit Selection */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-300">Unit:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleUnitChange('km')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                unit === 'km'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Kilometers
            </button>
            <button
              onClick={() => handleUnitChange('miles')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                unit === 'miles'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Miles
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={!fromBranch || !toBranch || isCalculating}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {isCalculating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating...
            </div>
          ) : (
            'Calculate Distance'
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {result.distance.toFixed(2)} {result.unit}
              </div>
              <div className="text-gray-300 mb-4">
                {result.duration && `Estimated travel time: ${result.duration}`}
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-gray-400">Distance</div>
                  <div className="text-white font-semibold">
                    {result.distance.toFixed(2)} {result.unit}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-gray-400">Travel Time</div>
                  <div className="text-white font-semibold">
                    {result.duration || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Branch Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-gray-400">From</div>
                  <div className="text-white font-semibold">
                    {branches.find(b => b.branchId === fromBranch)?.name}
                  </div>
                  <div className="text-gray-300">
                    {branches.find(b => b.branchId === fromBranch)?.city}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-gray-400">To</div>
                  <div className="text-white font-semibold">
                    {branches.find(b => b.branchId === toBranch)?.name}
                  </div>
                  <div className="text-gray-300">
                    {branches.find(b => b.branchId === toBranch)?.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        {branchesWithCoordinates.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>⚠️ No branches with coordinates found.</strong><br/>
              Add latitude and longitude coordinates to branches to use the distance calculator.
            </p>
          </div>
        )}

        {branchesWithCoordinates.length > 0 && branchesWithCoordinates.length < branches.length && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>ℹ️ Note:</strong> Only branches with coordinates are shown in the calculator. 
              {branches.length - branchesWithCoordinates.length} branch(es) without coordinates are not included.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DistanceCalculator
