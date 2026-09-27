import { Link, NavLink } from 'react-router-dom';
import { ShieldHalf } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/security', label: 'Security' },
  { to: '/about', label: 'About' },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-900/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldHalf className="h-6 w-6 text-signal" strokeWidth={2} />
          <span className="font-display text-lg font-semibold tracking-tight text-mist">
            TraceGuard
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-mist' : 'text-mist-dim hover:text-mist'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/scan"
          className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-soft"
        >
          Scan My Email
        </Link>
      </div>
    </header>
  );
}
