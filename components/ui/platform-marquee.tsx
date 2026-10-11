// Rows of platform names drifting in opposite directions. Each row holds its list twice so the
// loop is seamless. The skill cards below carry the same names, so the band is hidden from
// assistive technology.
export function PlatformMarquee({ rows }: { rows: string[][] }) {
  return (
    <div className="marquee" aria-hidden="true">
      {rows.map((items, i) => (
        <div key={i} className="marquee-row">
          <div className={`marquee-track${i % 2 ? ' marquee-reverse' : ''}`} style={{ animationDuration: `${items.length * 4}s` }}>
            {[...items, ...items].map((item, j) => (
              <span key={j} className="marquee-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
