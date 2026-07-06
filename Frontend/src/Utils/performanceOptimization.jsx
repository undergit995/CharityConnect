import React, { useEffect, useRef } from 'react';

export const PerformanceOptimizations = ({ children }) => {
  const mountTime = useRef(Date.now());

  useEffect(() => {
    // Report component mount time
    const timeToMount = Date.now() - mountTime.current;
    if (timeToMount > 3000) {
      console.warn(`Component mount time: ${timeToMount}ms`);
    }

    // Report first paint
    if (window.performance) {
      const paint = performance.getEntriesByType('paint');
      const firstPaint = paint.find(entry => entry.name === 'first-paint');
      if (firstPaint) {
        console.log(`First Paint: ${firstPaint.startTime}ms`);
      }
    }

    // Performance mark
    performance.mark('app-mounted');

    // Cleanup
    return () => {
      performance.measure('app-mount-duration', 'app-mounted');
    };
  }, []);

  return children;
};