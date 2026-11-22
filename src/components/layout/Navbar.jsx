import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import Wordmark from './Wordmark';

const dashboardPath = (role) => {
  if (role === 'tutor') return '/tutor/dashboard';
  if (role === 'admin') return '/admin';
  return '/student/dashboard';
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Wordmark />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <Link to="/tutors" className="transition hover:text-teal">Find a tutor</Link>
          <Link to="/needs" className="transition hover:text-teal">Tuition needs</Link>
          <Link to="/post-tuition" className="transition hover:text-teal">Post a need</Link>
          <Link to="/how-it-works" className="transition hover:text-teal">How it works</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link
                to={dashboardPath(user.role)}
                className="px-3 py-2 text-sm font-semibold text-ink hover:text-teal"
              >
                {user.name.split(' ')[0]}’s space
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-ink hover:text-teal">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-line p-2 text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-5 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <Link to="/tutors" className="text-sm font-semibold text-ink" onClick={() => setOpen(false)}>Find a tutor</Link>
            <Link to="/post-tuition" className="text-sm font-semibold text-ink" onClick={() => setOpen(false)}>Post a need</Link>
            {user ? (
              <>
                <Link to={dashboardPath(user.role)} className="text-sm font-semibold text-ink" onClick={() => setOpen(false)}>
                  My dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-ink" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="text-sm font-semibold text-teal" onClick={() => setOpen(false)}>Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
