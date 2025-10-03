import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: 'en' | 'pt') => {
    setLanguage(newLanguage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            {t('language-selector')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {t('select-language')}
          </p>
        </div>

        {/* Language Selection Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t('language')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Option */}
              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'en' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('en')}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🇺🇸</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{t('english')}</h3>
                    <p className="text-gray-400">English</p>
                  </div>
                  {language === 'en' && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Portuguese Option */}
              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'pt' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('pt')}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🇧🇷</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{t('portuguese')}</h3>
                    <p className="text-gray-400">Português</p>
                  </div>
                  {language === 'pt' && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Selection Info */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {language === 'en' ? '🇺🇸' : '🇧🇷'}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {language === 'en' ? 'English' : 'Português'} {t('language')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {language === 'en' 
                      ? 'The interface is currently displayed in English' 
                      : 'A interface está atualmente exibida em Português'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector

