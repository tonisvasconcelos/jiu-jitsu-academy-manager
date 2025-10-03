import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useBranches, Branch } from '../contexts/BranchContext'
import * as XLSX from 'xlsx'

const BranchRegistration: React.FC = () => {
  const { t } = useLanguage()
  const { branches, deleteBranch, addBranch } = useBranches()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  console.log('=== BRANCH REGISTRATION: RENDER ===')
  console.log('BranchRegistration: Current branches:', branches)
  console.log('BranchRegistration: Branches count:', branches.length)

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'BR': '🇧🇷',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'MX': '🇲🇽',
      'AR': '🇦🇷',
      'CL': '🇨🇱',
      'CO': '🇨🇴',
      'PE': '🇵🇪',
      'UY': '🇺🇾',
      'PY': '🇵🇾'
    }
    return flags[countryCode] || '🌍'
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
  }

  const handleDeleteBranch = (branchId: string) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      deleteBranch(branchId)
    }
  }

  const handleExportToExcel = () => {
    if (branches.length === 0) {
      alert('No branches to export!')
      return
    }

    // Prepare data for Excel export
    const exportData = branches.map(branch => ({
      'Branch ID': branch.branchId,
      'Name': branch.name,
      'Address': branch.address,
      'City': branch.city,
      'State': branch.state,
      'Country': branch.country,
      'Country Code': branch.countryCode,
      'Postal Code': branch.postalCode,
      'Phone': branch.phone,
      'Email': branch.email,
      'Website': branch.website || '',
      'Capacity': branch.capacity,
      'Active': branch.active ? 'Yes' : 'No',
      'Established Date': branch.establishedDate,
      'Manager Name': branch.managerName,
      'Manager Phone': branch.managerPhone,
      'Manager Email': branch.managerEmail,
      'Facilities': branch.facilities.join(', '),
      'Notes': branch.notes || ''
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Branch ID
      { wch: 25 }, // Name
      { wch: 30 }, // Address
      { wch: 15 }, // City
      { wch: 10 }, // State
      { wch: 15 }, // Country
      { wch: 12 }, // Country Code
      { wch: 12 }, // Postal Code
      { wch: 18 }, // Phone
      { wch: 25 }, // Email
      { wch: 30 }, // Website
      { wch: 10 }, // Capacity
      { wch: 8 },  // Active
      { wch: 15 }, // Established Date
      { wch: 20 }, // Manager Name
      { wch: 18 }, // Manager Phone
      { wch: 25 }, // Manager Email
      { wch: 30 }, // Facilities
      { wch: 30 }  // Notes
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Branches')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `branches_export_${currentDate}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)
  }

  const handleDownloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        'Name': 'Main Branch - São Paulo',
        'Address': 'Rua das Artes Marciais, 123',
        'City': 'São Paulo',
        'State': 'SP',
        'Country': 'Brazil',
        'Country Code': 'BR',
        'Postal Code': '01234-567',
        'Phone': '+55 11 99999-9999',
        'Email': 'sao-paulo@academy.com',
        'Website': 'https://academy.com/sao-paulo',
        'Capacity': '50',
        'Active': 'true',
        'Established Date': '2020-01-15',
        'Manager Name': 'João Silva',
        'Manager Phone': '+55 11 88888-8888',
        'Manager Email': 'joao.silva@academy.com',
        'Facilities': 'Mats, Weights, Shower, Parking, Locker Room',
        'Notes': 'Main training facility with full amenities'
      }
    ]

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Name
      { wch: 30 }, // Address
      { wch: 15 }, // City
      { wch: 10 }, // State
      { wch: 15 }, // Country
      { wch: 12 }, // Country Code
      { wch: 12 }, // Postal Code
      { wch: 18 }, // Phone
      { wch: 25 }, // Email
      { wch: 30 }, // Website
      { wch: 10 }, // Capacity
      { wch: 8 },  // Active
      { wch: 15 }, // Established Date
      { wch: 20 }, // Manager Name
      { wch: 18 }, // Manager Phone
      { wch: 25 }, // Manager Email
      { wch: 30 }, // Facilities
      { wch: 30 }  // Notes
    ]
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Branches Template')

    // Save file
    XLSX.writeFile(wb, 'branches_import_template.xlsx')
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        processImportData(jsonData)
      } catch (error) {
        console.error('Error reading Excel file:', error)
        setImportResult({ success: 0, errors: ['Error reading Excel file. Please check the file format.'] })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const processImportData = (data: any[]) => {
    setIsImporting(true)
    setImportResult(null)

    let successCount = 0
    const errors: string[] = []

    data.forEach((row, index) => {
      try {
        // Validate required fields
        if (!row['Name'] || !row['Address'] || !row['City'] || !row['Country']) {
          errors.push(`Row ${index + 2}: Missing required fields (Name, Address, City, Country)`)
          return
        }

        // Generate unique branch ID
        const branchId = `BR${String(Date.now() + index).slice(-6)}`

        // Parse facilities
        const facilities = row['Facilities'] ? String(row['Facilities']).split(',').map((f: string) => f.trim()) : []

        // Create branch object
        const newBranch: Branch = {
          branchId,
          name: String(row['Name']).trim(),
          address: String(row['Address']).trim(),
          city: String(row['City']).trim(),
          state: String(row['State'] || '').trim(),
          country: String(row['Country']).trim(),
          countryCode: String(row['Country Code'] || 'BR').trim(),
          postalCode: String(row['Postal Code'] || '').trim(),
          phone: String(row['Phone'] || '').trim(),
          email: String(row['Email'] || '').trim(),
          website: String(row['Website'] || '').trim() || undefined,
          workingHours: {
            monday: { open: '06:00', close: '22:00', closed: false },
            tuesday: { open: '06:00', close: '22:00', closed: false },
            wednesday: { open: '06:00', close: '22:00', closed: false },
            thursday: { open: '06:00', close: '22:00', closed: false },
            friday: { open: '06:00', close: '22:00', closed: false },
            saturday: { open: '08:00', close: '18:00', closed: false },
            sunday: { open: '08:00', close: '16:00', closed: false }
          },
          facilities,
          capacity: parseInt(String(row['Capacity'] || '30')),
          active: String(row['Active'] || 'true').toLowerCase() === 'true',
          establishedDate: String(row['Established Date'] || new Date().toISOString().split('T')[0]).trim(),
          managerName: String(row['Manager Name'] || '').trim(),
          managerPhone: String(row['Manager Phone'] || '').trim(),
          managerEmail: String(row['Manager Email'] || '').trim(),
          notes: String(row['Notes'] || '').trim() || undefined
        }

        // Add branch
        addBranch(newBranch)
        successCount++

      } catch (error) {
        errors.push(`Row ${index + 2}: ${error}`)
      }
    })

    setIsImporting(false)
    setImportResult({ success: successCount, errors })

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // Filter functions
  const clearAllFilters = () => {
    setSearchTerm('')
    setCountryFilter('all')
    setStatusFilter('all')
  }

  const filteredBranches = branches.filter(branch => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      (branch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.managerName || '').toLowerCase().includes(searchTerm.toLowerCase())

    // Country filter
    const matchesCountry = countryFilter === 'all' || (branch.countryCode || '').toLowerCase() === countryFilter.toLowerCase()

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && branch.active) ||
      (statusFilter === 'inactive' && !branch.active)

    return matchesSearch && matchesCountry && matchesStatus
  })

  const hasActiveFilters = searchTerm !== '' || countryFilter !== 'all' || statusFilter !== 'all'

  // Calculate statistics
  const totalBranches = branches.length
  const activeBranches = branches.filter(b => b.active).length
  const totalCapacity = branches.reduce((sum, b) => sum + b.capacity, 0)

  // Get unique countries
  const uniqueCountries = [...new Set(branches.map(b => b.countryCode))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent mb-3">
            {t('branch-registration')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Manage branch registrations and information
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Branches</p>
                <p className="text-3xl font-bold text-white">{totalBranches}</p>
                <p className="text-xs text-green-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Active Branches</p>
                <p className="text-3xl font-bold text-white">{activeBranches}</p>
                <p className="text-xs text-blue-400 mt-1">+0% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Capacity</p>
                <p className="text-3xl font-bold text-white">{totalCapacity}</p>
                <p className="text-xs text-purple-400 mt-1">students</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleDownloadTemplate}
            title={t('download-template')}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center"
          >
            <span className="mr-2">📥</span>
            <span className="text-sm font-medium">{t('download-template')}</span>
          </button>
          
          <button
            onClick={handleImportClick}
            title={t('import-from-excel')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
          >
            <span className="mr-2">📤</span>
            <span className="text-sm font-medium">{t('import-from-excel')}</span>
          </button>
          
          <button
            onClick={handleExportToExcel}
            title={t('export-to-excel')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center"
          >
            <span className="mr-2">📊</span>
            <span className="text-sm font-medium">{t('export-to-excel')}</span>
          </button>
          
          <Link
            to="/branches/registration/new"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
          >
            <span className="mr-2">➕</span>
            <span className="text-sm font-medium">New Branch</span>
          </Link>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Import Result Modal */}
        {importResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                {importResult.success > 0 ? t('import-success') : t('import-error')}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-green-400">
                  {t('imported-students')}: {importResult.success}
                </p>
                {importResult.errors.length > 0 && (
                  <div>
                    <p className="text-red-400 mb-2">Errors:</p>
                    <ul className="text-sm text-red-300 max-h-32 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => setImportResult(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder={t('search-students')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>
                  {getCountryFlag(country)} {country}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                {t('clear-filters')}
              </button>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
                {countryFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                    Country: {getCountryFlag(countryFilter)} {countryFilter}
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs">
                    Status: {t((statusFilter || '').toLowerCase())}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Branches List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Branch Registration List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      {hasActiveFilters ? 'No branches match the current filters.' : 'No branches registered yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr key={branch.branchId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">🏢</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{branch.name}</div>
                            <div className="text-xs text-gray-400">ID: {branch.branchId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">
                          {branch.address}, {branch.city}
                        </div>
                        <div className="text-xs text-gray-400">
                          {getCountryFlag(branch.countryCode)} {branch.country}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{branch.managerName}</div>
                        <div className="text-xs text-gray-400">{branch.managerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {branch.capacity} students
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(branch.active)}`}>
                          {branch.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-4">
                          <Link
                            to={`/branches/registration/view/${branch.branchId}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Branch"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/branches/registration/edit/${branch.branchId}`}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Edit Branch"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDeleteBranch(branch.branchId)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Branch"
                          >
                            🗑️
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

export default BranchRegistration

