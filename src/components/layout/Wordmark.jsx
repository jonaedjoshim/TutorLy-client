import { Link } from 'react-router-dom';

export default function Wordmark({ light = false, compact = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Tutorly home">
      <span className={`grid h-9 w-9 place-items-center rounded-[10px] ${light ? 'bg-white/10' : 'bg-teal'}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M5 7h14v2.5H5z" fill={light ? '#F7F6F2' : '#F7F6F2'} />
          <path d="M5 11.5h9v2.5H5z" fill="#C2603A" />
          <path d="M5 16h12v2.5H5z" fill="#F7F6F2" opacity="0.85" />
        </svg>
      </span>
      {!compact && (
        <span className={`text-[19px] font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
          tutorly
        </span>
      )}
      {!compact && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-clay" />}
    </Link>
  );
}
