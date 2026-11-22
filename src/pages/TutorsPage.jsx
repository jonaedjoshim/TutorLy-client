import { useEffect, useState } from 'react';
import { Alert, Button, EmptyState, Input, Skeleton } from '../components/ui';
import TutorCard from '../components/tutors/TutorCard';
import { tutorAPI } from '../api/tutors';
import { getErrorMessage } from '../api/client';

const initialFilters = {
  subject: '',
  area: '',
  classLevel: '',
  minRate: '',
  maxRate: '',
  online: '',
  verified: '',
  sort: 'newest',
};

const selectClass =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-teal';

export default function TutorsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [tutors, setTutors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (page = 1) => {
    setLoading(true);
    setError('');

    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '')
    );
    params.page = page;
    params.limit = 9;

    try {
      const response = await tutorAPI.list(params);
      setTutors(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load tutors right now.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const update = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="border-b border-line pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">The directory</p>
        <h1 className="mt-3 text-5xl text-ink">Find a tutor who fits.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Filter by what you are studying and where you live. Contact details are only shared once you connect.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-card border border-line bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setFilters(initialFilters)}
                className="text-xs font-semibold text-teal hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Subject" name="subject" placeholder="Physics" value={filters.subject} onChange={(e) => update('subject', e.target.value)} />
              <Input label="Area" name="area" placeholder="Dhanmondi" value={filters.area} onChange={(e) => update('area', e.target.value)} />

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Class level</label>
                <select className={selectClass} value={filters.classLevel} onChange={(e) => update('classLevel', e.target.value)}>
                  <option value="">Any level</option>
                  <option value="Class 6-10">Class 6-10</option>
                  <option value="HSC">HSC</option>
                  <option value="University">University</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Min ৳" name="minRate" type="number" placeholder="0" value={filters.minRate} onChange={(e) => update('minRate', e.target.value)} />
                <Input label="Max ৳" name="maxRate" type="number" placeholder="Any" value={filters.maxRate} onChange={(e) => update('maxRate', e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Availability</label>
                <select className={selectClass} value={filters.online} onChange={(e) => update('online', e.target.value)}>
                  <option value="">Any format</option>
                  <option value="true">Online only</option>
                  <option value="false">In person</option>
                </select>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={filters.verified === 'true'}
                  onChange={(e) => update('verified', e.target.checked ? 'true' : '')}
                  className="h-4 w-4 rounded border-line accent-teal"
                />
                Verified tutors only
              </label>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              <strong className="text-ink">{pagination.total}</strong> tutor{pagination.total === 1 ? '' : 's'} found
            </p>
            <select
              className={`${selectClass} w-auto`}
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="rating">Highest rated</option>
              <option value="experience">Most experienced</option>
              <option value="rate_asc">Lowest rate</option>
              <option value="rate_desc">Highest rate</option>
            </select>
          </div>

          {error && <Alert tone="error" className="mb-5">{error}</Alert>}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-52" />
              ))}
            </div>
          ) : tutors.length === 0 ? (
            <EmptyState
              title="No tutors match those filters."
              description="Try widening the area or clearing a filter. New tutors join every week."
              action={<Button variant="outline" onClick={() => setFilters(initialFilters)}>Clear filters</Button>}
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {tutors.map((tutor) => (
                  <TutorCard key={tutor._id} tutor={tutor} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-9 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => load(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => load(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
