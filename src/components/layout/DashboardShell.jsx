import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import Wordmark from './Wordmark';

export default function DashboardShell({ title, subtitle, nav, active, onSelect, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-white lg:border-b-0 lg:border-r">
        <div className="flex h-20 items-center justify-between px-6 lg:justify-start">
          <Wordmark />
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold text-muted lg:hidden"
          >
            Log out
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-0">
          <p className="hidden px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted lg:block">
            Workspace
          </p>
          {nav.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                active === item.key
                  ? 'bg-teal-light text-teal-dark'
                  : 'text-muted hover:bg-sand hover:text-ink'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link
            to="/"
            className="hidden whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-sand hover:text-ink lg:block"
          >
            <span className="mr-2">↗</span>
            View site
          </Link>
        </nav>

        <div className="hidden border-t border-line p-5 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-light text-xs font-bold text-teal-dark">
              {user?.name?.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
              <p className="truncate text-[11px] capitalize text-muted">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-line bg-paper px-6 py-7 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">{user?.role} space</p>
          <h1 className="mt-2 text-4xl text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </header>
        <div className="px-6 py-9 sm:px-10">{children}</div>
      </div>
    </div>
  );
}
