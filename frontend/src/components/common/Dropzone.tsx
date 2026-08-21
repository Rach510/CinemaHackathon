import React, { useCallback, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';

interface DropzoneProps {
  file: File | null;
  onFileSelected: (file: File | null) => void;
  error?: string | null;
}

const ACCEPTED_TYPE = 'application/pdf';

export default function Dropzone({ file, onFileSelected, error }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (candidate: File | undefined | null) => {
      if (!candidate) return;
      if (candidate.type !== ACCEPTED_TYPE && !candidate.name.toLowerCase().endsWith('.pdf')) {
        setLocalError('Only .pdf files are accepted for script upload.');
        onFileSelected(null);
        return;
      }
      setLocalError(null);
      onFileSelected(candidate);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      validateAndSet(dropped);
    },
    [validateAndSet]
  );

  const displayError = error ?? localError;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
            : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex items-center gap-3 rounded-xl bg-[var(--color-bg-elevated)] px-4 py-3 shadow-card">
            <FileText size={20} className="text-[var(--color-accent)]" />
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove uploaded script"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelected(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="ml-2 rounded-full p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={28} className="mb-3 text-[var(--color-accent)]" />
            <p className="text-sm font-medium">Drag and drop your script here</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              or click to browse — .pdf only
            </p>
          </>
        )}
      </div>
      {displayError && <p className="mt-2 text-xs font-medium text-[var(--color-accent)]">{displayError}</p>}
    </div>
  );
}
