const variants = {
  primary: 'bg-teal text-white hover:bg-teal-dark border border-teal',
  dark: 'bg-ink text-white hover:bg-teal-dark border border-ink',
  outline: 'bg-white text-ink border border-line hover:border-teal hover:text-teal',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-sand',
  danger: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
