import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../api/stats';
import { postAPI } from '../api/posts';

const steps = [
  ['01', 'Post what you need', 'Subject, class, area and a budget that works for you.'],
  ['02', 'Compare real profiles', 'Browse verified tutors, their subjects and rates in your area.'],
  ['03', 'Choose and give feedback', 'Review applications, accept a tutor, and share how it went.'],
];

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let active = true;

    statsAPI
      .get()
      .then((response) => {
        if (active) setStats(response.data.stats);
      })
      .catch(() => {
        if (active) setStats(null);
      });

    postAPI
      .list({ limit: 3 })
      .then((response) => {
        if (active) setRequests(response.data.data);
      })
      .catch(() => {
        if (active) setRequests([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const counters = [
    stats?.tutors ? { value: stats.tutors, label: 'verified tutors' } : null,
    stats?.areas ? { value: stats.areas, label: 'areas covered' } : null,
    stats?.posts ? { value: stats.posts, label: 'open requests' } : null,
    stats?.rating ? { value: stats.rating, label: 'average rating' } : null,
  ].filter(Boolean);

  return (
    <main>
      <section className="paper-grid relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-teal">
              <span className="h-px w-8 bg-teal" />
              Tuition, without the runaround
            </p>
            <h1 className="rule-tight max-w-xl text-5xl leading-[1.04] text-ink sm:text-6xl lg:text-[74px]">
              Good teaching is <em className="not-italic font-semibold text-clay">close</em> to home.
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-7 text-muted">
              Browse verified tutors in your area, compare what they teach, and connect
              directly. No middlemen, no guesswork.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/tutors" className="rounded-lg bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-dark">
                Browse tutors
              </Link>
              <Link to="/post-tuition" className="rounded-lg border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-teal">
                Post a tuition need
              </Link>
            </div>

            {counters.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm text-muted">
                {counters.map((counter) => (
                  <span key={counter.label}>
                    <strong className="text-ink">{counter.value}</strong> {counter.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full border border-teal/25" />
            <div className="relative rounded-card border border-line bg-white p-6 shadow-card">
              <div className="mb-6 flex items-baseline justify-between border-b border-line pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">From the board</p>
                  <h2 className="mt-1 text-3xl text-ink">Open tuition needs</h2>
                </div>
                <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal">Open</span>
              </div>

              {requests.length ? (
                <ul className="divide-y divide-line">
                  {requests.map((request) => (
                    <li key={request._id} className="flex items-center justify-between gap-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sand text-sm font-bold text-teal">
                          {request.subject[0]}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{request.subject}</p>
                          <p className="truncate text-xs text-muted">{request.classLevel} · {request.area}</p>
                        </div>
                      </div>
                      <p className="whitespace-nowrap text-sm font-bold text-clay">
                        ৳{request.budget?.toLocaleString('en-BD')}<span className="font-normal text-muted">/mo</span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center text-sm text-muted">
                  No open requests right now. Check back soon.
                </p>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-sand px-4 py-3 text-xs text-muted">
                <span>Posted by students</span>
                <Link to="/needs" className="shrink-0 font-semibold text-teal hover:underline">
                  See all requests →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-lg text-4xl leading-tight text-ink sm:text-5xl">
            Three steps. Then you're learning.
          </h2>
          <p className="max-w-xs text-sm leading-6 text-muted">
            We keep the process deliberately short — the important part is the teaching.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(([number, title, body]) => (
            <article key={number} className="border-t-2 border-ink pt-6">
              <span className="text-xs font-bold tracking-[0.2em] text-clay">{number}</span>
              <h3 className="mt-4 text-2xl text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
