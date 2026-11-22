import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Skeleton } from '../components/ui';
import { postAPI } from '../api/posts';
import { getErrorMessage } from '../api/client';

export default function TuitionNeedDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    postAPI
      .getById(id)
      .then((response) => {
        if (active) setPost(response.data.post);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load this request.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-6 py-12"><Skeleton className="h-72" /></main>;
  }

  if (error || !post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Alert tone="error">{error || 'Request not found.'}</Alert>
        <Link to="/needs" className="mt-6 inline-block text-sm font-semibold text-teal">← All requests</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/needs" className="text-sm font-semibold text-teal hover:underline">← All requests</Link>

      <div className="mt-6 rounded-card border border-line bg-white p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone="clay">Open request</Badge>
            <h1 className="mt-4 text-4xl text-ink">{post.subject}</h1>
            <p className="mt-2 text-sm text-muted">{post.classLevel} · {post.area} · {post.medium}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Monthly budget</p>
            <p className="text-3xl font-bold text-ink">৳{post.budget.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-9 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Schedule</h2>
            <p className="mt-3 text-sm text-ink">{post.daysPerWeek} day{post.daysPerWeek > 1 ? 's' : ''} per week</p>
            <p className="mt-1 text-sm text-muted">
              {post.preferredDays?.length ? post.preferredDays.join(', ') : 'Days flexible'}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Tutor preference</h2>
            <p className="mt-3 text-sm capitalize text-ink">{post.tutorGender === 'any' ? 'No preference' : post.tutorGender}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Details</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            {post.description || 'No additional details were shared with this request.'}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
          <p className="text-sm text-muted">
            Posted by <strong className="text-ink">{post.student?.name}</strong> · {post.student?.location || 'Area not set'}
          </p>
          <Link to="/login">
            <Button>Log in to apply</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
