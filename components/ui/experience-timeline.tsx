import { ChevronRight } from 'lucide-react';
import type { ExperienceItem } from '../../types';

// "Label: detail" bullets render the label as a lead-in.
function splitLead(text: string) {
  const match = /^([A-Z][^:]{1,38}):\s+(.+)$/.exec(text);
  return match ? { lead: match[1], rest: match[2] } : { lead: '', rest: text };
}

function TimelineEntry({ item }: { item: ExperienceItem }) {
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
        <ul className="space-y-3.5">
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
      </div>
    </li>
  );
}

// Vertical timeline with the period and company beside a rail.
export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="relative text-left [--rail-x:11px] lg:[--rail-x:327px]">
      <div className="timeline-rail" aria-hidden="true" />
      <ol>
        {items.map((item) => (
          <TimelineEntry key={`${item.company}-${item.period}`} item={item} />
        ))}
      </ol>
    </div>
  );
}
