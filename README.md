# Sofinka

[![CI](https://github.com/roshchyna/sofinka/actions/workflows/ci.yml/badge.svg)](https://github.com/roshchyna/sofinka/actions/workflows/ci.yml)

Sofinka is a multilingual quiz app for kids. It includes a play mode, a question constructor, local per-language question storage, and an optional AI generator for creating new quiz questions.

The app supports English, Ukrainian, and Russian. Switching the language also switches the active saved question set.

## Links

- Repository: https://github.com/roshchyna/sofinka
- CI: https://github.com/roshchyna/sofinka/actions/workflows/ci.yml
- Live demo: Not deployed yet

## Screenshots

Screenshots should be added after deployment so recruiters can scan the product quickly:

- Home/play mode: `docs/screenshots/home.png`
- Question constructor: `docs/screenshots/constructor.png`
- AI generation dialog: `docs/screenshots/generate-questions.png`

## Product Scope

- Play quizzes with instant feedback.
- Create, edit, delete, and restore questions in the constructor.
- Generate questions by topic, age, language, count, and question type.
- Persist custom questions in local storage by selected language.
- Switch between English, Ukrainian, and Russian.
- Toggle light and dark themes.

Supported question types:

- Single choice
- Multiple choice
- True or false
- Matching
- Ordering
- Sorting
- Text input
- Image choice
- Odd one out

## Architecture

- `src/routes` contains TanStack Router routes, including localized app pages and API route handlers.
- `src/components/questions` contains reusable question renderers and answer-state logic.
- `src/components/constructor` contains the editor flow for creating and updating each question type.
- `src/lib` contains browser persistence helpers for language, age, and question storage.
- `src/i18n` contains language metadata and UI translations.
- `server` contains shared AI prompt, parsing, normalization, and environment helpers used by API routes and tests.

## Technical Decisions

- React and TanStack Router provide route-level structure while keeping the UI component model simple.
- TypeScript is strict and checked separately from the production build.
- i18next keeps UI copy and language routing explicit.
- Local storage is used for a lightweight portfolio-friendly persistence model.
- OpenRouter is isolated behind server-side handlers so API keys are not exposed to the browser.
- Vitest covers business logic, storage helpers, question rendering behavior, AI payloads, JSON parsing, and generated-question normalization.
- Biome handles formatting and lint checks with a fast single-tool workflow.

## UX, AI, and i18n Work

- Kid-friendly quiz feedback with clear correct/incorrect states.
- Constructor supports multiple question shapes without forcing one generic editor UI.
- Generated AI output is parsed and normalized before entering the app state.
- Question storage is language-specific, so Ukrainian, English, and Russian content do not overwrite each other.
- Language codes are mapped to full language names before AI generation requests.
- Theme is applied before hydration to avoid a visible flash of the wrong theme.

## Tech Stack

- React
- TanStack Start and TanStack Router
- TypeScript
- Tailwind CSS
- i18next and react-i18next
- TanStack Query
- Vitest
- Biome
- OpenRouter

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the frontend:

```bash
pnpm dev
```

Start the AI backend in a second terminal:

```bash
pnpm dev:server
```

The frontend runs on `http://localhost:5173`.
The AI backend runs on `http://localhost:3001`.

## Environment

Question generation needs an OpenRouter API key.

Create a `.env` file in the project root:

```bash
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=openrouter/free
```

`OPENROUTER_MODEL` is optional. If it is not set, the server uses `openrouter/free`.

## Scripts

```bash
pnpm dev           # Start the frontend
pnpm dev:server    # Start the AI backend
pnpm build         # Build for production
pnpm test          # Run Vitest tests
pnpm test:coverage # Run tests with coverage
pnpm check         # Run Biome checks
pnpm typecheck     # Run TypeScript checks
pnpm format        # Format files with Biome
pnpm lint          # Run Biome lint
```

## Quality Checks

Run the same checks locally before opening a pull request:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

Generate a coverage report:

```bash
pnpm test:coverage
```

The HTML coverage report is written to `coverage/index.html`.

## GitHub Actions

CI runs on every push and pull request. The workflow installs dependencies with `pnpm install --frozen-lockfile` and then runs:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

## Testing

The test suite covers:

- Generated question normalization
- Model JSON parsing
- Language helpers and local storage
- Question storage by language
- Answer correctness helpers
- Question card behavior
- AI generation request payloads

## Production Notes

The frontend is ready to build, but the AI backend is still a local Node server. Before deploying the full app, the generation endpoint should be moved to a production backend or converted into a serverless/API route.

Keep `OPENROUTER_API_KEY` on the server only. It should never be exposed to the browser.
