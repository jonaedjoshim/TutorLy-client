const tones = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-teal/20 bg-teal-light text-teal-dark',
  info: 'border-line bg-sand text-ink',
};

export default function Alert({ tone = 'info', children, className = '' }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]} ${className}`} role="status">
      {children}
    </div>
  );
}
