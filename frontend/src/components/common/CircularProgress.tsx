import { motion } from 'framer-motion';

interface CircularProgressProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function CircularProgress({
  score,
  size = 220,
  strokeWidth = 14,
  label = 'Overall Score',
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 75 ? 'Greenlight' : clamped >= 55 ? 'Conditional' : 'Needs Work';

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-charcoal/10 dark:text-neutral/10"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-display text-5xl font-semibold"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {Math.round(clamped)}
        </motion.span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          {label}
        </span>
        <span
          className="mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor:
              clamped >= 75 ? '#16653420' : clamped >= 55 ? '#a1620020' : '#81000020',
            color: clamped >= 75 ? '#166534' : clamped >= 55 ? '#a16200' : 'var(--color-accent)',
          }}
        >
          {tone}
        </span>
      </div>
    </div>
  );
}
