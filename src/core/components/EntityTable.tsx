import React, { useState, useMemo } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { BoneSkeletonLoader } from './BoneSkeletonLoader';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { ActionButtons } from './ActionButtons';

export interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
}

interface EntityTableProps<T extends { $id: string }> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export function EntityTable<T extends { $id: string }>({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    loading = false,
    emptyMessage,
}: EntityTableProps<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const processedData = useMemo(() => {
        let processed = [...data];

        if (sortKey) {
            processed.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processed;
    }, [data, sortKey, sortOrder]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <BoneSkeletonLoader />;
    }

    if (data.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className="w-full">
            {/* Desktop Table View */}
            <div 
                data-testid="desktop-table" 
                className="hidden md:block overflow-x-auto rounded-lg"
                style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-primary)',
                    backgroundColor: 'var(--color-bg-secondary)',
                }}
            >
                <table className="w-full text-left text-sm">
                    <thead 
                        className="uppercase font-mono text-xs"
                        style={{
                            backgroundColor: 'var(--color-bg-tertiary)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-6 py-4 font-medium ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                                    style={{
                                        transition: `color var(--animation-duration-fast) var(--animation-easing)`,
                                    }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    role={col.sortable ? 'button' : undefined}
                                    tabIndex={col.sortable ? 0 : undefined}
                                    onKeyDown={(e) => {
                                        if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                                            handleSort(col.key);
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        if (col.sortable) {
                                            e.currentTarget.style.color = 'var(--color-text-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (col.sortable) {
                                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                                        }
                                    }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{col.label}</span>
                                        {sortKey === col.key && (
                                            sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody 
                        style={{
                            borderTopWidth: '1px',
                            borderTopStyle: 'solid',
                            borderTopColor: 'var(--color-border-primary)',
                        }}
                    >
                        {paginatedData.map((item) => (
                            <tr 
                                key={item.$id} 
                                className="group"
                                style={{
                                    borderBottomWidth: '1px',
                                    borderBottomStyle: 'solid',
                                    borderBottomColor: 'var(--color-border-secondary)',
                                    transition: `background-color var(--animation-duration-fast) var(--animation-easing)`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-accent-primary) 5%, transparent)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((col) => (
                                    <td 
                                        key={`${item.$id}-${String(col.key)}`} 
                                        className="px-6 py-4"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                                    </td>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <td className="px-6 py-4 text-right">
                                        <ActionButtons
                                            onView={onView ? () => onView(item) : undefined}
                                            onEdit={onEdit ? () => onEdit(item) : undefined}
                                            onDelete={onDelete ? () => onDelete(item) : undefined}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div data-testid="mobile-view" className="md:hidden space-y-4">
                {paginatedData.map((item) => (
                    <div 
                        key={item.$id} 
                        className="p-4 rounded-lg space-y-3"
                        style={{
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'var(--color-border-primary)',
                            backgroundColor: 'var(--color-bg-secondary)',
                        }}
                    >
                        {columns.map((col) => (
                            <div key={String(col.key)} className="flex justify-between items-start">
                                <span 
                                    className="text-xs font-mono uppercase"
                                    style={{ color: 'var(--color-text-tertiary)' }}
                                >
                                    {col.label}
                                </span>
                                <span 
                                    className="text-sm text-right"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                                </span>
                            </div>
                        ))}
                        {(onEdit || onDelete || onView) && (
                            <div 
                                className="pt-3 flex justify-end"
                                style={{
                                    borderTopWidth: '1px',
                                    borderTopStyle: 'solid',
                                    borderTopColor: 'var(--color-border-secondary)',
                                }}
                            >
                                <ActionButtons
                                    onView={onView ? () => onView(item) : undefined}
                                    onEdit={onEdit ? () => onEdit(item) : undefined}
                                    onDelete={onDelete ? () => onDelete(item) : undefined}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
