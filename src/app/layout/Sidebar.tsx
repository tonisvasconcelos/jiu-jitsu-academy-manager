import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navigation = [
  { key: 'dashboard', path: '/' },
  { key: 'students', path: '/students' },
  { key: 'teachers', path: '/teachers' },
  { key: 'users', path: '/users' },
  { key: 'classes', path: '/classes' },
];

const operations = [
  { key: 'schedule', path: '/schedule' },
  { key: 'attendance', path: '/attendance' },
  { key: 'payments', path: '/payments' },
  { key: 'events', path: '/events' },
];

const reports = [
  { key: 'reports', path: '/reports' },
  { key: 'exports', path: '/exports' },
];

const settings = [
  { key: 'entityManagement', path: '/entity-management' },
  { key: 'userManagement', path: '/users' },
  { key: 'companyProfile', path: '/company-profile' },
];

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="w-64 bg-gray-800 shadow-lg h-screen">
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">GFTeam</h2>
              <p className="text-gray-400 text-xs">Sistema de Gerenciamento de Jiu-Jitsu</p>
            </div>
          </div>
        </div>
        
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <span className="text-sm">{t(`nav.${item.key}`)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Operations Section */}
        <div className="mt-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t('nav.operations')}
          </h3>
          <ul className="mt-2 space-y-1">
            {operations.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <span className="text-sm">{t(`nav.${item.key}`)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Reports Section */}
        <div className="mt-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t('nav.reports')}
          </h3>
          <ul className="mt-2 space-y-1">
            {reports.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <span className="text-sm">{t(`nav.${item.key}`)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div className="mt-6">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t('nav.settings')}
          </h3>
          <ul className="mt-2 space-y-1">
            {settings.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <span className="text-sm">{t(`nav.${item.key}`)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

