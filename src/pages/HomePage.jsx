import { Link } from 'react-router-dom';

const requests = [
  { subject: 'Physics', classLevel: 'HSC', area: 'Dhanmondi', fee: '4,000' },
  { subject: 'English', classLevel: 'Class 9', area: 'Uttara', fee: '3,200' },
  { subject: 'Mathematics', classLevel: 'Class 6', area: 'Banani', fee: '2,800' },
];

const steps = [
  ['01', 'Say what you need', 'Subject, class, area and a budget that works for you.'],
  ['02', 'Meet the right tutor', 'Compare profiles, ratings and availability in your neighbourhood.'],
  ['03', 'Start the conversation', 'Message directly and agree on the details before the first class.'],
];

export default function HomePage() {
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
              Good teaching is <em className="text-clay">close</em> to home.
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-7 text-muted">
              Browse verified tutors in your area, compare what they teach, and reach out
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
            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm text-muted">
              <span><strong className="text-ink">1,200+</strong> tutors</span>
              <span><strong className="text-ink">86</strong> areas covered</span>
              <span><strong className="text-ink">4.8</strong> average rating</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full border border-teal/25" />
            <div className="relative rounded-card border border-line bg-white p-6 shadow-card">
              <div className="mb-6 flex items-baseline justify-between border-b border-line pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Latest nearby</p>
                  <h2 className="mt-1 text-3xl text-ink">Tuition requests</h2>
                </div>
                <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-semibold text-teal">Live</span>
              </div>
              <ul className="divide-y divide-line">
                {requests.map((request) => (
                  <li key={request.subject} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-sand text-sm font-bold text-teal">
                        {request.subject[0]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{request.subject}</p>
                        <p className="text-xs text-muted">{request.classLevel} · {request.area}</p>
                      </div>
                    </div>
                    <p className="whitespace-nowrap text-sm font-bold text-clay">
                      ৳{request.fee}<span className="font-normal text-muted">/mo</span>
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between rounded-lg bg-sand px-4 py-3 text-xs text-muted">
                <span>Updated a moment ago</span>
                <span className="font-semibold text-teal">See all requests →</span>
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
