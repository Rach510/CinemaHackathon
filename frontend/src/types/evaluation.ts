/**
 * types/evaluation.ts
 * ---------------------------------------------------------------------------
 * Source of truth for the shape of data exchanged with the Parallel.ai
 * backend. Treat this file as the CONTRACT between frontend and backend:
 *
 *   - The backend teammate should keep the Parallel.ai response mapped to
 *     `EvaluationResult` exactly (or extend it — never silently rename
 *     fields, since every UI component below is typed against this file).
 *   - The frontend never imports raw Parallel.ai response types directly;
 *     everything is normalized to these shapes inside services/api.ts.
 * ---------------------------------------------------------------------------
 */

/** Supported dropdown values — extend freely, these are UI-only enums. */
export type Genre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Horror'
  | 'Sci-Fi'
  | 'Thriller'
  | 'Romance'
  | 'Animation'
  | 'Documentary'
  | 'Fantasy';

export type Language =
  | 'English'
  | 'Spanish'
  | 'French'
  | 'Hindi'
  | 'Mandarin'
  | 'Korean'
  | 'Japanese'
  | 'German'
  | 'Portuguese'
  | 'Other';

export type TargetAudience =
  | 'General Audiences'
  | 'Young Adult (13-17)'
  | 'Adult (18-34)'
  | 'Mature Adult (35+)'
  | 'Family';

/** Shape of the form the user submits on the /evaluate page. */
export interface ScriptSubmission {
  title: string;
  plot: string;
  genre: Genre | '';
  language: Language | '';
  actors: string[];
  director: string;
  targetAudience: TargetAudience | '';
  /** The uploaded screenplay. Restricted to application/pdf in the UI. */
  scriptFile: File | null;
}

/**
 * Age band breakdown for the "who is this actually for" read the model
 * produces from plot, tone, and comparable-title signal.
 */
export interface DemographicBand {
  label: string; // e.g. "18–24"
  affinity: number; // 0-100, model-estimated resonance for this band
}

export interface DemographicsBreakdown {
  primaryAudience: string; // e.g. "Adults 18-34, genre-savvy"
  bands: DemographicBand[];
  summary: string; // free-text rationale from Parallel.ai
}

/** Per-actor fit read against the role(s) implied by the plot/casting. */
export interface ActorFitEntry {
  name: string;
  role: string; // inferred or user-tagged role
  fitScore: number; // 0-100
  rationale: string;
}

export interface ActorFitBreakdown {
  castChemistryScore: number; // 0-100, ensemble-level read
  entries: ActorFitEntry[];
  summary: string;
}

export interface ScriptQualityBreakdown {
  structureScore: number; // 0-100
  dialogueScore: number; // 0-100
  originalityScore: number; // 0-100
  pacingScore: number; // 0-100
  summary: string; // long-form coverage note
}

/**
 * Full normalized payload returned by the backend for a completed
 * evaluation. `overallScore` drives the hero verdict ring; the three
 * `*Score` fields drive the right-column breakdown cards.
 */
export interface EvaluationResult {
  id: string;
  submittedTitle: string;
  overallScore: number; // 0-100, headline "greenlight" score
  greenlightSummary: string; // short executive verdict, 1-3 sentences
  scriptScore: number; // 0-100, mirrors scriptQuality.structureScore blend
  actorFitScore: number; // 0-100, mirrors actorFit.castChemistryScore
  demographicsScore: number; // 0-100, overall audience-match confidence
  scriptQuality: ScriptQualityBreakdown;
  actorFit: ActorFitBreakdown;
  demographics: DemographicsBreakdown;
  generatedAt: string; // ISO timestamp
}

/** Discriminated-union status for the evaluation hook / async flow. */
export type EvaluationStatus = 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';

export interface EvaluationJobState {
  status: EvaluationStatus;
  progress: number; // 0-100, drives the loading page's progress bar
  result: EvaluationResult | null;
  error: string | null;
}
