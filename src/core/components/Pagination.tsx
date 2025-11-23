import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const buttonStyle = {
        padding: '0.5rem',
        borderRadius: '0.375rem',
        borderWidth: '1px',
        borderStyle: 'solid' as const,
        borderColor: 'var(--color-border-primary)',
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-secondary)',
        transition: `all var(--animation-duration-fast) var(--animation-easing)`,
        cursor: 'pointer',
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={buttonStyle}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
                onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                }}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <span 
                className="text-sm font-mono"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                Page <span style={{ color: 'var(--color-text-primary)' }}>{currentPage}</span> of <span style={{ color: 'var(--color-text-tertiary)' }}>{totalPages}</span>
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={buttonStyle}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
                onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                }}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
