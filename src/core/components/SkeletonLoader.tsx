/**
 * SkeletonLoader Component
 *
 * Theme-aware skeleton loader with bone/rib shapes and pulse animations.
 * Uses CSS variables from the theme system for colors and animations.
 * Fully accessible with ARIA attributes.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

import React from 'react';
import './SkeletonLoader.css';

/**
 * Size variants for the skeleton loader
 */
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Shape variants for the skeleton loader
 */
export type SkeletonShape = 'bone' | 'rib' | 'skull' | 'rectangle' | 'circle';

/**
 * Props for the SkeletonLoader component
 */
export interface SkeletonLoaderProps {
  /**
   * Size variant of the skeleton
   * @default 'md'
   */
  size?: SkeletonSize;

  /**
   * Shape variant of the skeleton
   * @default 'bone'
   */
  shape?: SkeletonShape;

  /**
   * Number of skeleton elements to render
   * @default 1
   */
  count?: number;

  /**
   * Custom width (CSS value)
   */
  width?: string;

  /**
   * Custom height (CSS value)
   */
  height?: string;

  /**
   * Accessible label for screen readers
   * @default 'Loading content'
   */
  ariaLabel?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SkeletonLoader Component
 *
 * Renders theme-aware skeleton loading placeholders shaped like bones, ribs, or skulls.
 * Automatically uses the current theme's colors and animations.
 *
 * @example
 * ```tsx
 * // Single bone skeleton
 * <SkeletonLoader shape="bone" size="md" />
 *
 * // Multiple rib skeletons
 * <SkeletonLoader shape="rib" count={5} />
 *
 * // Custom sized skull
 * <SkeletonLoader shape="skull" width="100px" height="100px" />
 * ```
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  size = 'md',
  shape = 'bone',
  count = 1,
  width,
  height,
  ariaLabel = 'Loading content',
  className = '',
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  const sizeClasses: Record<SkeletonSize, string> = {
    sm: 'skeleton-sm',
    md: 'skeleton-md',
    lg: 'skeleton-lg',
    xl: 'skeleton-xl',
  };

  const shapeClasses: Record<SkeletonShape, string> = {
    bone: 'skeleton-bone',
    rib: 'skeleton-rib',
    skull: 'skeleton-skull',
    rectangle: 'skeleton-rectangle',
    circle: 'skeleton-circle',
  };

  const customStyles: React.CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`skeleton-container ${className}`}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {skeletons.map((index) => (
        <div
          key={index}
          className={`skeleton ${sizeClasses[size]} ${shapeClasses[shape]}`}
          style={customStyles}
        />
      ))}
      {/* Hidden text for screen readers */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

/**
 * Specialized skeleton loader for table rows
 */
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  ariaLabel?: string;
}> = ({ rows = 5, columns = 4, ariaLabel = 'Loading table data' }) => {
  return (
    <div
      className="skeleton-table"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell">
              <div className="skeleton skeleton-md skeleton-rib" />
            </div>
          ))}
        </div>
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

/**
 * Specialized skeleton loader for card layouts
 */
export const SkeletonCard: React.FC<{
  ariaLabel?: string;
  className?: string;
}> = ({ ariaLabel = 'Loading card', className = '' }) => {
  return (
    <div
      className={`skeleton-card ${className}`}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {/* Skull header */}
      <div className="skeleton skeleton-lg skeleton-skull" />

      {/* Rib content */}
      <div className="skeleton-card-content">
        <div className="skeleton skeleton-md skeleton-rib" />
        <div className="skeleton skeleton-md skeleton-rib" style={{ width: '85%' }} />
        <div className="skeleton skeleton-md skeleton-rib" style={{ width: '90%' }} />
      </div>

      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};
