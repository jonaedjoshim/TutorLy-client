const tones = {
  neutral: 'bg-sand text-ink',
  teal: 'bg-teal-light text-teal-dark',
  clay: 'bg-clay-light text-clay',
  outline: 'border border-line text-muted',
};

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
