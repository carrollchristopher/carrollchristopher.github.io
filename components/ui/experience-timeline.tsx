import { useEffect, useId, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ExperienceItem } from '../../types';

const PREVIEW_COUNT = 4;

// "Label: detail" bullets render the label as a lead-in.
function splitLead(text: string) {
  const match = /^([A-Z][^:]{1,38}):\s+(.+)$/.exec(text);
  return match ? { lead: match[1], rest: match[2] } : { lead: '', rest: text };
}

function TimelineEntry({ item }: { item: ExperienceItem }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  // Hiding a single bullet behind a toggle is not worth the click.
  const hidden = item.bullets.length > PREVIEW_COUNT + 1 ? item.bullets.length - PREVIEW_COUNT : 0;

  return (
    <li className="timeline-entry relative grid gap-x-14 pb-14 pl-9 last:pb-0 lg:grid-cols-[300px_minmax(0,1fr)] lg:pl-0">
      <span className="timeline-node" aria-hidden="true" />
      <div className="mb-4 lg:sticky lg:top-28 lg:mb-0 lg:self-start lg:text-right">
        <span className="inline-block px-2.5 py-1 rounded border border-blue-500/25 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider">{item.period}</span>
        <p className="mt-3 text-lg font-bold text-slate-100">{item.company}</p>
        <p className="text-sm font-medium text-slate-400">{item.location}</p>
      </div>
      <div className="min-w-0">
        <h3 className="text-2xl sm:text-[1.75rem] font-black tracking-tight mb-5">{item.role}</h3>
        <ul id={listId} className="timeline-bullets space-y-3.5" data-collapsed={!expanded && hidden > 0 ? '' : undefined}>
          {item.bullets.map((bullet) => {
            const { lead, rest } = splitLead(bullet);
            return (
              <li key={bullet} className="flex items-start gap-3 text-[0.95rem] text-slate-300 leading-relaxed">
                <ChevronRight size={16} className="mt-1 text-blue-500 shrink-0" aria-hidden="true" />
                <span>
                  {lead && <strong className="font-semibold text-slate-100">{lead}: </strong>}
                  {rest}
                </span>
              </li>
            );
          })}
        </ul>
        {hidden > 0 && (
          <button
            type="button"
            className="timeline-toggle mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/25 transition-colors"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? 'Show fewer' : `Show ${hidden} more`}
          </button>
        )}
      </div>
    </li>
  );
}

// Vertical timeline. The rail fills as the section scrolls past the middle of the viewport, and
// each node lights up once the fill reaches it.
export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const beam = beamRef.current;
    if (!list || !beam) return;
    const entries = Array.from(list.querySelectorAll<HTMLElement>('.timeline-entry'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      beam.style.transform = 'scaleY(1)';
      entries.forEach((entry) => entry.setAttribute('data-lit', ''));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const reached = window.innerHeight * 0.55 - rect.top;
      beam.style.transform = `scaleY(${Math.min(Math.max(reached / rect.height, 0), 1)})`;
      entries.forEach((entry) => entry.toggleAttribute('data-lit', entry.offsetTop <= reached));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const start = () => {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      schedule();
    };
    const stop = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };

    // Only track scrolling while the timeline is near the viewport.
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: '25% 0px',
    });
    observer.observe(list);

    return () => {
      observer.disconnect();
      stop();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative text-left [--rail-x:11px] lg:[--rail-x:327px]">
      <div className="timeline-rail" aria-hidden="true">
        <div ref={beamRef} className="timeline-beam" />
      </div>
      <ol ref={listRef}>
        {items.map((item) => (
          <TimelineEntry key={`${item.company}-${item.period}`} item={item} />
        ))}
      </ol>
    </div>
  );
}
