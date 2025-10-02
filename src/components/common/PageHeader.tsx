import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  actionLabel, 
  onAction, 
  showAction = true 
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {showAction && onAction && (
        <Button onClick={onAction}>
          {actionLabel || t("common.add")}
        </Button>
      )}
    </div>
  );
}

