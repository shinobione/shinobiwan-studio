export function EmptyState({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="empty-state panel">
      <span className="eyebrow">{eyebrow}</span>
      <div className="empty-orbit" aria-hidden="true"><span /></div>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}
