import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../../components/common/PageHeader';

export default function TeachersList() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("nav.teachers")}
        subtitle="Gerencie os professores da academia"
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">
          {t("common.noData")} - {t("nav.teachers")}
        </p>
        <p className="text-sm text-gray-400 text-center">
          Esta funcionalidade será implementada em breve
        </p>
      </div>
    </div>
  );
}

