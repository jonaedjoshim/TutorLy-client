export default function Select({ label, error, hint, id, name, className = '', children, ...props }) {
  const selectId = id || name;

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          className={`appearance-none rounded-lg border bg-white py-3 pl-4 pr-10 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15 ${
            error ? 'border-red-300' : 'border-line'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </span>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
