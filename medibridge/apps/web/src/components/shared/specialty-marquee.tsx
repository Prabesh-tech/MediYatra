export function SpecialtyMarquee({ items, label }: { items: readonly string[]; label: string }) {
  const rows = [
    items.slice(0, 4),
    items.slice(4, 8),
    items.slice(8),
  ];

  return (
    <div className="specialty-marquee" role="group" aria-label={label}>
      {rows.map((row, rowIndex) => (
        <div className={`specialty-marquee-row specialty-marquee-row-${rowIndex + 1}`} key={rowIndex}>
          <div className="specialty-marquee-track">
            {row.map((item) => <span className="tag" key={`${rowIndex}-${item}`}>{item}</span>)}
            {row.map((item) => <span className="tag" key={`${rowIndex}-copy-${item}`} aria-hidden="true">{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
