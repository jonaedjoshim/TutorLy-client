import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert, Badge, Button, Skeleton } from '../components/ui';
import { postAPI } from '../api/posts';
import { applicationAPI } from '../api/applications';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TuitionNeedDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

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

  const handleApply = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      await applicationAPI.apply({ postId: id, message });
      toast.success('Application sent. Good luck!');
      setMessage('');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send your application.'));
    } finally {
      setBusy(false);
    }
  };

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

        <div className="mt-9 border-t border-line pt-7">
          <p className="text-sm text-muted">
            Posted by <strong className="text-ink">{post.student?.name}</strong> · {post.student?.location || 'Area not set'}
          </p>

          {user?.role === 'tutor' ? (
            <form onSubmit={handleApply} className="mt-6 rounded-lg bg-sand p-5">
              <label htmlFor="apply-message" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
                A short note to the student
              </label>
              <textarea
                id="apply-message"
                rows="3"
                placeholder="Tell them how you would approach this tuition…"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-teal"
              />
              <Button type="submit" className="mt-4" disabled={busy}>
                {busy ? 'Sending…' : 'Apply for this tuition'}
              </Button>
            </form>
          ) : user?.role === 'student' ? (
            <p className="mt-5 text-sm text-muted">
              This request is open to tutors.{' '}
              <Link to="/post-tuition" className="font-semibold text-teal hover:underline">Post your own need →</Link>
            </p>
          ) : (
            <Link to="/login" className="mt-6 inline-block">
              <Button>Log in to apply</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
