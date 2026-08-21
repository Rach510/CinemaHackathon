import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Film, TrendingUp, Users } from 'lucide-react';
import type { EvaluationResult } from '../types/evaluation';
import CircularProgress from '../components/common/CircularProgress';
import Accordion from '../components/common/Accordion';
import ProgressBar from '../components/common/ProgressBar';

interface LocationState {
  result?: EvaluationResult;
}

export default function ResultsPage() {
  const location = useLocation();
  const result = (location.state as LocationState | null)?.result;

  // No result in router state (e.g. direct navigation / refresh) — send
  // the user back to start a fresh evaluation instead of a broken page.
  if (!result) {
    return <Navigate to="/evaluate" replace />;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Coverage Report
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold">{result.submittedTitle}</h1>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Generated {new Date(result.generatedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left half — executive verdict */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center shadow-card"
        >
          <span className="mb-6 flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            <Clapperboard size={13} /> Executive Verdict
          </span>

          <CircularProgress score={result.overallScore} />

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
            {result.greenlightSummary}
          </p>

          <div className="mt-8 grid w-full grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-6">
            <MiniStat label="Script" value={result.scriptScore} />
            <MiniStat label="Cast Fit" value={result.actorFitScore} />
            <MiniStat label="Audience" value={result.demographicsScore} />
          </div>

          <Link
            to="/evaluate"
            className="mt-8 text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Run another evaluation →
          </Link>
        </motion.div>

        {/* Right half — breakdown cards */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <BreakdownCard icon={Film} title="Script Quality" score={result.scriptScore}>
            <ProgressBar progress={result.scriptQuality.structureScore} label="Structure" />
            <ProgressBar progress={result.scriptQuality.dialogueScore} label="Dialogue" />
            <ProgressBar progress={result.scriptQuality.originalityScore} label="Originality" />
            <ProgressBar progress={result.scriptQuality.pacingScore} label="Pacing" />
            <Accordion title="Full script coverage note" defaultOpen>
              {result.scriptQuality.summary}
            </Accordion>
          </BreakdownCard>

          <BreakdownCard icon={Users} title="Actor Fit" score={result.actorFitScore}>
            <ProgressBar progress={result.actorFit.castChemistryScore} label="Ensemble Chemistry" />
            {result.actorFit.entries.map((entry) => (
              <Accordion key={entry.name} title={entry.name} subtitle={entry.role}>
                <span className="mb-2 block font-mono text-xs text-[var(--color-accent)]">
                  Fit score: {entry.fitScore}/100
                </span>
                {entry.rationale}
              </Accordion>
            ))}
            <Accordion title="Ensemble summary">{result.actorFit.summary}</Accordion>
          </BreakdownCard>

          <BreakdownCard icon={TrendingUp} title="Age Demographics" score={result.demographicsScore}>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">
              Primary audience: <span className="font-medium text-[var(--color-text)]">{result.demographics.primaryAudience}</span>
            </p>
            {result.demographics.bands.map((band) => (
              <ProgressBar key={band.label} progress={band.affinity} label={band.label} />
            ))}
            <Accordion title="Audience rationale">{result.demographics.summary}</Accordion>
          </BreakdownCard>
        </motion.div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}

function BreakdownCard({
  icon: Icon,
  title,
  score,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  score: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-[var(--color-accent)]" />
          <h3 className="font-display text-lg font-semibold">{title}</h3>
        </div>
        <span className="font-mono text-sm font-semibold text-[var(--color-accent)]">{score}/100</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
