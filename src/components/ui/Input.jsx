export default function Input({ label, error, hint, id, className = '', ...props }) {
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/15 ${
          error ? 'border-red-300' : 'border-line'
        }`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
