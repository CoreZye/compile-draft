import { useState, useEffect } from 'react';

function useWindowSize() {
  // Initialize state with all common window properties
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    outerWidth: typeof window !== 'undefined' ? window.outerWidth : 0,
    outerHeight: typeof window !== 'undefined' ? window.outerHeight : 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        pixelRatio: window.devicePixelRatio,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation changes (common for mobile devices)
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;