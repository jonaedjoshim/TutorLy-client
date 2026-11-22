import { Link } from 'react-router-dom';
import Wordmark from './Wordmark';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-sm leading-6 text-muted">
            A quieter way to find good teaching close to home. Built for students and tutors in Bangladesh.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">Explore</p>
            <Link to="/tutors" className="text-muted hover:text-teal">Find a tutor</Link>
            <Link to="/post-tuition" className="text-muted hover:text-teal">Post a need</Link>
            <Link to="/how-it-works" className="text-muted hover:text-teal">How it works</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">Account</p>
            <Link to="/login" className="text-muted hover:text-teal">Log in</Link>
            <Link to="/register" className="text-muted hover:text-teal">Join Tutorly</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted">
          © {new Date().getFullYear()} Tutorly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
