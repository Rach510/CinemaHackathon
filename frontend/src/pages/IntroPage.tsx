import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, PlayCircle,  Sparkles, } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: '',
    body: 'Enter your title, plot, genre, language, target audience, and tag the actors attached to the project. Upload the screenplay as a .pdf.',
  },

  {
    icon: Sparkles,
    title: '',
    body: 'Get one overall score plus expandable breakdowns for script quality, actor fit, and audience demographics — ready to share.',
  },
];

export default function IntroPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-14 max-w-2xl"
      >
        <span className="font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Coverage
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          A studio-grade script read, in minutes, not weeks.
        </h1>
        <p className="mt-4 text-base text-[var(--color-text-muted)]">
          Coverage runs your script and casting through the same evaluation lens as a
          professional reader's report — structure, dialogue, cast fit, and audience
          match — so you can walk into the room with data behind your pitch.
        </p>
        <Link
          to="/evaluate"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.02]"
        >
          Start an evaluation
        </Link>
      </motion.div>

      

      {/* Step-by-step documentation cards */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">How Coverage Works</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-card"
          >
            <step.icon size={22} className="mb-4 text-[var(--color-accent)]" />
            <h3 className="font-display text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{step.body}</p>
          </motion.div>
          
        ))}
      </div>
      {/* Video walkthrough placeholders */}
      <h2 className="font-display text-2xl font-semibold">|</h2>
      <div className="mb-16 grid grid-cols-1 gap-7 dm:grid-cols-2">
        <VideoPlaceholder
          title=" "
          // Swap the <video> src below for the real hosted asset.
        />
      </div>
    </div>
  );
}

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-card">
      <div className="relative flex aspect-video items-center justify-center bg-[var(--color-surface-strong)]/5">
        {/*
          Placeholder <video> element. Replace `src` with the real hosted
          walkthrough asset (and add a poster image) when available.
        */}
        <video className="h-full w-full object-cover" controls poster="" preload="none">
          <source src="" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
        <PlayCircle
          size={48}
          className="pointer-events-none absolute text-[var(--color-accent)] opacity-70"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

function IframePlaceholder({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-card">
      <div className="aspect-video bg-[var(--color-surface-strong)]/5">
        {/* Placeholder iframe — point src at a hosted (e.g. YouTube/Vimeo) embed URL. */}
        <iframe
          className="h-full w-full"
          title={title}
          src="about:blank"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}
