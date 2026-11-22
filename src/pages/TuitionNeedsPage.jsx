import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, EmptyState, Input, Skeleton } from '../components/ui';
import { postAPI } from '../api/posts';
import { getErrorMessage } from '../api/client';

export default function TuitionNeedsPage() {
  const [filters, setFilters] = useState({ subject: '', area: '', minBudget: '', maxBudget: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
    postAPI
      .list(params)
      .then((response) => {
        if (active) setPosts(response.data.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, 'Could not load tuition needs.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="border-b border-line pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">Open requests</p>
        <h1 className="mt-3 text-5xl text-ink">Tuition needs nearby.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          These requests have been reviewed by our team. If one fits, open it to see how to apply.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Input label="Subject" name="subject" placeholder="Physics" value={filters.subject} onChange={(e) => update('subject', e.target.value)} />
        <Input label="Area" name="area" placeholder="Dhanmondi" value={filters.area} onChange={(e) => update('area', e.target.value)} />
        <Input label="Min ৳" name="minBudget" type="number" placeholder="0" value={filters.minBudget} onChange={(e) => update('minBudget', e.target.value)} />
        <Input label="Max ৳" name="maxBudget" type="number" placeholder="Any" value={filters.maxBudget} onChange={(e) => update('maxBudget', e.target.value)} />
      </div>

      <div className="mt-10">
        {error && <Alert tone="error" className="mb-5">{error}</Alert>}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => <Skeleton key={item} className="h-48" />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No open requests yet."
            description="New requests appear here after review. Try again soon or clear your filters."
            action={<Button variant="outline" onClick={() => setFilters({ subject: '', area: '', minBudget: '', maxBudget: '' })}>Clear filters</Button>}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id} className="rounded-card border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl text-ink">{post.subject}</h2>
                    <p className="mt-1 text-xs text-muted">{post.classLevel} · {post.area}</p>
                  </div>
                  <Badge tone="clay">Open</Badge>
                </div>
                <p className="mt-5 line-clamp-2 text-sm leading-6 text-muted">
                  {post.description || 'No additional details shared.'}
                </p>
                <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <p className="text-xs text-muted">Budget</p>
                    <p className="text-lg font-bold text-ink">৳{post.budget.toLocaleString()}</p>
                  </div>
                  <Link to={`/needs/${post._id}`} className="text-sm font-semibold text-teal hover:underline">
                    View details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
