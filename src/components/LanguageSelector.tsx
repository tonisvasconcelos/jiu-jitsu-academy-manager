import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage, Language } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  // Defensive guards - ensure all required functions and values are available
  if (!language || !setLanguage || !t) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading language selector...</p>
        </div>
      </div>
    )
  }

  // Ensure language is a valid value
  const validLanguages: Language[] = ['ENU', 'PTB', 'GER', 'FRA', 'ESP', 'JPN', 'ITA', 'RUS', 'ARA', 'KOR']
  if (!validLanguages.includes(language)) {
    console.warn(`Invalid language value: ${language}, defaulting to PTB`)
    setLanguage('PTB')
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Initializing language...</p>
        </div>
      </div>
    )
  }

  const handleLanguageChange = (newLanguage: Language) => {
    try {
      setLanguage(newLanguage)
      // Immediately redirect to login after language selection
      setTimeout(() => {
        navigate('/login')
      }, 100) // Small delay to ensure language is saved
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            {t('language-selector')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('select-language')}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Click on your preferred language to continue
          </p>
        </div>

        {/* Language Selection Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6">{t('language')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* English */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'ENU' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('ENU')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇺🇸</div>
                  <h3 className="text-sm font-semibold text-white">English</h3>
                  <p className="text-xs text-gray-400">ENU</p>
                  {language === 'ENU' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Portuguese */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'PTB' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('PTB')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇧🇷</div>
                  <h3 className="text-sm font-semibold text-white">Português</h3>
                  <p className="text-xs text-gray-400">PTB</p>
                  {language === 'PTB' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* German */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'GER' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('GER')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇩🇪</div>
                  <h3 className="text-sm font-semibold text-white">Deutsch</h3>
                  <p className="text-xs text-gray-400">GER</p>
                  {language === 'GER' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* French */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'FRA' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('FRA')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇫🇷</div>
                  <h3 className="text-sm font-semibold text-white">Français</h3>
                  <p className="text-xs text-gray-400">FRA</p>
                  {language === 'FRA' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Spanish */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'ESP' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('ESP')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇪🇸</div>
                  <h3 className="text-sm font-semibold text-white">Español</h3>
                  <p className="text-xs text-gray-400">ESP</p>
                  {language === 'ESP' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Japanese */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'JPN' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('JPN')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇯🇵</div>
                  <h3 className="text-sm font-semibold text-white">日本語</h3>
                  <p className="text-xs text-gray-400">JPN</p>
                  {language === 'JPN' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Italian */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'ITA' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('ITA')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇮🇹</div>
                  <h3 className="text-sm font-semibold text-white">Italiano</h3>
                  <p className="text-xs text-gray-400">ITA</p>
                  {language === 'ITA' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Russian */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'RUS' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('RUS')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇷🇺</div>
                  <h3 className="text-sm font-semibold text-white">Русский</h3>
                  <p className="text-xs text-gray-400">RUS</p>
                  {language === 'RUS' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Arabic */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'ARA' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('ARA')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇸🇦</div>
                  <h3 className="text-sm font-semibold text-white">العربية</h3>
                  <p className="text-xs text-gray-400">ARA</p>
                  {language === 'ARA' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Korean */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  language === 'KOR' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-white/10 bg-white/5 hover:border-blue-400'
                }`}
                onClick={() => handleLanguageChange('KOR')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🇰🇷</div>
                  <h3 className="text-sm font-semibold text-white">한국어</h3>
                  <p className="text-xs text-gray-400">KOR</p>
                  {language === 'KOR' && (
                    <div className="mt-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-xs">✓</span>
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
                  {language === 'ENU' ? '🇺🇸' : 
                   language === 'PTB' ? '🇧🇷' :
                   language === 'GER' ? '🇩🇪' :
                   language === 'FRA' ? '🇫🇷' :
                   language === 'ESP' ? '🇪🇸' :
                   language === 'JPN' ? '🇯🇵' :
                   language === 'ITA' ? '🇮🇹' :
                   language === 'RUS' ? '🇷🇺' :
                   language === 'ARA' ? '🇸🇦' :
                   language === 'KOR' ? '🇰🇷' : '🌐'}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {language === 'ENU' ? 'English' : 
                     language === 'PTB' ? 'Português' :
                     language === 'GER' ? 'Deutsch' :
                     language === 'FRA' ? 'Français' :
                     language === 'ESP' ? 'Español' :
                     language === 'JPN' ? '日本語' :
                     language === 'ITA' ? 'Italiano' :
                     language === 'RUS' ? 'Русский' :
                     language === 'ARA' ? 'العربية' :
                     language === 'KOR' ? '한국어' : 'Language'} {t('language')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {language === 'ENU' ? 'The interface is currently displayed in English' : 
                     language === 'PTB' ? 'A interface está atualmente exibida em Português' :
                     language === 'GER' ? 'Die Benutzeroberfläche wird derzeit auf Deutsch angezeigt' :
                     language === 'FRA' ? 'L\'interface est actuellement affichée en français' :
                     language === 'ESP' ? 'La interfaz se muestra actualmente en español' :
                     language === 'JPN' ? 'インターフェースは現在日本語で表示されています' :
                     language === 'ITA' ? 'L\'interfaccia è attualmente visualizzata in italiano' :
                     language === 'RUS' ? 'Интерфейс в настоящее время отображается на русском языке' :
                     language === 'ARA' ? 'يتم عرض الواجهة حاليًا باللغة العربية' :
                     language === 'KOR' ? '인터페이스가 현재 한국어로 표시됩니다' : 
                     'Please select a language'}
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

