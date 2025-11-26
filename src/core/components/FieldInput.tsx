'use client';

import React from 'react';
import { FieldDefinition } from '../types/entity';

interface FieldInputProps {
  name: string;
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
}

export const FieldInput: React.FC<FieldInputProps> = ({
  name,
  field,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    lineHeight: '1.5',
    backgroundColor: '#1a1a2e',
    border: error ? '2px solid #ef4444' : '2px solid #2d2d44',
    borderRadius: '12px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const focusStyles = {
    borderColor: '#00ff88',
    boxShadow: '0 0 0 3px rgba(0, 255, 136, 0.2)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#00ff88';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 136, 0.2)';
  };

  const handleBlurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = error ? '#ef4444' : '#2d2d44';
    e.currentTarget.style.boxShadow = 'none';
    onBlur();
  };

  const renderInput = () => {
    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlurStyle}
            style={inputStyles}
            placeholder={`Enter ${field.label?.toLowerCase() || name}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={name}
            name={name}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            onFocus={handleFocus}
            onBlur={handleBlurStyle}
            style={inputStyles}
            placeholder={`Enter ${field.label?.toLowerCase() || name}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-4 cursor-pointer py-2">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              style={{
                width: '24px',
                height: '24px',
                accentColor: '#00ff88',
                cursor: 'pointer',
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            <span style={{ color: '#c0c0d0', fontSize: '16px' }}>{field.label}</span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            id={name}
            name={name}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlurStyle}
            style={{ ...inputStyles, colorScheme: 'dark' }}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        );

      case 'enum':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlurStyle}
            style={{
              ...inputStyles,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300ff88'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '44px',
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="" style={{ backgroundColor: '#1a1a2e', color: '#808090' }}>
              Select {field.label}...
            </option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt} style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'reference':
        return (
          <input
            type="text"
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlurStyle}
            style={inputStyles}
            placeholder={`Enter ${field.reference} ID`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {field.type !== 'boolean' && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: error ? '#ef4444' : '#e0e0f0',
            letterSpacing: '0.025em',
          }}
        >
          {field.label}
          {field.required && (
            <span style={{ color: '#00ff88', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      {renderInput()}

      {error && (
        <p
          id={`${name}-error`}
          style={{
            marginTop: '8px',
            fontSize: '14px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          role="alert"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
