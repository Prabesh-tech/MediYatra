export default function Loading() {
  return (
    <main className="route-skeleton" aria-busy="true">
      <p className="visually-hidden" role="status">Loading page content</p>
      <div className="container">
        <div className="route-skeleton-banner" aria-hidden="true">
          <span className="route-skeleton-line route-skeleton-line--eyebrow" />
          <span className="route-skeleton-line route-skeleton-line--title" />
          <span className="route-skeleton-line route-skeleton-line--copy" />
          <span className="route-skeleton-line route-skeleton-line--copy route-skeleton-line--short" />
        </div>
        <div className="route-skeleton-grid" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="route-skeleton-card" key={index}>
              <span className="route-skeleton-icon" />
              <span className="route-skeleton-line route-skeleton-line--card-title" />
              <span className="route-skeleton-line route-skeleton-line--copy" />
              <span className="route-skeleton-line route-skeleton-line--short" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
