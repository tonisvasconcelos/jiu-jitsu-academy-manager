import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const CompanyInfo: React.FC = () => {
  const { t, setLanguage } = useLanguage()
  
  const [companyData, setCompanyData] = useState({
    companyName: 'OSS 365 Fight Academy',
    legalName: 'OSS 365 Fight Academy Ltda',
    taxId: '12.345.678/0001-90',
    email: 'info@oss365academy.com',
    phone: '+55 11 99999-9999',
    website: 'https://www.oss365academy.com',
    address: {
      street: 'Rua das Artes Marciais, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brazil'
    },
    socialMedia: {
      instagram: '@oss365academy',
      facebook: 'OSS365Academy',
      youtube: 'OSS 365 Academy',
      whatsapp: '+55 11 99999-9999'
    },
    businessHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 16:00'
    },
    systemLanguage: 'PTB'
  })

  const languages = [
    { code: 'ENU', name: 'English', flag: '🇺🇸' },
    { code: 'PTB', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'GER', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'FRA', name: 'Français', flag: '🇫🇷' },
    { code: 'ESP', name: 'Español', flag: '🇪🇸' }
  ]

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setCompanyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setCompanyData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleLanguageChange = (languageCode: string) => {
    setCompanyData(prev => ({
      ...prev,
      systemLanguage: languageCode
    }))
    setLanguage(languageCode)
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving company data:', companyData)
    alert('Company information saved successfully!')
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      // Reset to default values
      setCompanyData({
        companyName: 'OSS 365 Fight Academy',
        legalName: 'OSS 365 Fight Academy Ltda',
        taxId: '12.345.678/0001-90',
        email: 'info@oss365academy.com',
        phone: '+55 11 99999-9999',
        website: 'https://www.oss365academy.com',
        address: {
          street: 'Rua das Artes Marciais, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brazil'
        },
        socialMedia: {
          instagram: '@oss365academy',
          facebook: 'OSS365Academy',
          youtube: 'OSS 365 Academy',
          whatsapp: '+55 11 99999-9999'
        },
        businessHours: {
          monday: '06:00 - 22:00',
          tuesday: '06:00 - 22:00',
          wednesday: '06:00 - 22:00',
          thursday: '06:00 - 22:00',
          friday: '06:00 - 22:00',
          saturday: '08:00 - 18:00',
          sunday: '08:00 - 16:00'
        },
        systemLanguage: 'PTB'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                🏢 Company Info & Settings
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                Manage your academy's company information and system language
              </p>
            </div>
            <Link
              to="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Basic Company Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  value={companyData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="legalName" className="block text-sm font-medium text-gray-300 mb-2">Legal Name</label>
                <input
                  id="legalName"
                  type="text"
                  value={companyData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter legal company name"
                />
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-300 mb-2">Tax ID / CNPJ</label>
                <input
                  id="taxId"
                  type="text"
                  value={companyData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter tax ID or CNPJ"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter company email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  id="website"
                  type="url"
                  value={companyData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Address Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                <input
                  id="street"
                  type="text"
                  value={companyData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  id="city"
                  type="text"
                  value={companyData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                <input
                  id="state"
                  type="text"
                  value={companyData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter state or province"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">ZIP/Postal Code</label>
                <input
                  id="zipCode"
                  type="text"
                  value={companyData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter ZIP or postal code"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <input
                  id="country"
                  type="text"
                  value={companyData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Social Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                <input
                  id="instagram"
                  type="text"
                  value={companyData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                <input
                  id="facebook"
                  type="text"
                  value={companyData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Page name"
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                <input
                  id="youtube"
                  type="text"
                  value={companyData.socialMedia.youtube}
                  onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Channel name"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={companyData.socialMedia.whatsapp}
                  onChange={(e) => handleInputChange('socialMedia.whatsapp', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Business Hours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(companyData.businessHours).map(([day, hours]) => (
                <div key={day}>
                  <label htmlFor={day} className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {day}
                  </label>
                  <input
                    id={day}
                    type="text"
                    value={hours}
                    onChange={(e) => handleInputChange(`businessHours.${day}`, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="HH:MM - HH:MM"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* System Language */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">System Language</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((language) => (
                <div key={language.code} className="relative">
                  <input
                    type="radio"
                    id={language.code}
                    name="systemLanguage"
                    value={language.code}
                    checked={companyData.systemLanguage === language.code}
                    onChange={() => handleLanguageChange(language.code)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={language.code}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      companyData.systemLanguage === language.code
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl mr-3">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.name}</div>
                      <div className="text-sm opacity-75">{language.code}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Save Company Information
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyInfo
