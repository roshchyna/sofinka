# AGENTS.md — Sofinka

Repository-wide instructions for Codex and other AI coding agents.
Sofinka is a quiz app with a question builder, lessons, and the Muza AI assistant.
Update the relevant sections of this file when changing the architecture or commands.

## Stack and configuration

- Versions below come from `package.json`; exact resolved dependency versions are in `pnpm-lock.yaml`.
- React / React DOM `^19.2.0`, TypeScript `^6.0.2` with strict type checking.
- TanStack Start `1.168.60`, Router `1.170.41`, Query `^5.100.9`.
- Tailwind CSS `^4.1.18`, Radix UI, `class-variance-authority`, `clsx`, `tailwind-merge`, Lucide.
- i18next `^26.2.0`, react-i18next `^17.0.8`.
- Vite `^8.0.0` + Nitro `3.0.260429-beta`; the project uses ESM.
- Vitest `^4.1.5`, Testing Library React `^16.3.0`, jsdom `^28.1.0`, Biome `2.4.5`.
- Environment reference: `.github/workflows/ci.yml` uses Node.js 22 and pnpm 10.33.2.

## Commands from the repository root

```sh
pnpm install --frozen-lockfile  # Install using the existing lockfile
pnpm dev                      # TanStack Start: app, SSR, and file-based API routes
pnpm dev:server               # Standalone Node generation server; defaults to localhost:3001
pnpm dev:all                  # Run the app and standalone server together
pnpm build                    # Production build; does not replace typecheck
pnpm preview                  # Preview the build locally
pnpm check                    # Biome lint, formatting, and import order checks; no writes
pnpm lint                     # Biome lint only
pnpm format --write src/ui/button.tsx  # Example: format a specific file
pnpm typecheck                # tsc --noEmit
pnpm test                     # All Vitest tests, including server/*.test.mjs
pnpm test src/components/learning/lesson-player.test.tsx  # Run a single test file
pnpm test:coverage            # Coverage; HTML report at coverage/index.html
```

