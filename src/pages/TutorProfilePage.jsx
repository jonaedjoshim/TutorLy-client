import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Skeleton } from '../components/ui';
import { tutorAPI } from '../api/tutors';
import { reviewAPI } from '../api/reviews';
import { getErrorMessage } from '../api/client';

export default function TutorProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);

    tutorAPI
      .getById(id)
      .then(async (response) => {
        if (!active) return;
        setProfile(response.data.profile);

        try {
          const reviewResponse = await reviewAPI.list(response.data.profile.user?._id);
          if (active) setReviews(reviewResponse.data.data);
        } catch {
          if (active) setReviews([]);
        }
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load this tutor.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Skeleton className="h-72" />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Alert tone="error">{error || 'Tutor not found.'}</Alert>
        <Link to="/tutors" className="mt-6 inline-block text-sm font-semibold text-teal">
          ← Back to tutors
        </Link>
      </main>
    );
  }

  const name = profile.user?.name || 'Tutor';

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link to="/tutors" className="text-sm font-semibold text-teal hover:underline">
        ← All tutors
      </Link>

      <section className="mt-6 rounded-card border border-line bg-white p-8 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-light text-lg font-bold text-teal-dark">
              {name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl text-ink">{name}</h1>
                {profile.verified && <Badge tone="teal">Verified</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted">
                {profile.headline || profile.qualification || 'Tutor'} · {profile.area || 'Area not set'}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                <span><strong className="text-ink">{profile.experience || 0}</strong> years teaching</span>
                <span><strong className="text-ink">{profile.ratingAvg || '—'}</strong> average rating</span>
                <span>{profile.online ? 'Available online' : 'In-person sessions'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-ink">৳{profile.hourlyRate || '—'}</p>
            <p className="text-xs text-muted">per hour</p>
            <Link to="/post-tuition" className="mt-4 inline-block">
              <Button size="sm">Post a need</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-card border border-line bg-white p-8">
          <h2 className="text-2xl text-ink">About</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            {profile.bio || 'This tutor has not written a bio yet. Ask them about their teaching approach when you connect.'}
          </p>

          <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-ink">Subjects</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.subjects || []).length ? (
              profile.subjects.map((subject) => (
                <span key={subject} className="rounded-lg bg-sand px-3 py-1.5 text-xs font-medium text-ink">
                  {subject}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted">Not listed yet.</p>
            )}
          </div>

          <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-ink">Class levels</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.classLevels || []).length ? (
              profile.classLevels.map((level) => (
                <span key={level} className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted">
                  {level}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted">Not listed yet.</p>
            )}
          </div>

          <div className="mt-9 border-t border-line pt-7">
            <h2 className="text-2xl text-ink">What students say</h2>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No reviews yet. Feedback appears here after a confirmed tuition.</p>
            ) : (
              <ul className="mt-5 divide-y divide-line">
                {reviews.map((review) => (
                  <li key={review._id} className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-ink">{review.student?.name || 'Student'}</p>
                      <span className="rounded-full bg-teal-light px-2.5 py-1 text-xs font-bold text-teal-dark">
                        {review.rating}/5
                      </span>
                    </div>
                    {review.comment && <p className="mt-2 text-sm leading-6 text-muted">“{review.comment}”</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="rounded-card border border-line bg-sand p-7">
          <h2 className="text-2xl text-ink">A good fit?</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Tell us what you need and tutors can reach out. You agree on the details before any class begins.
          </p>
          <Link to="/post-tuition" className="mt-6 block">
            <Button className="w-full">Post a tuition need</Button>
          </Link>
          <p className="mt-4 text-center text-[11px] text-muted">
            Contact details stay private until you connect.
          </p>
        </aside>
      </div>
    </main>
  );
}
