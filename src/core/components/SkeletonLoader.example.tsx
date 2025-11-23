/**
 * SkeletonLoader Examples
 *
 * Demonstrates various uses of the SkeletonLoader component
 * with different shapes, sizes, and configurations.
 */

import React from 'react';
import {
  SkeletonLoader,
  SkeletonTable,
  SkeletonCard,
} from './SkeletonLoader';

export const SkeletonLoaderExamples: React.FC = () => {
  return (
    <div className="space-y-12 p-8">
      {/* Basic Shapes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Shapes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Bone (Default)</h3>
            <SkeletonLoader shape="bone" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Rib</h3>
            <SkeletonLoader shape="rib" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Skull</h3>
            <SkeletonLoader shape="skull" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Rectangle</h3>
            <SkeletonLoader shape="rectangle" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Circle</h3>
            <SkeletonLoader shape="circle" />
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Small</h3>
            <SkeletonLoader size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Medium (Default)</h3>
            <SkeletonLoader size="md" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Large</h3>
            <SkeletonLoader size="lg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Extra Large</h3>
            <SkeletonLoader size="xl" />
          </div>
        </div>
      </section>

      {/* Multiple Skeletons */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Multiple Skeletons</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">5 Ribs</h3>
            <SkeletonLoader shape="rib" count={5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">3 Bones</h3>
            <SkeletonLoader shape="bone" count={3} />
          </div>
        </div>
      </section>

      {/* Custom Dimensions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Dimensions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Custom Width</h3>
            <SkeletonLoader width="50%" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Custom Height</h3>
            <SkeletonLoader height="100px" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Custom Width & Height</h3>
            <SkeletonLoader width="300px" height="150px" shape="rectangle" />
          </div>
        </div>
      </section>

      {/* User Profile Loading */}
      <section>
        <h2 className="text-2xl font-bold mb-4">User Profile Loading</h2>
        <div className="flex items-start gap-4 p-6 border border-neutral-700 rounded-lg">
          <SkeletonLoader shape="skull" size="xl" />
          <div className="flex-1 space-y-3">
            <SkeletonLoader shape="bone" width="60%" size="lg" />
            <SkeletonLoader shape="bone" width="40%" size="sm" />
            <SkeletonLoader shape="rib" count={3} />
          </div>
        </div>
      </section>

      {/* Article List Loading */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Article List Loading</h2>
        <div className="space-y-4">
          <SkeletonCard ariaLabel="Loading article 1" />
          <SkeletonCard ariaLabel="Loading article 2" />
          <SkeletonCard ariaLabel="Loading article 3" />
        </div>
      </section>

      {/* Table Loading */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Table Loading</h2>
        <SkeletonTable rows={5} columns={4} ariaLabel="Loading tournament data" />
      </section>

      {/* Dashboard Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dashboard Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard ariaLabel="Loading stat card 1" />
          <SkeletonCard ariaLabel="Loading stat card 2" />
          <SkeletonCard ariaLabel="Loading stat card 3" />
        </div>
      </section>

      {/* Mixed Content */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Mixed Content Loading</h2>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <SkeletonLoader shape="bone" size="xl" width="40%" />
            <SkeletonLoader shape="rib" width="60%" className="mt-2" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <SkeletonLoader shape="circle" size="lg" />
              <SkeletonLoader shape="bone" />
            </div>
            <div className="space-y-2">
              <SkeletonLoader shape="circle" size="lg" />
              <SkeletonLoader shape="bone" />
            </div>
            <div className="space-y-2">
              <SkeletonLoader shape="circle" size="lg" />
              <SkeletonLoader shape="bone" />
            </div>
          </div>

          {/* Footer */}
          <SkeletonLoader shape="rib" count={2} />
        </div>
      </section>

      {/* Skull Sizes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Skull Sizes</h2>
        <div className="flex items-end gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Small</h3>
            <SkeletonLoader shape="skull" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Medium</h3>
            <SkeletonLoader shape="skull" size="md" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Large</h3>
            <SkeletonLoader shape="skull" size="lg" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Extra Large</h3>
            <SkeletonLoader shape="skull" size="xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonLoaderExamples;
