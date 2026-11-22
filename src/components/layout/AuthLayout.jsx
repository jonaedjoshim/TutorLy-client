import Wordmark from './Wordmark';

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-teal-dark px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full border border-white/10" />

        <Wordmark light />

        <div className="relative max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Tutorly / {eyebrow}</p>
          <h2 className="mt-6 text-[52px] leading-[1.08] text-white">
            Learning works better when it is <em className="text-[#F0B27E]">personal</em>.
          </h2>
          <p className="mt-6 text-sm leading-7 text-white/70">
            We bring students and tutors together around the things that actually matter:
            the subject, the neighbourhood, and the right pace.
          </p>
          <div className="mt-10 flex items-center gap-6 border-t border-white/15 pt-6 text-xs text-white/60">
            <span>01 / Create account</span>
            <span>02 / Find your match</span>
            <span>03 / Start learning</span>
          </div>
        </div>

        <p className="relative text-xs text-white/40">Trusted by families in 86 neighbourhoods.</p>
      </aside>

      <main className="flex min-h-screen flex-col px-6 py-10 sm:px-12 lg:min-h-0 lg:justify-center lg:px-20">
        <div className="lg:hidden">
          <Wordmark />
        </div>
        <div className="mx-auto w-full max-w-md py-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{eyebrow}</p>
          <h1 className="mt-3 text-4xl leading-tight text-ink">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
          <div className="mt-9">{children}</div>
        </div>
      </main>
    </div>
  );
}
