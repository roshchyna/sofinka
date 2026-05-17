# Sofinka

Sofinka is a small quiz app for kids. It has a play mode, a question constructor, and an optional AI-powered generator for creating new quiz questions.

The app currently supports English, Ukrainian, and Russian. Questions are stored locally per language, so switching the app language also switches the active question set.

## What It Does

- Play quizzes with instant feedback.
- Create and edit questions in the constructor.
- Generate new questions by topic, age, language, count, and question type.
- Switch between English, Ukrainian, and Russian.
- Save questions in local storage.
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

## Tech Stack

- React
- TanStack Start and TanStack Router
- TypeScript
- Tailwind CSS
- i18next and react-i18next
- TanStack Query
- Vitest
- Biome
- OpenRouter for question generation

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
pnpm dev          # Start the frontend
pnpm dev:server   # Start the AI backend
pnpm build        # Build for production
pnpm test         # Run Vitest tests
pnpm check        # Run Biome checks
pnpm format       # Format files with Biome
pnpm lint         # Run Biome lint
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

Run tests with:

```bash
pnpm test
```

## Production Notes

The frontend is ready to build, but the AI backend is still a local Node server. Before deploying the full app, the generation endpoint should be moved to a production backend or converted into a serverless/API route.

Keep `OPENROUTER_API_KEY` on the server only. It should never be exposed to the browser.
