'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter - Animates a number from 0 to target value
 * 
 * Features:
 * - Smooth easing animation
 * - Respects prefers-reduced-motion
 * - Supports prefix/suffix for currency/percentage
 */
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // If reduced motion, just set the value immediately
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    // Easing function for smooth animation
    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      setDisplayValue(easedProgress * value);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, reducedMotion]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={className} data-testid="animated-counter">
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

export default AnimatedCounter;