- Read the app port from the `pnpm dev` output; `vite.config.ts` does not pin it.
- The client calls relative `/api/*` endpoints; built-in API routes do not require the standalone server on port 3001.
- AI features require a server-side `OPENROUTER_API_KEY` in `.env`; `OPENROUTER_MODEL` is optional.
- No E2E framework or E2E command is configured. Do not present jsdom tests as browser verification.
- CI runs `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
- `biome.json` excludes `src/styles.css` and `src/routeTree.gen.ts`; its checks do not cover `server/`.

## Code map and placement

| Location | Purpose |
| --- | --- |
| `src/ui/` | Shared primitives: Button, Card, Input, Dialog, Select, and others. Reuse these first. |
| `src/components/questions/` | Nine question types, the renderer, shared card shells, answer hooks, and Question types. |
| `src/components/constructor/` | Question editors, draft models and conversions, and the AI generation dialog. |
| `src/components/learning/` | Course overview, lesson player, worked example, summary, and persistence status UI. |
| `src/components/muza-assistant/` | Chat UI, types, state, storage, and the API client in `api.ts`. |
| `src/common/application-shell.tsx` | Shared shell, navigation, language selector, and theme controls. |
| `src/routes/` | TanStack file-based routes; localized pages live under `$language`. |
| `src/routes/api/` | Server-side HTTP handlers, including requests to OpenRouter. |
| `src/lib/` | Shared utilities and browser persistence; lesson domain logic lives in `src/lib/learning/`. |
| `src/data/` | Default questions; `src/data/courses/` contains courses and their localized copy. |
| `src/i18n/` | Language metadata, i18next setup, and UI translations in `resources.ts`. |
| `server/` | Shared server `.mjs` modules for env, prompts, JSON parsing, and normalization; standalone HTTP server. |
| `src/assets/`, `public/` | Bundler-imported assets and static files served from root-relative URLs, respectively. |
| `src/types/` | External `.d.ts` declarations; keep domain types with their feature. |

- Place new features in `src/components/<feature>/` and connect them through a route.
- Keep feature-specific hooks with their feature; put shared hooks and logic in `src/lib/` or a domain subdirectory.
- Put new client API functions in the feature's `api.ts`, following Muza's pattern.
  The generator currently keeps its fetch in `generate-questions-dialog.tsx`; do not introduce a parallel `src/api/` without a reorganization task.
- Colocate tests with the code: `*.test.ts`, `*.test.tsx`, and `*.test.mjs` for server modules.

## Architecture conventions

- Use function components and predominantly `kebab-case` filenames. Use `@/` for imports from `src`; relative imports within a feature are also acceptable.
- Local UI and forms use `useState`; lesson progress uses `useReducer` through `use-learning-session.ts`.
- QueryClient is created in `src/routes/__root.tsx`. Follow the generator's `useMutation` pattern for standard API mutations.
  Muza handles streaming separately through `api.ts`, callbacks, and `AbortSignal`.
- No form or schema library is installed: use controlled inputs, HTML validation, and the existing `question-draft.ts` conversions.
- `Question` is a discriminated union in `question-types.ts`. Do not bypass it with `any` or duplicate models.
- When adding a question type, update the renderer, editor/draft, prompt, normalizer, and relevant tests together.
- Route answer submission and rewards through `answer-state.ts`; preserve duplicate-submission protection.
- App language codes are `en`, `ua`, and `ru`; the fallback is `en`. Do not rename `ua` in routes or storage.
- Add UI copy in all three languages through `src/i18n/resources.ts`; keep lesson copy in the existing course copy modules.
- Reuse `Language`, `toLanguage`, and `getLanguageName` from `src/i18n/languages.ts`; do not duplicate language mappings.
- Use TanStack `Link` / `useNavigate` with typed params/search for navigation; preserve the language and lesson mode.
- Question storage is language-specific: `sofinka.questions.en`, `.ua`, and `.ru`.
  Lesson progress is shared across languages in `sofinka.learning.v1`, for one learner in the current browser, without cross-device sync.
- Preserve stable lesson/exercise IDs and storage compatibility. Format changes must account for existing saved data.
- Progress stores submitted answers and hint usage. Never overwrite malformed saved data with an empty state.
- Code also runs on the server: guard access to `window`, `document`, storage, and browser APIs, or access them in effects.
- Put shared server logic in `server/`; update the matching `.d.mts` when changing a `.mjs` module's interface.
- Question generation responses go through `parseModelJson` and `normalizeGeneratedResponse`; do not pass raw model output to question cards.

## Styling and accessibility

- Use Tailwind utilities, existing color/spacing scales, and `cn` from `src/utils/twMerge.ts`.
- There is no shared design-token file yet. Shared button variants are in `src/ui/button.tsx`; question palettes are in `question-theme.ts`.
- Extend existing primitive variants rather than duplicating Button/Card or introducing unrelated palettes.
- Do not add static inline styles or arbitrary hex colors/pixel spacing to new UI; use utilities and shared variants.
  Inline styles for computed values, such as background image URLs, are already used and are acceptable.
- Check light and dark themes; the `dark` and `black` variants are defined in `src/styles.css`.
- Preserve label/htmlFor associations, fieldset/legend grouping, keyboard interaction, and ARIA states in interactive components.
- Button defaults to `type="button"`; specify `type="submit"` for form submission.

## Constraints and verification

- Do not add or upgrade dependencies without explicit user approval. Use pnpm and the existing lockfile.
- Do not edit `src/routeTree.gen.ts` manually; TanStack generates it during dev/build.
- Keep secrets out of client code, `VITE_*`, logs, and commits. `OPENROUTER_API_KEY` stays on the server.
- Do not rewrite adjacent features or format the entire repository for a local change.
- `docs/` contains local documentation and has a `.gitignore` rule. Do not delete it or include its files in commits, including via `git add -f`.
- Preserve the user's uncommitted changes. Create branches, stage files, commit, or push only when requested.
- Run relevant tests for logic/UI changes; run the CI checks listed above before handing off a completed code change.
- DOM tests need the `// @vitest-environment jsdom` header; use Testing Library to verify user behavior.
- Mock network requests, rewards/animations, and browser APIs in tests; do not make paid AI requests.
- For documentation-only changes, verify commands, paths, links, and the diff; rebuilding the app is optional.
- Report the checks performed and their limitations. A successful build does not verify visual correctness or behavior on an iPhone.

## Reference files

- [Multiple-choice card](src/components/questions/multiple-choice-question-card.tsx): typed props, shared answer hook, card shell, theme, and i18n.
- [Generation dialog](src/components/constructor/generate-questions-dialog.tsx): controlled form, UI primitives, `useMutation`, and localized errors.
