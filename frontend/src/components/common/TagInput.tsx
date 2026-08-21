import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 focus-within:border-[var(--color-accent)]">
      {values.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(values.filter((v) => v !== tag))}
            className="rounded-full hover:bg-[var(--color-accent)]/20"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={values.length === 0 ? placeholder : ''}
        className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
      />
    </div>
  );
}
