import { useEffect, useRef, useSyncExternalStore, RefObject } from 'react';
import { usePreloadedFrames } from './usePreloadedFrames';

const MQ = '(min-width: 1024px)';
/** Re-renders only when the breakpoint is crossed, never on scroll. */
export function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => { const m = matchMedia(MQ); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); },
    () => matchMedia(MQ).matches,
    () => true
  );
}

const win = (p: number, a: number, b: number, f = 0.05) =>
  p < a ? 0 : p < a + f ? (p - a) / f : p < b - f ? 1 : Math.max(0, (b - p) / f);

interface Args {
  track: RefObject<HTMLElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  sections: RefObject<HTMLElement>[]; // 3 text sections; their first child is the glass card
  desktop: boolean;
}

/**
 * Zero-React-state scroll engine. The passive scroll listener only writes refs; a single rAF loop
 * LERPs the frame, paints the canvas (mobile) and updates text-layer opacity via direct DOM writes.
 * Returns pRef (0..1 scroll progress) for the desktop video scrubber.
 */
export function useLagFreeHeroCanvas({ track, canvasRef, sections, desktop }: Args) {
  const pRef = useRef(0);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const imagesArrayRef = usePreloadedFrames(!desktop);

  useEffect(() => {
    let raf = 0, lastDrawn = -1;
    const cache = [-1, -1, -1];
    // Progress from the 500vh container's live position in the viewport (independent of which element scrolls).
    const onScroll = () => {
      const container = track.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;
      const rawProgress = totalScrollableDistance > 0 ? -rect.top / totalScrollableDistance : 0;
      const progress = Math.min(1, Math.max(0, rawProgress));
      pRef.current = progress;
      targetFrameRef.current = progress * 119; // frame index 0..119
    };
    const measure = onScroll;
    const layers = () => {
      const p = pRef.current;
      const o = [p < 0.2 ? 1 : p < 0.25 ? (0.25 - p) / 0.05 : 0, win(p, 0.35, 0.6), p < 0.7 ? 0 : Math.min(1, (p - 0.7) / 0.05)];
      sections.forEach((r, i) => {
        if (o[i] === cache[i]) return;
        cache[i] = o[i];
        const el = r.current;
        if (!el) return;
        el.style.opacity = String(o[i]);
        el.style.visibility = o[i] > 0 ? 'visible' : 'hidden';
        el.firstElementChild?.classList.toggle('on', o[i] > 0.3);
      });
    };
    const render = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current = Math.abs(diff) < 0.001 ? targetFrameRef.current : currentFrameRef.current + diff * 0.12;
      layers();
      if (!desktop) {
        const idx = Math.min(119, Math.max(0, Math.floor(currentFrameRef.current)));
        const imgs = imagesArrayRef.current, c = canvasRef.current;
        // Use the exact frame if decoded, otherwise the nearest decoded one, so the canvas never freezes while preloading.
        let j = -1;
        for (let d = 0; d < 120 && j < 0; d++)
          for (const k of [idx - d, idx + d]) {
            const im = imgs[k];
            if (im && im.complete && im.naturalWidth) { j = k; break; }
          }
        if (c && j >= 0 && (j !== lastDrawn)) {
          const img = imgs[j];
          if (c.width !== img.naturalWidth) { c.width = img.naturalWidth; c.height = img.naturalHeight; }
          c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
          lastDrawn = j;
        }
      }
      raf = requestAnimationFrame(render);
    };
    measure();
    currentFrameRef.current = targetFrameRef.current;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [desktop]);

  return pRef;
}
