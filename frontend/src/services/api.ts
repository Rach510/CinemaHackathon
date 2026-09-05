import type {
  EvaluationResult,
  ScriptSubmission,
} from '../types/evaluation';

const API_URL = '/api';

/**
 * Sends the movie information to our FastAPI backend.
 *
 * Flow:
 * Frontend → FastAPI → Parallel → Gemini → EvaluationResult
 */
export async function submitScriptForEvaluation(
  submission: ScriptSubmission
): Promise<{ jobId: string }> {

  if (!submission.scriptFile) {
    throw new Error('A .pdf script upload is required before submission.');
  }

  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: submission.title,
      plot: submission.plot,
      genre: submission.genre,
      language: submission.language,
      actors: submission.actors,
      director: submission.director,
      target_audience: submission.targetAudience,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Backend error (${response.status}): ${errorText || 'Unknown error'}`
    );
  }

  const result: EvaluationResult = await response.json();

  /*
   * Store the completed evaluation temporarily.
   *
   * The existing frontend hook expects a jobId and polling lifecycle,
   * so we adapt the synchronous backend response to that interface.
   */
  const jobId = `completed_${Date.now()}`;

  sessionStorage.setItem(
    `evaluation_${jobId}`,
    JSON.stringify(result)
  );

  return { jobId };
}


/**
 * Our backend currently returns the complete result immediately.
 *
 * We keep the existing polling interface so we don't have to rewrite
 * the rest of the frontend.
 */
export async function pollEvaluationStatus(
  jobId: string,
  progress: number
): Promise<{ progress: number; done: boolean }> {

  if (progress >= 90) {
    return {
      progress: 100,
      done: true,
    };
  }

  return {
    progress: 100,
    done: true,
  };
}


/**
 * Gets the result saved by submitScriptForEvaluation().
 */
export async function fetchEvaluationResult(
  jobId: string,
  _submission: ScriptSubmission
): Promise<EvaluationResult> {

  const stored = sessionStorage.getItem(`evaluation_${jobId}`);

  if (!stored) {
    throw new Error('Evaluation result could not be found.');
  }

  return JSON.parse(stored) as EvaluationResult;
}
