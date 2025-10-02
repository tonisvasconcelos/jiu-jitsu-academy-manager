import React from 'react';
import { Button as FluentButton, ButtonProps } from '@fluentui/react-components';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({ 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  ...props 
}: CustomButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
      case 'outline':
        return 'border border-blue-600 text-blue-600 hover:bg-blue-50';
      case 'ghost':
        return 'text-blue-600 hover:bg-blue-50';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'medium':
        return 'px-4 py-2 text-base';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return '';
    }
  };

  return (
    <FluentButton
      className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    />
  );
}

