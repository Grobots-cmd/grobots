'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(max-width: ${breakpoint}px)`;
    const media = window.matchMedia(query);

    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener?.('change', update);
    // Fallback for older browsers
    media.addListener?.(update);

    return () => {
      media.removeEventListener?.('change', update);
      media.removeListener?.(update);
    };
  }, [breakpoint]);

  return { isMobile };
}


