import { useEffect, useRef, MutableRefObject } from 'react';

export const FRAME_COUNT = 120;
const url = (n: number) => `/frames/frame_${String(n).padStart(3, '0')}.webp`;

/**
 * Preloads all 120 WebP frames once into memory (imagesArrayRef[0..119]) and pre-decodes them,
 * so nothing is fetched or decoded while scrolling. Uses refs only: no React state, no re-renders.
 */
export function usePreloadedFrames(enabled: boolean): MutableRefObject<HTMLImageElement[]> {
  const imagesArrayRef = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    if (!enabled || imagesArrayRef.current.length === FRAME_COUNT) return;
    imagesArrayRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const im = new Image();
      im.src = url(i + 1);
      im.decode().catch(() => {});
      return im;
    });
  }, [enabled]);
  return imagesArrayRef;
}
