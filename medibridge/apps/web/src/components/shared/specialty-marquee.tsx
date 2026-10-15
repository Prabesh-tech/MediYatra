"use client";

export function SpecialtyMarquee({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <div className="specialty-marquee" role="group" aria-label={label} tabIndex={0}>
      <div className="specialty-marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="specialty-marquee-group" key={copy}>
            {items.map((item, index) => <span className="tag" key={`${copy}-${item}-${index}`}>{item}</span>)}
          </div>
        ))}
      </div>
      <ul className="visually-hidden">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
