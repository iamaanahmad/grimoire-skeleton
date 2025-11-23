import React, { useState, useEffect } from 'react';
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
    initialValues = {},
    onSubmit,
    mode,
}) => {
    const [values, setValues] = useState<any>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    useEffect(() => {
        if (initialValues) {
            setValues(initialValues);
        }
    }, [initialValues]);

    const handleChange = (name: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [name]: value }));

        // Clear error for this field when modified
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

        // Validate all fields
        const validationErrors = validateEntity(values, entityDef.fields);

        // Custom entity validation
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
        <form 
            onSubmit={handleSubmit} 
            className="space-y-6 max-w-2xl mx-auto p-6 rounded-lg"
            style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-primary)',
                boxShadow: 'calc(var(--effect-shadows) * 0 0 30px rgba(0, 0, 0, 0.5))',
            }}
        >
            <div className="space-y-4">
                {Object.entries(entityDef.fields).map(([name, field]) => (
                    <FieldInput
                        key={name}
                        name={name}
                        field={field}
                        value={values[name]}
                        onChange={(val) => handleChange(name, val)}
                        onBlur={() => handleBlur(name)}
                        error={errors[name]}
                    />
                ))}
            </div>

            {generalError && (
                <div 
                    className="p-3 rounded text-sm animate-pulse"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'color-mix(in srgb, var(--color-status-error) 30%, transparent)',
                        color: 'var(--color-status-error)',
                    }}
                >
                    {generalError}
                </div>
            )}

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative px-6 py-2 font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
                        transition: `all var(--animation-duration-normal) var(--animation-easing)`,
                    }}
                    onMouseEnter={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.filter = 'brightness(1.2)';
                            e.currentTarget.style.boxShadow = `0 0 15px color-mix(in srgb, var(--color-accent-glow) ${100 * (1)}%, transparent)`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {mode === 'create' ? 'Summoning...' : 'Enchanting...'}
                        </span>
                    ) : (
                        <span>{mode === 'create' ? 'Summon Entity' : 'Enchant Entity'}</span>
                    )}
                </button>
            </div>
        </form>
    );
};
