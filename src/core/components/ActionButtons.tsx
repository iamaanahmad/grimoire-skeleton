import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex items-center space-x-1">
            {onView && (
                <button
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    className="p-1.5 rounded transition-colors"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.color = 'var(--color-status-info)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                    title="View Details"
                    aria-label="View Details"
                >
                    <Eye className="w-4 h-4" />
                </button>
            )}

            {onEdit && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 rounded transition-colors"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.color = 'var(--color-status-warning)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                    title="Edit"
                    aria-label="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}

            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 rounded transition-colors"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.color = 'var(--color-status-error)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                    title="Delete"
                    aria-label="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
