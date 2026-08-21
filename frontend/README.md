# Coverage — Script & Cast Evaluation Platform

A production-ready React (Vite + TypeScript) frontend for a movie script and
cast evaluation tool, designed to integrate with a Parallel.ai backend.

## Stack

- React 18 + Vite + TypeScript
- `react-router-dom` v6 for routing
- Tailwind CSS (custom cinematic palette, class-based dark mode)
- `framer-motion` for transitions, progress rings, and accordions
- `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  types/evaluation.ts        # Parallel.ai payload contract (source of truth)
  services/api.ts            # Mock API layer — swap for real fetch/axios calls
  hooks/useScriptEvaluation.ts  # submit -> poll -> result lifecycle hook
  theme/ThemeContext.tsx     # light/dark theme provider (CSS variables)
  components/
    layout/Header.tsx        # global nav, sign-in, profile dropdown
    layout/Layout.tsx        # shared page shell
    common/
      Dropzone.tsx           # drag-and-drop + file picker (.pdf only)
      TagInput.tsx           # actors multi-input tag field
      ProgressBar.tsx        # animated horizontal progress bar
      CircularProgress.tsx   # animated SVG ring for the verdict score
      Accordion.tsx          # expandable breakdown sections
      LoadingOverlay.tsx     # submission loading state
  pages/
    IntroPage.tsx            # /how-to-use
    FormPage.tsx             # /evaluate
    ResultsPage.tsx          # /results
  App.tsx                    # router configuration
  main.tsx                   # app entry point
```

## Backend integration checklist (Parallel.ai)

All network I/O is funneled through `src/services/api.ts` — nothing else in
the app calls `fetch` directly, so wiring up the real backend only touches
this one file:

1. **`submitScriptForEvaluation`** — replace the mock body with a
   `multipart/form-data` POST to Parallel.ai's evaluation-run endpoint
   (title, plot, genre, language, actors, director, targetAudience,
   scriptFile). Return the real `jobId`.
2. **`pollEvaluationStatus`** — replace with real polling against the job
   status endpoint, or swap to an SSE/websocket subscription. Keep (or
   update in tandem with `useScriptEvaluation`) the `{ progress, done }`
   shape.
3. **`fetchEvaluationResult`** — map the raw Parallel.ai response into the
   `EvaluationResult` shape defined in `src/types/evaluation.ts`.
4. **Auth** — `handleSignIn` in `src/components/layout/Header.tsx` is the
   placeholder for triggering the Parallel.ai OAuth / auth modal flow.

The `EvaluationResult` type in `types/evaluation.ts` is the contract every
UI component is built against — extend it rather than renaming fields, and
the results page, breakdown cards, and accordions will pick up new data
automatically wherever it's threaded through.

## Design system

Palette (see `tailwind.config.js` and CSS variables in `src/index.css`):

| Token           | Hex       | Light mode role      | Dark mode role        |
|-----------------|-----------|-----------------------|------------------------|
| Light Neutral   | `#EEEBDD` | Primary background    | Primary text           |
| Crimson Accent  | `#810000` | Accent elements       | Elevated surface/accent|
| Deep Maroon     | `#630000` | —                      | Elevated surface       |
| Dark Charcoal   | `#1B1717` | Main text              | Primary background     |

Theme toggling flips the `dark` class on `<html>`; all components read
color via CSS variables (`var(--color-bg)`, `var(--color-accent)`, etc.)
rather than hard-coded Tailwind color classes, so the palette only needs to
be defined once in `src/index.css`.
