/**
 * Loading Skeleton Components
 * 
 * Bone-themed skeleton loaders for cards, lists, and forms.
 * Implements shimmer animation and respects prefers-reduced-motion.
 * Requirements: 8.4, 11.4
 */

'use client';

/**
 * Shimmer animation wrapper for skeleton elements
 */
const ShimmerWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    {children}
    <div
      className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[var(--accent-glow,#f5f5dc60)] to-transparent"
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  </div>
);

/**
 * Card Skeleton Loader
 * Displays a bone-themed skeleton for card components
 */
export function CardSkeleton() {
  return (
    <div
      className="
        bg-[var(--bg-tertiary,#262626)] 
        border border-[var(--border-primary,#f5f5dc30)]
        rounded-lg p-4 
        space-y-4
      "
      role="status"
      aria-label="Loading card"
    >
      {/* Header "Skull" */}
      <ShimmerWrapper>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div
              className="h-6 w-2/3 rounded"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />
            <div
              className="h-5 w-1/3 rounded"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />
          </div>
          <div
            className="h-8 w-8 rounded-full"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
        </div>
      </ShimmerWrapper>

      {/* Ribs - Content lines */}
      <ShimmerWrapper>
        <div className="space-y-2">
          <div
            className="h-4 w-full rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              borderBottom: '1px solid var(--border-secondary, #d4d4c820)',
            }}
          />
          <div
            className="h-4 w-5/6 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              borderBottom: '1px solid var(--border-secondary, #d4d4c820)',
            }}
          />
          <div
            className="h-4 w-4/5 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              borderBottom: '1px solid var(--border-secondary, #d4d4c820)',
            }}
          />
        </div>
      </ShimmerWrapper>

      {/* Button skeleton */}
      <ShimmerWrapper>
        <div
          className="h-10 w-full rounded"
          style={{
            backgroundColor: 'var(--bg-secondary, #1a1a1a)',
          }}
        />
      </ShimmerWrapper>
    </div>
  );
}

/**
 * List Skeleton Loader
 * Displays a bone-themed skeleton for list items
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading list">
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerWrapper key={index}>
          <div
            className="
              bg-[var(--bg-tertiary,#262626)] 
              border border-[var(--border-primary,#f5f5dc30)]
              rounded-lg p-4
              flex items-center gap-4
            "
          >
            {/* Icon/Avatar skeleton */}
            <div
              className="h-12 w-12 rounded-full flex-shrink-0"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />

            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div
                className="h-5 w-3/4 rounded"
                style={{
                  backgroundColor: 'var(--bg-secondary, #1a1a1a)',
                }}
              />
              <div
                className="h-4 w-1/2 rounded"
                style={{
                  backgroundColor: 'var(--bg-secondary, #1a1a1a)',
                }}
              />
            </div>

            {/* Action skeleton */}
            <div
              className="h-8 w-20 rounded flex-shrink-0"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />
          </div>
        </ShimmerWrapper>
      ))}
    </div>
  );
}

/**
 * Form Skeleton Loader
 * Displays a bone-themed skeleton for form components
 */
export function FormSkeleton() {
  return (
    <div
      className="
        bg-[var(--bg-tertiary,#262626)] 
        border border-[var(--border-primary,#f5f5dc30)]
        rounded-lg p-6 
        space-y-6
      "
      role="status"
      aria-label="Loading form"
    >
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, index) => (
        <ShimmerWrapper key={index}>
          <div className="space-y-2">
            {/* Label skeleton */}
            <div
              className="h-4 w-1/4 rounded"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />
            {/* Input skeleton */}
            <div
              className="h-10 w-full rounded border"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
                borderColor: 'var(--border-primary, #f5f5dc30)',
              }}
            />
          </div>
        </ShimmerWrapper>
      ))}

      {/* Button group skeleton */}
      <ShimmerWrapper>
        <div className="flex gap-3 pt-4">
          <div
            className="h-10 w-24 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
          <div
            className="h-10 w-32 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
        </div>
      </ShimmerWrapper>
    </div>
  );
}

/**
 * Table Skeleton Loader
 * Displays a bone-themed skeleton for table components
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="
        bg-[var(--bg-tertiary,#262626)] 
        border border-[var(--border-primary,#f5f5dc30)]
        rounded-lg overflow-hidden
      "
      role="status"
      aria-label="Loading table"
    >
      {/* Table header skeleton */}
      <ShimmerWrapper>
        <div
          className="grid grid-cols-4 gap-4 p-4 border-b"
          style={{
            borderColor: 'var(--border-primary, #f5f5dc30)',
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-4 rounded"
              style={{
                backgroundColor: 'var(--bg-secondary, #1a1a1a)',
              }}
            />
          ))}
        </div>
      </ShimmerWrapper>

      {/* Table rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <ShimmerWrapper key={rowIndex}>
          <div
            className="grid grid-cols-4 gap-4 p-4 border-b"
            style={{
              borderColor: 'var(--border-secondary, #d4d4c820)',
            }}
          >
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 rounded"
                style={{
                  backgroundColor: 'var(--bg-secondary, #1a1a1a)',
                  width: colIndex === 0 ? '80%' : colIndex === 3 ? '60%' : '100%',
                }}
              />
            ))}
          </div>
        </ShimmerWrapper>
      ))}
    </div>
  );
}

/**
 * Stats Card Skeleton Loader
 * Displays a bone-themed skeleton for statistics cards
 */
export function StatsCardSkeleton() {
  return (
    <div
      className="
        bg-[var(--bg-tertiary,#262626)] 
        border border-[var(--border-primary,#f5f5dc30)]
        rounded-lg p-6
      "
      role="status"
      aria-label="Loading statistics"
    >
      <ShimmerWrapper>
        <div className="space-y-3">
          {/* Icon skeleton */}
          <div
            className="h-10 w-10 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
          {/* Value skeleton */}
          <div
            className="h-8 w-20 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
          {/* Label skeleton */}
          <div
            className="h-4 w-32 rounded"
            style={{
              backgroundColor: 'var(--bg-secondary, #1a1a1a)',
            }}
          />
        </div>
      </ShimmerWrapper>
    </div>
  );
}
