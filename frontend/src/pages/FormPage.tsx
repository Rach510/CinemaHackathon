import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Genre, Language, ScriptSubmission, TargetAudience } from '../types/evaluation';
import { useScriptEvaluation } from '../hooks/useScriptEvaluation';
import Dropzone from '../components/common/Dropzone';
import TagInput from '../components/common/TagInput';
import LoadingOverlay from '../components/common/LoadingOverlay';

const GENRES: Genre[] = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy',
];
const LANGUAGES: Language[] = [
  'English', 'Spanish', 'French', 'Hindi', 'Mandarin', 'Korean', 'Japanese', 'German', 'Portuguese', 'Other',
];
const AUDIENCES: TargetAudience[] = [
  'General Audiences', 'Young Adult (13-17)', 'Adult (18-34)', 'Mature Adult (35+)', 'Family',
];

const emptySubmission: ScriptSubmission = {
  title: '',
  plot: '',
  genre: '',
  language: '',
  actors: [],
  director: '',
  targetAudience: '',
  scriptFile: null,
};

export default function FormPage() {
  const navigate = useNavigate();
  const { status, progress, error, result, runEvaluation } = useScriptEvaluation();
  const [form, setForm] = useState<ScriptSubmission>(emptySubmission);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const isBusy = status === 'uploading' || status === 'analyzing';

  useEffect(() => {
    if (status === 'success' && result) {
      // Hand the finished evaluation to the results page via router state.
      navigate('/results', { state: { result } });
    }
  }, [status, result, navigate]);

  if (isBusy) {
    return (
      <LoadingOverlay
        progress={progress}
        statusLabel={status === 'uploading' ? 'Uploading your script…' : 'Running coverage analysis…'}
      />
    );
  }

  const update = <K extends keyof ScriptSubmission>(key: K, value: ScriptSubmission[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.plot.trim() || !form.genre || !form.language) {
      setFormError('Title, plot, genre, and language are required.');
      return;
    }
    if (!form.scriptFile) {
      setFileError('Please attach the screenplay as a .pdf before submitting.');
      return;
    }

    await runEvaluation(form);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Submit for Coverage
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold">Evaluate a script</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Fill in the project details below. All fields inform the coverage read — the
          more complete, the sharper the verdict.
        </p>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-card sm:p-8"
      >
        <Field label="Title">
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. The Last Reel"
            className={inputClasses}
          />
        </Field>

        <Field label="Plot">
          <textarea
            value={form.plot}
            onChange={(e) => update('plot', e.target.value)}
            placeholder="A one-to-two paragraph synopsis…"
            rows={5}
            className={`${inputClasses} resize-y`}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Genre">
            <select
              value={form.genre}
              onChange={(e) => update('genre', e.target.value as Genre)}
              className={inputClasses}
            >
              <option value="">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Language">
            <select
              value={form.language}
              onChange={(e) => update('language', e.target.value as Language)}
              className={inputClasses}
            >
              <option value="">Select a language</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Actors" hint="Press Enter or comma to add each name">
          <TagInput
            values={form.actors}
            onChange={(v) => update('actors', v)}
            placeholder="Type an actor's name…"
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Director">
            <input
              type="text"
              value={form.director}
              onChange={(e) => update('director', e.target.value)}
              placeholder="e.g. Jordan Kim"
              className={inputClasses}
            />
          </Field>

          <Field label="Target Audience">
            <select
              value={form.targetAudience}
              onChange={(e) => update('targetAudience', e.target.value as TargetAudience)}
              className={inputClasses}
            >
              <option value="">Select an audience</option>
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Script Upload" hint="PDF only">
          <Dropzone
            file={form.scriptFile}
            onFileSelected={(f) => {
              setFileError(null);
              update('scriptFile', f);
            }}
            error={fileError}
          />
        </Field>

        {formError && (
          <p className="rounded-lg bg-[var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
            {formError}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-[var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-bg)] transition-transform hover:scale-[1.01]"
        >
          Run coverage
        </button>
      </form>
    </div>
  );
}

const inputClasses =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-muted)]';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-[var(--color-text-muted)]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
