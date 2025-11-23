import { describe, it, expect } from 'vitest';
import { validateField } from '../validators';
import { FieldDefinition } from '../../types/entity';

describe('validateField', () => {
    it('validates required fields', () => {
        const field: FieldDefinition = {
            type: 'string',
            label: 'Name',
            required: true,
        };
        expect(validateField('', field)).toBe('Name is required');
        expect(validateField(null, field)).toBe('Name is required');
        expect(validateField('John', field)).toBeNull();
    });

    it('validates string length', () => {
        const field: FieldDefinition = {
            type: 'string',
            label: 'Username',
            validation: { minLength: 3, maxLength: 10 },
        };
        expect(validateField('ab', field)).toBe('Username must be at least 3 characters');
        expect(validateField('abcdefghijk', field)).toBe('Username must be no more than 10 characters');
        expect(validateField('abc', field)).toBeNull();
    });

    it('validates number range', () => {
        const field: FieldDefinition = {
            type: 'number',
            label: 'Age',
            validation: { min: 18, max: 100 },
        };
        expect(validateField(17, field)).toBe('Age must be at least 18');
        expect(validateField(101, field)).toBe('Age must be no more than 100');
        expect(validateField(18, field)).toBeNull();
    });

    it('validates email', () => {
        const field: FieldDefinition = {
            type: 'string',
            label: 'Email',
            validation: { email: true },
        };
        expect(validateField('invalid', field)).toBe('Email must be a valid email address');
        expect(validateField('test@example.com', field)).toBeNull();
    });

    it('validates custom rules', () => {
        const field: FieldDefinition = {
            type: 'string',
            label: 'Code',
            validation: {
                custom: (val) => val === 'secret' || 'Wrong code',
            },
        };
        expect(validateField('wrong', field)).toBe('Wrong code');
        expect(validateField('secret', field)).toBeNull();
    });
});
