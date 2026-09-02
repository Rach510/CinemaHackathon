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
  const [signInHover, setSignInHover] = useState(false);

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
          

          {/*
            Fixed-width anchor so the button's hover expansion overlaps
            neighboring elements instead of pushing them — the profile
            dropdown to the right never moves. `w-[110px]` matches the
            collapsed button's natural width (adjust if "Sign In" copy
            or font changes).
          */}
          <div className="relative h-10 w-[140px]">
            <motion.button
              type="button"
              onClick={handleSignIn}
              onHoverStart={() => setSignInHover(true)}
              onHoverEnd={() => setSignInHover(false)}
              layout
              transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
              style={{ transformOrigin: 'left center' }}
              className={`absolute left-0 top-0 flex h-10 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-[var(--color-accent)] px-4 text-sm font-medium transition-colors ${
                signInHover
                  ? 'z-30 bg-[var(--color-accent)] text-[var(--color-bg)]'
                  : 'z-10 bg-transparent text-[var(--color-accent)]'
              }`}
            >
              <span>Sign In</span>
              {/*
                Default: compact Parallel mark (first image). On hover,
                the button expands horizontally (via the `layout` prop
                above) and swaps in the full Parallel wordmark (second
                image). `invert` recolors the monochrome PNG to stay
                legible once the button background flips to the accent
                color on hover.
              */}
              <motion.img
                layout
                src={signInHover ? '/brand/parallel-logo.png' : '/brand/parallel-mark.png'}
                alt="Parallel"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={`object-contain ${
                  signInHover ? 'h-8 w-auto invert' : 'h-9 w-8 dark:invert'
                }`}
              />
            </motion.button>
          </div>

            <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-full p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
