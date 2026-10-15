export default function Loading() {
  return (
    <main className="route-loading" role="status">
      <span className="route-loading-spinner" aria-hidden="true" />
      <span className="visually-hidden">Loading page</span>
    </main>
  );
}