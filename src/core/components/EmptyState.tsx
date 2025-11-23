import React from 'react';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    message = "Nothing to see here... yet.",
    action
}) => {
    return (
        <div 
            className="flex flex-col items-center justify-center py-12"
            style={{ color: 'var(--color-text-tertiary)' }}
        >
            <div className="relative">
                <Ghost 
                    className="w-16 h-16 mb-4 animate-float" 
                    style={{ color: 'var(--color-text-tertiary)' }}
                />
                <div 
                    className="absolute -bottom-2 w-12 h-2 blur-md rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--color-bg-primary)', opacity: 0.2 }}
                />
            </div>
            <p 
                className="text-lg font-medium mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                {message}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
