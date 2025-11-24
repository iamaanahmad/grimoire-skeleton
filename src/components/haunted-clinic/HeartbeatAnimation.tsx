/**
 * Heartbeat Animation Component
 * 
 * SVG-based ECG line animation for the dashboard.
 * Respects prefers-reduced-motion user preference.
 * 
 * Requirements: 4.4, 8.3
 */

export function HeartbeatAnimation() {
  return (
    <div className="heartbeat-container" aria-hidden="true">
      <svg
        width="100%"
        height="100"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="heartbeat-line"
          d="M 0,50 L 100,50"
        />
      </svg>
    </div>
  );
}
