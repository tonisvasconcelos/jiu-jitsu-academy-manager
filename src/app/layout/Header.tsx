import React from 'react';
import { useTranslation } from "react-i18next";
import { Button } from '@fluentui/react-components';

export default function Header() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="w-full flex items-center justify-between p-4 border-b bg-blue-900 text-white">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-800">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">🥋 Academy Manager</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-300">System Administrator</div>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AU</span>
          </div>
        </div>
        
        <Button
          appearance="secondary"
          onClick={toggleLanguage}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          {i18n.language === "pt" ? "English" : "Português"}
        </Button>
      </div>
    </header>
  );
}

