export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-sand text-teal">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l4 4" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
