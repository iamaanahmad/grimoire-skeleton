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
    const getInputStyle = () => ({
        width: '100%',
        backgroundColor: 'var(--color-bg-secondary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: error ? 'var(--color-status-error)' : 'var(--color-border-primary)',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        color: 'var(--color-text-primary)',
        transition: `all var(--animation-duration-fast) var(--animation-easing)`,
    });

    const getLabelStyle = () => ({
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.375rem',
        color: error ? 'var(--color-status-error)' : 'var(--color-text-secondary)',
    });

    const renderInput = () => {
        const inputStyle = getInputStyle();
        
        switch (field.type) {
            case 'string':
                return (
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        style={inputStyle}
                        placeholder={field.label}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-glow)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlurCapture={(e) => {
                            e.currentTarget.style.borderColor = error ? 'var(--color-status-error)' : 'var(--color-border-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                        onBlur={onBlur}
                        style={inputStyle}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-glow)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlurCapture={(e) => {
                            e.currentTarget.style.borderColor = error ? 'var(--color-status-error)' : 'var(--color-border-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center h-10">
                        <input
                            type="checkbox"
                            id={name}
                            name={name}
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                            onBlur={onBlur}
                            className="w-5 h-5 rounded"
                            style={{
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'var(--color-border-primary)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                accentColor: 'var(--color-accent-primary)',
                            }}
                            aria-invalid={!!error}
                            aria-describedby={error ? `${name}-error` : undefined}
                        />
                        <label 
                            htmlFor={name} 
                            className="ml-3 text-sm select-none cursor-pointer"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            {field.label}
                        </label>
                    </div>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        id={name}
                        name={name}
                        value={value ? new Date(value).toISOString().split('T')[0] : ''}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        style={inputStyle}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-glow)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlurCapture={(e) => {
                            e.currentTarget.style.borderColor = error ? 'var(--color-status-error)' : 'var(--color-border-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                );
            case 'enum':
                return (
                    <select
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        style={inputStyle}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-glow)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlurCapture={(e) => {
                            e.currentTarget.style.borderColor = error ? 'var(--color-status-error)' : 'var(--color-border-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <option value="">Select {field.label}...</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case 'reference':
                // Placeholder for now, will be replaced by ReferenceSelect later
                return (
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        style={inputStyle}
                        placeholder={`ID of ${field.reference}`}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-glow)';
                            e.currentTarget.style.outline = 'none';
                        }}
                        onBlurCapture={(e) => {
                            e.currentTarget.style.borderColor = error ? 'var(--color-status-error)' : 'var(--color-border-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="mb-4">
            {field.type !== 'boolean' && (
                <label htmlFor={name} style={getLabelStyle()}>
                    {field.label} {field.required && <span style={{ color: 'var(--color-status-error)', opacity: 0.5 }}>*</span>}
                </label>
            )}
            {renderInput()}
            {error && (
                <p 
                    id={`${name}-error`} 
                    className="mt-1 text-xs animate-pulse"
                    style={{ color: 'var(--color-status-error)' }}
                >
                    {error}
                </p>
            )}
        </div>
    );
};
