# YamangDesign — Claude Code

## Coding conventions

Follow **[docs/process/CODING_CONVENTIONS.md](docs/process/CODING_CONVENTIONS.md)** before editing any source file.

Key rules:
- `src/domain/**` and `src/shared/**` must not import `@app/*` (ESLint enforced)
- Run `npm run lint` before claiming work complete
- `react-hooks/exhaustive-deps` is an **error** — fix dependency arrays, don't suppress
