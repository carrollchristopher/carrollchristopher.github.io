import { useEffect, useRef, type ReactNode } from 'react';

// Panels marked .spot inside the group catch a soft light that follows the pointer. Each panel
// measures the pointer against its own box, so the light spills onto neighbouring panels too.
// Pointer devices with hover only; the CSS draws nothing until the group is hovered.
export function SpotlightGroup({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.spot'));
    let frame = 0;
    let x = 0;
    let y = 0;

    const update = () => {
      frame = 0;
      for (const panel of panels) {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--spot-x', `${x - rect.left}px`);
        panel.style.setProperty('--spot-y', `${y - rect.top}px`);
      }
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.addEventListener('pointermove', onMove);
    return () => {
      root.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`spot-group ${className}`}>
      {children}
    </div>
  );
}
