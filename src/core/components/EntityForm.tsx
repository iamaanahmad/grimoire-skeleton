'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EntityDefinition } from '../types/entity';
import { FieldInput } from './FieldInput';
import { validateEntity, validateField } from '../lib/validators';
import { Loader2 } from 'lucide-react';

interface EntityFormProps {
  entityDef: EntityDefinition;
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export const EntityForm: React.FC<EntityFormProps> = ({
  entityDef,
  initialValues,
  onSubmit,
  mode,
}) => {
  const [values, setValues] = useState<any>(() => initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Only sync initialValues on first load or when it has actual data (edit mode)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0 && !initializedRef.current) {
      setValues(initialValues);
      initializedRef.current = true;
    }
  }, [initialValues]);

  const handleChange = (name: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: string) => {
    const field = entityDef.fields[name];
    if (field) {
      const error = validateField(values[name], field);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validateEntity(values, entityDef.fields);

    if (entityDef.validate) {
      const customResult = entityDef.validate(values);
      if (customResult !== true) {
        setGeneralError(typeof customResult === 'string' ? customResult : 'Validation failed');
        return;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setGeneralError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="w-full rounded-2xl p-8 md:p-10"
        style={{
          backgroundColor: '#12121a',
          border: '1px solid #2d2d44',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Form Fields - 2 column grid on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(entityDef.fields).map(([name, field]) => (
            <div key={name} className={field.type === 'boolean' ? 'md:col-span-2' : ''}>
              <FieldInput
                name={name}
                field={field}
                value={values[name]}
                onChange={(val) => handleChange(name, val)}
                onBlur={() => handleBlur(name)}
                error={errors[name]}
              />
            </div>
          ))}
        </div>

        {/* Error Message */}
        {generalError && (
          <div
            className="mt-8 p-4 rounded-xl flex items-center gap-3"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
            }}
            role="alert"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="mt-10 pt-8 flex flex-col sm:flex-row justify-end gap-4"
          style={{ borderTop: '1px solid #2d2d44' }}
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#1a1a2e',
              color: '#a0a0b0',
              border: '1px solid #2d2d44',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#00ff88',
              color: '#0a0a0f',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'create' ? 'Summoning...' : 'Saving...'}
              </span>
            ) : (
              <span>{mode === 'create' ? '✨ Summon' : '💾 Save Changes'}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
