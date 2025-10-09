import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../contexts/LanguageContext';

interface WelcomeLanguageProps {
  onLanguageSelect: (language: Language) => void;
}

const WelcomeLanguage: React.FC<WelcomeLanguageProps> = ({ onLanguageSelect }) => {
  const navigate = useNavigate();

  const languages = [
    { code: 'ENU' as Language, name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'PTB' as Language, name: 'Portuguese', flag: '🇧🇷', native: 'Português' },
    { code: 'GER' as Language, name: 'German', flag: '🇩🇪', native: 'Deutsch' },
    { code: 'FRA' as Language, name: 'French', flag: '🇫🇷', native: 'Français' },
    { code: 'ESP' as Language, name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { code: 'JPN' as Language, name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { code: 'ITA' as Language, name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
    { code: 'RUS' as Language, name: 'Russian', flag: '🇷🇺', native: 'Русский' },
    { code: 'ARA' as Language, name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'KOR' as Language, name: 'Korean', flag: '🇰🇷', native: '한국어' },
  ];

  const handleLanguageSelect = (language: Language) => {
    // Save language to localStorage
    localStorage.setItem('selectedLanguage', language);
    
    // Call the parent handler
    onLanguageSelect(language);
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            Welcome to OSS365
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Please select your preferred language to continue
          </p>
          <p className="text-sm text-gray-400">
            Choose from the available languages below to access the application in your native language
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="group p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-blue-400 hover:bg-blue-500/10 cursor-pointer transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {lang.flag}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {lang.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {lang.native}
                </p>
                <p className="text-xs text-gray-500">
                  {lang.code}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-400">
            Your language preference will be saved for future visits
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLanguage;
