# AGENTS.md

## Repository structure

The application lives at the repository root.

## Commands

All commands run from the repository root:

```bash
npm install            # install deps
npm run lint    # Type-check only (tsc --noEmit; no ESLint/Prettier configured)
npm run build   # Vite build + esbuild bundle of server.ts -> dist/server.cjs
npm run dev     # Start dev server (tsx server.ts, port 3000)
npm run start   # Run production build (node dist/server.cjs)
npm run clean   # Clean build artifacts (rm -rf dist server.js)
```

There are no tests, no test runner, and no CI workflows.

## Architecture

- **Framework**: React 19 + Vite + Tailwind CSS v4 + TypeScript
- **Server**: Express (`server.ts`) serving both API routes and Vite dev middleware
- **Database**: Supabase (Postgres) with automatic in-memory mock fallback when env vars are missing. The fallback is in `src/backendDb_supa.ts` — the `MockDatabaseEngine` class.
- **AI integration**: The Gemini dependency (`@google/genai`) is installed and `metadata.json` declares server-side Gemini capability, but no endpoint is implemented — `server/routes/system.ts` only exposes `GET /api/system/state`
- **Entry point**: `index.html` → `src/main.tsx` → `src/App.tsx`

## Key gotchas

- **HMR disabled by default in dev**: `vite.config.ts` disables HMR and file watching when `DISABLE_HMR=true` (set by AI Studio). If you need live reload, ensure that env var is unset.
- **Mock auth**: Tokens are `mock-jwt-token-for-{userId}` — not real JWTs. `getUserIdFromAuth` in `server/middleware/auth.ts` strips the prefix and validates the user exists (returns `null` otherwise).
- **No real login**: `loginUser` accepts any username/email that exists in the DB — no password verification on login (password is only validated at registration for length >= 6).
- **Environment validation in `backendDb_supa.ts`**: The `usingSupabase` check looks for placeholder values like `MY_`, `<`, or `your-` in env vars and falls back to mock if detected. Copy `.env.example` → `.env.local` and replace with real values.
- **Required env vars for Supabase**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. For Gemini AI features: `GEMINI_API_KEY`.
- **Supabase DB functions**: The Supabase engine calls RPC functions (`increment_user_streak_and_xp`, `increment_verifier_xp`) — these must exist in your Supabase project's database.
- **Build output**: `npm run build` produces `dist/server.cjs` (CJS bundle) for production — the Vite build goes to `dist/` as well.

## Conventions

- Single-file components in `src/components/`
- API routes are split under `server/routes/` (`auth`, `challenges`, `system`, `upload`) and mounted in `server.ts`
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not the older PostCSS setup)
- No ESLint or Prettier — only type-checking via `tsc --noEmit`
