import { Link } from 'react-router-dom';
import { Badge } from '../ui';

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function TutorCard({ tutor }) {
  const name = tutor.user?.name || 'Tutor';

  return (
    <Link
      to={`/tutors/${tutor._id}`}
      className="group block overflow-hidden rounded-card border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-teal/50"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-light text-sm font-bold text-teal-dark">
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg text-ink group-hover:text-teal">{name}</h3>
              <p className="mt-0.5 truncate text-xs text-muted">{tutor.headline || tutor.qualification || 'Tutor'}</p>
            </div>
            {tutor.verified && <Badge tone="teal" className="shrink-0">Verified</Badge>}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(tutor.subjects || []).slice(0, 4).map((subject) => (
              <span key={subject} className="rounded-md bg-sand px-2 py-1 text-[11px] font-medium text-ink">
                {subject}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <div className="text-xs text-muted">
              <p>{tutor.area || 'Area not set'} {tutor.online ? '· Online' : ''}</p>
              <p>{tutor.experience || 0} yrs experience</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-ink">৳{tutor.hourlyRate || '—'}</p>
              <p className="text-[11px] text-muted">per hour</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
