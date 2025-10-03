import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useBranchFacilities } from '../contexts/BranchFacilityContext'
import { useBranches } from '../contexts/BranchContext'
import * as XLSX from 'xlsx'

const BranchFacilityRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { facilities, deleteFacility } = useBranchFacilities()
  const { branches } = useBranches()
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState('all')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.branchId === branchId)
    return branch ? branch.name : 'Unknown Branch'
  }

  const getFacilityTypeDisplayName = (type: string) => {
    const typeNames = {
      'training-room': 'Training Room',
      'tatami-dojo': 'Tatami / Dojo',
      'weights-room': 'Weights Room',
      'office': 'Office',
      'reception': 'Reception',
      'locker-room': 'Locker Room',
      'parking': 'Parking',
      'other': 'Other'
    }
    return typeNames[type as keyof typeof typeNames] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      'under-maintenance': 'bg-yellow-500/20 text-yellow-400'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const getFacilityTypeColor = (type: string) => {
    const colors = {
      'training-room': 'bg-blue-500/20 text-blue-400',
      'tatami-dojo': 'bg-purple-500/20 text-purple-400',
      'weights-room': 'bg-red-500/20 text-red-400',
      'office': 'bg-gray-500/20 text-gray-400',
      'reception': 'bg-green-500/20 text-green-400',
      'locker-room': 'bg-orange-500/20 text-orange-400',
      'parking': 'bg-indigo-500/20 text-indigo-400',
      'other': 'bg-pink-500/20 text-pink-400'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  // Filter facilities
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getBranchName(facility.branchId).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = facilityTypeFilter === 'all' || facility.facilityType === facilityTypeFilter
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter
    const matchesBranch = branchFilter === 'all' || facility.branchId === branchFilter
    const matchesCapacity = capacityFilter === 'all' || 
      (capacityFilter === 'small' && facility.capacity <= 15) ||
      (capacityFilter === 'medium' && facility.capacity > 15 && facility.capacity <= 30) ||
      (capacityFilter === 'large' && facility.capacity > 30)

    return matchesSearch && matchesType && matchesStatus && matchesBranch && matchesCapacity
  })

  // Statistics
  const totalFacilities = facilities.length
  const activeFacilities = facilities.filter(f => f.status === 'active').length
  const underMaintenance = facilities.filter(f => f.status === 'under-maintenance').length
  const inactiveFacilities = facilities.filter(f => f.status === 'inactive').length

  // Facility type statistics
  const facilityTypeStats = facilities.reduce((acc, facility) => {
    acc[facility.facilityType] = (acc[facility.facilityType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleDelete = (facilityId: string) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      deleteFacility(facilityId)
    }
  }

  const handleExportToExcel = () => {
    const exportData = filteredFacilities.map(facility => ({
      'Facility ID': facility.facilityId,
      'Facility Name': facility.facilityName,
      'Type': getFacilityTypeDisplayName(facility.facilityType),
      'Branch': getBranchName(facility.branchId),
      'Capacity': facility.capacity,
      'Area Size (m²)': facility.areaSize,
      'Status': facility.status,
      'Description': facility.description || '',
      'Equipment': facility.equipment?.join(', ') || '',
      'Last Maintenance': facility.lastMaintenanceDate || '',
      'Next Maintenance': facility.nextMaintenanceDate || '',
      'Notes': facility.notes || ''
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Branch Facilities')

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Facility ID
      { wch: 20 }, // Facility Name
      { wch: 15 }, // Type
      { wch: 15 }, // Branch
      { wch: 10 }, // Capacity
      { wch: 12 }, // Area Size
      { wch: 15 }, // Status
      { wch: 30 }, // Description
      { wch: 25 }, // Equipment
      { wch: 15 }, // Last Maintenance
      { wch: 15 }, // Next Maintenance
      { wch: 30 }  // Notes
    ]
    ws['!cols'] = colWidths

    XLSX.writeFile(wb, 'branch-facilities.xlsx')
  }

  const handleImportFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log('Imported data:', jsonData)
        // Here you would typically process the imported data and add facilities
        alert(`Successfully imported ${jsonData.length} facilities from Excel file.`)
      } catch (error) {
        console.error('Error importing Excel file:', error)
        alert('Error importing Excel file. Please check the file format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent mb-3">
              Branch Facilities Management
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Manage all branch facilities, equipment, and maintenance schedules
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <Link
              to="/branches/facilities/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Facility
            </Link>
            <button
              onClick={handleExportToExcel}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import Excel
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFromExcel}
              className="hidden"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Facilities</p>
                <p className="text-3xl font-bold text-white">{totalFacilities}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Facilities</p>
                <p className="text-3xl font-bold text-white">{activeFacilities}</p>
                <p className="text-xs text-gray-500 mt-1">{totalFacilities > 0 ? Math.round((activeFacilities / totalFacilities) * 100) : 0}% of total</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Under Maintenance</p>
                <p className="text-3xl font-bold text-white">{underMaintenance}</p>
                <p className="text-xs text-gray-500 mt-1">{totalFacilities > 0 ? Math.round((underMaintenance / totalFacilities) * 100) : 0}% of total</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Inactive Facilities</p>
                <p className="text-3xl font-bold text-white">{inactiveFacilities}</p>
                <p className="text-xs text-gray-500 mt-1">{totalFacilities > 0 ? Math.round((inactiveFacilities / totalFacilities) * 100) : 0}% of total</p>
              </div>
              <div className="p-3 bg-gray-500/20 rounded-xl">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Type Distribution */}
        {Object.keys(facilityTypeStats).length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Facility Type Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(facilityTypeStats).map(([type, count]) => (
                <div key={type} className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFacilityTypeColor(type)}`}>
                    {getFacilityTypeDisplayName(type)}
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{count}</p>
                  <p className="text-xs text-gray-500">{totalFacilities > 0 ? Math.round((count / totalFacilities) * 100) : 0}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={facilityTypeFilter}
              onChange={(e) => setFacilityTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="training-room">Training Room</option>
              <option value="tatami-dojo">Tatami / Dojo</option>
              <option value="weights-room">Weights Room</option>
              <option value="office">Office</option>
              <option value="reception">Reception</option>
              <option value="locker-room">Locker Room</option>
              <option value="parking">Parking</option>
              <option value="other">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under-maintenance">Under Maintenance</option>
            </select>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
              ))}
            </select>

            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Capacities</option>
              <option value="small">Small (≤15)</option>
              <option value="medium">Medium (16-30)</option>
                <option value="large">Large (&gt;30)</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setFacilityTypeFilter('all')
                setStatusFilter('all')
                setBranchFilter('all')
                setCapacityFilter('all')
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Facility</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Area Size</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      {searchTerm || facilityTypeFilter !== 'all' || statusFilter !== 'all' || branchFilter !== 'all' || capacityFilter !== 'all' 
                        ? 'No facilities found matching your filters.' 
                        : 'No facilities registered yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.facilityId} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{facility.facilityName}</div>
                          {facility.description && (
                            <div className="text-sm text-gray-400 truncate max-w-xs">{facility.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFacilityTypeColor(facility.facilityType)}`}>
                          {getFacilityTypeDisplayName(facility.facilityType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {getBranchName(facility.branchId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {facility.capacity} people
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {facility.areaSize} m²
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                          {facility.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/branches/facilities/view/${facility.facilityId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            title="View Facility"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/branches/facilities/edit/${facility.facilityId}`}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="Edit Facility"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(facility.facilityId)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Delete Facility"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchFacilityRegistration
