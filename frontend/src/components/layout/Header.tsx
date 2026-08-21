import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, ChevronDown, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/**
 * BACKEND HANDOFF:
 * `handleSignIn` is where the Parallel.ai OAuth flow gets triggered —
 * e.g. redirect to `/api/auth/parallel/start` or open the provider's
 * hosted auth modal via their SDK. Currently a no-op placeholder.
 */
function handleSignIn() {
  // TODO(backend): trigger Parallel.ai OAuth / auth modal flow here.
  console.info('[auth] Sign-in flow placeholder — wire up Parallel.ai OAuth here.');
}

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
  }`;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)]">
            <Clapperboard size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Coverage</span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/how-to-use" className={navLinkClasses}>
            How to Use
          </NavLink>
          <NavLink to="/evaluate" className={navLinkClasses}>
            Use App
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-full p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            onClick={handleSignIn}
            className="rounded-full border border-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
          >
            Sign In
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-1 rounded-full border border-[var(--color-border)] py-1.5 pl-1.5 pr-2.5 text-sm transition-colors hover:border-[var(--color-accent)]/50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <User size={13} />
              </span>
              <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-card"
                >
                  {/*
                    Expandable slots — add future routes (Billing,
                    Team, API Keys, etc.) as additional items here.
                  */}
                  <MenuItem label="About Me" />
                  <MenuItem label="My Evaluations" />
                  <MenuItem label="Account Settings" />
                  <MenuItem label="Sign Out" onClick={handleSignIn} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
    >
      {label}
    </button>
  );
}
