import { useEffect, useRef, type ReactNode } from 'react';

const MAX_TILT_DEG = 9;

// Photo card that tilts toward the pointer with a soft sheen where the light lands.
// Pointer devices with hover only; elsewhere it is a still card.
export function ProfileCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!card || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    let px = 0.5;
    let py = 0.5;

    const update = () => {
      frame = 0;
      card.style.setProperty('--tilt-x', `${(0.5 - py) * 2 * MAX_TILT_DEG}deg`);
      card.style.setProperty('--tilt-y', `${(px - 0.5) * 2 * MAX_TILT_DEG}deg`);
      card.style.setProperty('--sheen-x', `${px * 100}%`);
      card.style.setProperty('--sheen-y', `${py * 100}%`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      px = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      py = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onEnter = () => card.setAttribute('data-active', '');
    const onLeave = () => {
      card.removeAttribute('data-active');
      px = 0.5;
      py = 0.5;
      if (!frame) frame = requestAnimationFrame(update);
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="profile-card">
      <div className="profile-card-body relative aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900">
        {children}
        <span className="profile-card-sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
