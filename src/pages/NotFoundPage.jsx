import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">Error / 404</p>
        <h1 className="mt-4 text-6xl text-ink">That page wandered off.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
          The link may be old, or the page may have moved. The homepage is a safe place to start again.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button size="lg">Back to homepage</Button>
        </Link>
      </div>
    </main>
  );
}
