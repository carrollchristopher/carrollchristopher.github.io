import { useEffect, useRef, useState } from 'react';

interface SectionNavProps {
  items: { id: string; label: string }[];
  active: string;
}

// Desktop section links with one highlight that slides to the active link instead of jumping.
export function SectionNav({ items, active }: SectionNavProps) {
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const [box, setBox] = useState({ x: 0, w: 0 });
  const [visible, setVisible] = useState(false);
  const placed = useRef(false);

  useEffect(() => {
    const measure = () => {
      // Before anything is active the highlight rests on the first link, so its first appearance
      // fades in place. With no section active (the hero) it fades out where it is.
      const el = links.current.get(active) ?? (placed.current ? undefined : links.current.get(items[0].id));
      if (el) {
        setBox({ x: el.offsetLeft, w: el.offsetWidth });
        placed.current = true;
      }
      setVisible(links.current.has(active));
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, items]);

  return (
    <div className="relative flex items-center gap-1">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-md bg-white/[0.07] transition-[transform,width,opacity] duration-300 ease-out"
        style={{ width: box.w, transform: `translateX(${box.x}px)`, opacity: visible ? 1 : 0 }}
      />
      {items.map(({ id, label }) => (
        <a
          key={id}
          ref={(el) => {
            if (el) links.current.set(id, el);
            else links.current.delete(id);
          }}
          href={`#${id}`}
          aria-current={active === id ? 'location' : undefined}
          className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-colors ${active === id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
