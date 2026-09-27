import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <p className="font-mono text-sm text-mist-faint">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-mist">Page not found</h1>
      <p className="mt-2 text-sm text-mist-dim">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-signal-soft"
      >
        Back to home
      </Link>
    </div>
  );
}
