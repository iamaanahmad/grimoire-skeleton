import { FieldDefinition, FieldValidation } from '../types/entity';

export interface ValidationError {
    field: string;
    message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export function validateField(value: any, field: FieldDefinition): string | null {
    // 1. Required check
    if (field.required) {
        if (value === null || value === undefined || value === '') {
            return `${field.label} is required`;
        }
    }

    // Skip other validations if value is empty and not required
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const rules = field.validation;
    if (!rules) return null;

    // 2. String validations
    if (field.type === 'string') {
        const strVal = String(value);
        if (rules.minLength && strVal.length < rules.minLength) {
            return `${field.label} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && strVal.length > rules.maxLength) {
            return `${field.label} must be no more than ${rules.maxLength} characters`;
        }
        if (rules.email && !EMAIL_REGEX.test(strVal)) {
            return `${field.label} must be a valid email address`;
        }
        if (rules.url && !URL_REGEX.test(strVal)) {
            return `${field.label} must be a valid URL`;
        }
        if (rules.pattern && !rules.pattern.test(strVal)) {
            return `${field.label} is invalid`;
        }
    }

    // 3. Number validations
    if (field.type === 'number') {
        const numVal = Number(value);
        if (isNaN(numVal)) {
            return `${field.label} must be a number`;
        }
        if (rules.min !== undefined && numVal < rules.min) {
            return `${field.label} must be at least ${rules.min}`;
        }
        if (rules.max !== undefined && numVal > rules.max) {
            return `${field.label} must be no more than ${rules.max}`;
        }
    }

    // 4. Custom validation
    if (rules.custom) {
        const result = rules.custom(value);
        if (result !== true) {
            return typeof result === 'string' ? result : `${field.label} is invalid`;
        }
    }

    return null;
}

export function validateEntity(data: any, fields: Record<string, FieldDefinition>): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.entries(fields).forEach(([key, field]) => {
        const error = validateField(data[key], field);
        if (error) {
            errors[key] = error;
        }
    });

    return errors;
}
