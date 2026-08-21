import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LoadingOverlayProps {
  progress: number;
  statusLabel: string;
}

const STAGES = [
  { threshold: 0, copy: 'Parsing script pages…' },
  { threshold: 30, copy: 'Reading structure and dialogue…' },
  { threshold: 60, copy: 'Cross-referencing cast against role fit…' },
  { threshold: 85, copy: 'Modeling audience demographics…' },
];

function currentStageCopy(progress: number) {
  const stage = [...STAGES].reverse().find((s) => progress >= s.threshold);
  return stage?.copy ?? STAGES[0].copy;
}

export default function LoadingOverlay({ progress, statusLabel }: LoadingOverlayProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/*
        Flexible container for a custom animation / GIF. Swap the motion
        div below for an <img src="/your-loading-loop.gif" /> or a Lottie
        player if design provides one — the layout will adapt either way.
      */}
      <motion.div
        className="mb-8 flex h-28 w-28 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--color-accent)' }}
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        <Clapperboard size={44} className="text-[var(--color-bg)]" />
      </motion.div>

      <h2 className="font-display text-2xl font-semibold">{statusLabel}</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
        {currentStageCopy(progress)}
      </p>

      <div className="mt-8 w-full max-w-sm">
        <ProgressBar progress={progress} label="Evaluation Progress" />
      </div>
    </div>
  );
}
