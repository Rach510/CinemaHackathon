/**
 * services/api.ts
 * ---------------------------------------------------------------------------
 * Mock service layer for the Parallel.ai integration.
 *
 * HANDOFF NOTE FOR BACKEND TEAMMATE:
 *   Every exported function below simulates network latency and returns
 *   data shaped exactly like `EvaluationResult` (see types/evaluation.ts).
 *   To wire up the real backend:
 *     1. Replace the body of `submitScriptForEvaluation` with a real
 *        `fetch`/`axios` call to the Parallel.ai task-run endpoint
 *        (multipart/form-data — title, plot, genre, language, actors,
 *        director, targetAudience, scriptFile).
 *     2. Replace `pollEvaluationStatus` with real polling (or swap to a
 *        websocket/SSE subscription) against Parallel.ai's job-status
 *        endpoint. Keep the returned shape as `EvaluationJobState`.
 *     3. Leave `useScriptEvaluation` (hooks/useScriptEvaluation.ts) as-is —
 *        it only depends on this file's exported function signatures, not
 *        on how they're implemented.
 *   No other file in the app should ever call `fetch` directly; keep all
 *   network I/O funneled through this module so it stays swappable.
 * ---------------------------------------------------------------------------
 */

import type { EvaluationResult, ScriptSubmission } from '../types/evaluation';

const NETWORK_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

/** Builds a plausible mock EvaluationResult from whatever the user typed. */
function buildMockResult(submission: ScriptSubmission): EvaluationResult {
  const structureScore = randomBetween(58, 92);
  const dialogueScore = randomBetween(55, 95);
  const originalityScore = randomBetween(50, 90);
  const pacingScore = randomBetween(60, 93);
  const scriptScore = Math.round(
    (structureScore + dialogueScore + originalityScore + pacingScore) / 4
  );

  const actorNames = submission.actors.length > 0 ? submission.actors : ['Unnamed Lead'];
  const entries = actorNames.map((name) => ({
    name,
    role: 'Lead / TBD',
    fitScore: randomBetween(55, 96),
    rationale: `${name}'s prior range suggests a workable match for the tone implied by "${
      submission.genre || 'this genre'
    }," though chemistry reads should be confirmed against the final two-hander scenes.`,
  }));
  const castChemistryScore = Math.round(
    entries.reduce((sum, e) => sum + e.fitScore, 0) / entries.length
  );

  const bands = [
    { label: '13–17', affinity: randomBetween(10, 60) },
    { label: '18–24', affinity: randomBetween(40, 95) },
    { label: '25–34', affinity: randomBetween(50, 95) },
    { label: '35–49', affinity: randomBetween(30, 80) },
    { label: '50+', affinity: randomBetween(15, 55) },
  ];
  const demographicsScore = Math.round(
    bands.reduce((sum, b) => sum + b.affinity, 0) / bands.length
  );

  const overallScore = Math.round(
    scriptScore * 0.45 + castChemistryScore * 0.35 + demographicsScore * 0.2
  );

  return {
    id: `eval_${Date.now()}`,
    submittedTitle: submission.title || 'Untitled Project',
    overallScore,
    greenlightSummary:
      overallScore >= 75
        ? `"${submission.title || 'This script'}" reads as a strong, financeable package: the central premise is clear, the cast pairing tests well, and the target audience shows healthy overlap with the story's tone. Recommend advancing to a table read.`
        : overallScore >= 55
        ? `"${submission.title || 'This script'}" has a workable core but uneven execution — dialogue and pacing need a pass before this is packageable at the top tier. Cast fit is promising enough to justify a second draft.`
        : `"${submission.title || 'This script'}" is not yet greenlight-ready. Structural issues in the current draft would need to be resolved before casting or audience-fit signal can be trusted.`,
    scriptScore,
    actorFitScore: castChemistryScore,
    demographicsScore,
    scriptQuality: {
      structureScore,
      dialogueScore,
      originalityScore,
      pacingScore,
      summary: `The three-act spine is ${
        structureScore > 75 ? 'well-proportioned' : 'present but loosely paced'
      }, with the midpoint turn landing ${
        pacingScore > 75 ? 'right on schedule' : 'later than genre convention prefers'
      }. Dialogue reads ${
        dialogueScore > 75 ? 'distinct per character' : 'serviceable, occasionally uniform across characters'
      }. Originality within the "${submission.genre || 'selected'}" genre is ${
        originalityScore > 75 ? 'a genuine differentiator' : 'moderate — several beats track close to genre norms'
      }.`,
    },
    actorFit: {
      castChemistryScore,
      entries,
      summary: `Ensemble read suggests ${
        castChemistryScore > 75 ? 'strong on-screen chemistry potential' : 'a workable but unproven pairing'
      } across the tagged cast. Recommend a chemistry read for the top two roles before final casting is locked.`,
    },
    demographics: {
      primaryAudience: submission.targetAudience || 'Adults 18-34',
      bands,
      summary: `Modeled audience affinity peaks in the 18–34 band, ${
        demographicsScore > 70 ? 'closely matching' : 'partially overlapping with'
      } the stated target audience of "${submission.targetAudience || 'General Audiences'}." International appeal for a "${
        submission.language || 'English'
      }"-language release should be validated with regional comp titles.`,
    },
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Kicks off an evaluation job.
 * BACKEND: POST multipart/form-data to Parallel.ai's /v1/evaluations
 * (or equivalent) here. Return the job id from the real response instead
 * of the mock id below.
 */
export async function submitScriptForEvaluation(
  submission: ScriptSubmission
): Promise<{ jobId: string }> {
  await wait(NETWORK_DELAY_MS);
  if (!submission.scriptFile) {
    throw new Error('A .pdf script upload is required before submission.');
  }
  return { jobId: `job_${Date.now()}` };
}

/**
 * Polls (or in the real integration, subscribes to) job progress.
 * BACKEND: swap this for a GET /v1/evaluations/:jobId/status poll loop,
 * or an SSE/websocket subscription — keep the { progress, done } shape,
 * or update `useScriptEvaluation` to match whatever you land on.
 */
export async function pollEvaluationStatus(
  jobId: string,
  progress: number
): Promise<{ progress: number; done: boolean }> {
  await wait(350);
  const next = Math.min(100, progress + randomBetween(8, 22));
  return { progress: next, done: next >= 100 };
}

/**
 * Fetches the finished result for a completed job.
 * BACKEND: GET /v1/evaluations/:jobId/result — map the Parallel.ai
 * response into `EvaluationResult` here so nothing downstream changes.
 */
export async function fetchEvaluationResult(
  jobId: string,
  submission: ScriptSubmission
): Promise<EvaluationResult> {
  await wait(400);
  return buildMockResult(submission);
}
