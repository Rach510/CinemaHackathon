/**
 * hooks/useScriptEvaluation.ts
 * ---------------------------------------------------------------------------
 * Encapsulates the full submit -> poll -> result lifecycle so page
 * components never talk to services/api.ts directly. Swapping the mock
 * implementation in api.ts for real Parallel.ai calls requires zero
 * changes here, as long as the exported function signatures are kept.
 * ---------------------------------------------------------------------------
 */
import { useCallback, useRef, useState } from 'react';
import {
  fetchEvaluationResult,
  pollEvaluationStatus,
  submitScriptForEvaluation,
} from '../services/api';
import type { EvaluationJobState, ScriptSubmission } from '../types/evaluation';

const initialState: EvaluationJobState = {
  status: 'idle',
  progress: 0,
  result: null,
  error: null,
};

export function useScriptEvaluation() {
  const [state, setState] = useState<EvaluationJobState>(initialState);
  // Guards against a stale poll loop updating state after a fresh submit.
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1;
    setState(initialState);
  }, []);

  const runEvaluation = useCallback(async (submission: ScriptSubmission) => {
    const thisRun = ++runId.current;
    setState({ status: 'uploading', progress: 4, result: null, error: null });

    try {
      const { jobId } = await submitScriptForEvaluation(submission);
      if (thisRun !== runId.current) return;

      setState((s) => ({ ...s, status: 'analyzing', progress: 12 }));

      let progress = 12;
      let done = false;
      while (!done) {
        // eslint-disable-next-line no-await-in-loop
        const poll = await pollEvaluationStatus(jobId, progress);
        if (thisRun !== runId.current) return;
        progress = poll.progress;
        done = poll.done;
        setState((s) => ({ ...s, progress }));
      }

      const result = await fetchEvaluationResult(jobId, submission);
      if (thisRun !== runId.current) return;

      setState({ status: 'success', progress: 100, result, error: null });
    } catch (err) {
      if (thisRun !== runId.current) return;
      setState({
        status: 'error',
        progress: 0,
        result: null,
        error: err instanceof Error ? err.message : 'Evaluation failed. Please try again.',
      });
    }
  }, []);

  return { ...state, runEvaluation, reset };
}
