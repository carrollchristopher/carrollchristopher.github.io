import { useEffect, useRef } from 'react';

const DURATION_MS = 1400;

// Counts a stat like "75K+" up from zero the first time it scrolls into view. The markup always
// holds the final value, and a stat already on screen when the page loads is left alone.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!el || !match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = Number(match[1]);
    const suffix = match[2];
    let frame = 0;
    let first = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.isIntersecting) return observer.disconnect();
          el.textContent = `0${suffix}`;
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">{value}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
