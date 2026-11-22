export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-card border border-line bg-white shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}
