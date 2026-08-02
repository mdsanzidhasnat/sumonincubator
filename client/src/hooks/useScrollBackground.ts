import { useEffect } from 'react';

const SCROLL_START_COLOR = { r: 0, g: 121, b: 158 };
const SCROLL_END_COLOR = { r: 255, g: 255, b: 255 };
const SCROLL_RANGE = 800;

export function useScrollBackground(): void {
  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / SCROLL_RANGE, 1);

      const r = Math.round(
        SCROLL_START_COLOR.r +
          (SCROLL_END_COLOR.r - SCROLL_START_COLOR.r) * progress
      );
      const g = Math.round(
        SCROLL_START_COLOR.g +
          (SCROLL_END_COLOR.g - SCROLL_START_COLOR.g) * progress
      );
      const b = Math.round(
        SCROLL_START_COLOR.b +
          (SCROLL_END_COLOR.b - SCROLL_START_COLOR.b) * progress
      );

      const color = `rgb(${r}, ${g}, ${b})`;
      document.documentElement.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId === 0) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}