import React from 'react';
import { Input as FluentInput, InputProps } from '@fluentui/react-components';

interface CustomInputProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: CustomInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <FluentInput
        className={`w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm">{helperText}</p>
      )}
    </div>
  );
}

