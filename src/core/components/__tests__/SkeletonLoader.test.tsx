/**
 * SkeletonLoader Component Tests
 *
 * Tests for the theme-aware skeleton loader component.
 * Validates accessibility, theme integration, and variant rendering.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  SkeletonLoader,
  SkeletonTable,
  SkeletonCard,
} from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<SkeletonLoader ariaLabel="Loading user data" />);

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-busy', 'true');
      expect(container).toHaveAttribute('aria-label', 'Loading user data');
    });

    it('should have default aria-label when not provided', () => {
      render(<SkeletonLoader />);

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-label', 'Loading content');
    });

    it('should have screen reader text', () => {
      render(<SkeletonLoader ariaLabel="Loading posts" />);

      const srText = screen.getByText('Loading posts');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      const { container } = render(<SkeletonLoader size="sm" />);
      const skeleton = container.querySelector('.skeleton-sm');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render medium size by default', () => {
      const { container } = render(<SkeletonLoader />);
      const skeleton = container.querySelector('.skeleton-md');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(<SkeletonLoader size="lg" />);
      const skeleton = container.querySelector('.skeleton-lg');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render extra large size', () => {
      const { container } = render(<SkeletonLoader size="xl" />);
      const skeleton = container.querySelector('.skeleton-xl');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Shape Variants', () => {
    it('should render bone shape by default', () => {
      const { container } = render(<SkeletonLoader />);
      const skeleton = container.querySelector('.skeleton-bone');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render rib shape', () => {
      const { container } = render(<SkeletonLoader shape="rib" />);
      const skeleton = container.querySelector('.skeleton-rib');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skull shape', () => {
      const { container } = render(<SkeletonLoader shape="skull" />);
      const skeleton = container.querySelector('.skeleton-skull');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render rectangle shape', () => {
      const { container } = render(<SkeletonLoader shape="rectangle" />);
      const skeleton = container.querySelector('.skeleton-rectangle');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render circle shape', () => {
      const { container } = render(<SkeletonLoader shape="circle" />);
      const skeleton = container.querySelector('.skeleton-circle');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Count Prop', () => {
    it('should render single skeleton by default', () => {
      const { container } = render(<SkeletonLoader />);
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons).toHaveLength(1);
    });

    it('should render multiple skeletons when count is specified', () => {
      const { container } = render(<SkeletonLoader count={5} />);
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons).toHaveLength(5);
    });
  });

  describe('Custom Dimensions', () => {
    it('should apply custom width', () => {
      const { container } = render(<SkeletonLoader width="200px" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('should apply custom height', () => {
      const { container } = render(<SkeletonLoader height="50px" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toHaveStyle({ height: '50px' });
    });

    it('should apply both custom width and height', () => {
      const { container } = render(
        <SkeletonLoader width="300px" height="100px" />
      );
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toHaveStyle({ width: '300px', height: '100px' });
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <SkeletonLoader className="custom-class" />
      );
      const skeletonContainer = container.querySelector('.skeleton-container');
      expect(skeletonContainer).toHaveClass('custom-class');
    });
  });
});

describe('SkeletonTable', () => {
  it('should have proper ARIA attributes', () => {
    render(<SkeletonTable ariaLabel="Loading table" />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-busy', 'true');
    expect(container).toHaveAttribute('aria-label', 'Loading table');
  });

  it('should render default 5 rows and 4 columns', () => {
    const { container } = render(<SkeletonTable />);
    const rows = container.querySelectorAll('.skeleton-table-row');
    expect(rows).toHaveLength(5);

    const firstRowCells = rows[0].querySelectorAll('.skeleton-table-cell');
    expect(firstRowCells).toHaveLength(4);
  });

  it('should render custom number of rows', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const rows = container.querySelectorAll('.skeleton-table-row');
    expect(rows).toHaveLength(3);
  });

  it('should render custom number of columns', () => {
    const { container } = render(<SkeletonTable columns={6} />);
    const rows = container.querySelectorAll('.skeleton-table-row');
    const firstRowCells = rows[0].querySelectorAll('.skeleton-table-cell');
    expect(firstRowCells).toHaveLength(6);
  });

  it('should use rib shape for cells', () => {
    const { container } = render(<SkeletonTable />);
    const ribs = container.querySelectorAll('.skeleton-rib');
    expect(ribs.length).toBeGreaterThan(0);
  });
});

describe('SkeletonCard', () => {
  it('should have proper ARIA attributes', () => {
    render(<SkeletonCard ariaLabel="Loading card" />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-busy', 'true');
    expect(container).toHaveAttribute('aria-label', 'Loading card');
  });

  it('should render skull header', () => {
    const { container } = render(<SkeletonCard />);
    const skull = container.querySelector('.skeleton-skull');
    expect(skull).toBeInTheDocument();
  });

  it('should render rib content lines', () => {
    const { container } = render(<SkeletonCard />);
    const ribs = container.querySelectorAll('.skeleton-rib');
    expect(ribs.length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonCard className="custom-card" />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toHaveClass('custom-card');
  });
});
