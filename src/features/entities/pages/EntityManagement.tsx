import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EntityManagement() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Entity Management</h1>
        <p className="text-gray-600">Manage entities, branches, and organizations</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Entity Management</h2>
          <p className="text-gray-600 mb-4">
            This page will contain entity management functionality.
          </p>
          <p className="text-sm text-gray-500">
            Logged in as: Admin User (System Administrator)
          </p>
        </div>
      </div>
    </div>
  );
}


