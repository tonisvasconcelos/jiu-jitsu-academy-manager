import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const AppSettings: React.FC = () => {
  const { t } = useLanguage()
  
  const [settings, setSettings] = useState({
    academyName: 'OSS 365 Fight Academy',
    academyLogo: '',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'BRL',
    maxStudentsPerClass: 20,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    debugMode: false
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  const timezones = [
    'America/Sao_Paulo',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]

  const currencies = [
    { code: 'BRL', name: 'Brazilian Real (R$)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                ⚙️ App Settings
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                Configure application preferences and system settings
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

        {/* Settings Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }} className="space-y-8">
          {/* Academy Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Academy Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="academyName" className="block text-sm font-medium text-gray-300 mb-2">Academy Name</label>
                <input
                  id="academyName"
                  type="text"
                  value={settings.academyName}
                  onChange={(e) => handleSettingChange('academyName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter academy name"
                />
              </div>

              <div>
                <label htmlFor="academyLogo" className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                <input
                  id="academyLogo"
                  type="url"
                  value={settings.academyLogo}
                  onChange={(e) => handleSettingChange('academyLogo', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Regional Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz} className="bg-gray-800">{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code} className="bg-gray-800">{curr.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-300 mb-2">Time Format</label>
                <select
                  id="timeFormat"
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="24h" className="bg-gray-800">24 Hour (14:30)</option>
                  <option value="12h" className="bg-gray-800">12 Hour (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Class Settings */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Class Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxStudentsPerClass" className="block text-sm font-medium text-gray-300 mb-2">Max Students per Class</label>
                <input
                  id="maxStudentsPerClass"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.maxStudentsPerClass}
                  onChange={(e) => handleSettingChange('maxStudentsPerClass', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Send notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-white font-medium">SMS Notifications</h3>
                  <p className="text-gray-400 text-sm">Send notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">System Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-white font-medium">Auto Backup</h3>
                  <p className="text-gray-400 text-sm">Automatically backup data daily</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-white font-medium">Maintenance Mode</h3>
                  <p className="text-gray-400 text-sm">Put the system in maintenance mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-white font-medium">Debug Mode</h3>
                  <p className="text-gray-400 text-sm">Enable debug logging and features</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppSettings
