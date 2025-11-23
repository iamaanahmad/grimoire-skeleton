import React from 'react';

export const BoneSkeletonLoader = () => {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {/* Header "Skull" */}
            <div 
                className="h-8 rounded-md w-1/3 mb-6"
                style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border-secondary)',
                }}
            />

            {/* Ribs */}
            <div className="space-y-3">
                <div 
                    className="h-4 rounded w-full"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: 'var(--color-border-secondary)',
                    }}
                />
                <div 
                    className="h-4 rounded w-5/6"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: 'var(--color-border-secondary)',
                    }}
                />
                <div 
                    className="h-4 rounded w-full"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: 'var(--color-border-secondary)',
                    }}
                />
                <div 
                    className="h-4 rounded w-4/5"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: 'var(--color-border-secondary)',
                    }}
                />
                <div 
                    className="h-4 rounded w-full"
                    style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: 'var(--color-border-secondary)',
                    }}
                />
            </div>
        </div>
    );
};
