'use client';

import './LoadingSpinner.css';

/**
 * Loading spinner component for authentication checks
 */
export function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-bone"></div>
      </div>
      <p className="loading-text">Summoning your session...</p>
    </div>
  );
}
