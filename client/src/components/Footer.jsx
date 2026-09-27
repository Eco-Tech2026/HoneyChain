import { Link } from 'react-router-dom';
import { ShieldHalf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-mist-dim sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldHalf className="h-4 w-4 text-signal" />
          <span>TraceGuard — an informational exposure scanner, not a security guarantee.</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/privacy" className="hover:text-mist">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-mist">Terms</Link>
          <Link to="/security" className="hover:text-mist">Security</Link>
          <Link to="/how-it-works" className="hover:text-mist">How It Works</Link>
        </div>
      </div>
    </footer>
  );
}
