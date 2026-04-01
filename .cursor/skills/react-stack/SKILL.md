---
name: react-stack
description: Use when building or reviewing React + TypeScript UI — components, hooks, FSD layout, server state, and Testing Library — not Next.js-specific routing.
source: vibe_boilerplate@E26
---

# React Stack Workflow

Extends **`typescript-stack`** (apply TS naming/files first). Inherits **AC-01** (accessibility). Distilled from **`react-stack-basis`**. **Next.js**-specific conventions are **out of scope** here.

## Component naming

| Target | Rule |
|--------|------|
| Component function | PascalCase — `OrderList` |
| Component file | kebab-case — `order-list.tsx` |
| Props type | `{Name}Props` |
| Event props | `onSelect`; handlers `handleSelect` |
| Boolean props | `isDisabled`, `hasError`, `canEdit` |

## Hooks

- Name `usePurpose`; file `use-purpose.ts`; test `use-purpose.test.ts`.
- **Top-level only:** never call hooks inside conditions, loops, or nested functions. (S7786)
- **useEffect deps:** include all reactive values referenced inside the effect. Don't distort logic to fit deps — split effects or extract hooks instead. (S6660)
- **No components inside render:** define components at module scope, never inside another component's body. (S6478)

## Pattern: presentational vs container

- **Presentational:** props in, UI out; avoid side effects.
- **Container logic:** custom hooks (`useOrderList`) that fetch/state; pages compose hook + presentational components.

**Props are read-only:** never mutate props. Sort/filter → spread into new array. Use `readonly` fields + `ReadonlyArray` in Props types (CC-04-06).

**Props drilling:** max **2** levels; then Context or shared store.

## Server vs local state

- **Server data:** TanStack Query / SWR cache as **single source** — do not duplicate into global client store by default.
- After mutations: **invalidate** cache; optimistic updates only with clear rollback.
- **Local UI:** `useState` / `useReducer`; **URL:** router query/params when shareable.

## FSD layout (when using FSD)

`app/` → providers, router, global styles  
`pages/` → route screens (loading / error / empty / success)  
`widgets/`, `features/`, `entities/`, `shared/` per basis doc.

Small projects may use **Bulletproof-style** `features/` + shared `components/` instead — pick one structure per repo and stay consistent.

## Accessibility (AC-01)

- **Images:** `alt` on every `<img>`. Decorative → `alt="" aria-hidden="true"`.
- **Form labels:** `htmlFor`+`id`, or `aria-label`/`aria-labelledby`.
- **Keyboard:** prefer native `<button>`/`<a>`. If div gets interaction → add `role`, `tabIndex={0}`, `onKeyDown`.
- **Semantic HTML:** `<nav>`, `<main>`, `<section>` over `<div>` wrappers.

## Testing (UI layer, TC-01)

| Target | Tool | Focus |
|--------|------|--------|
| Presentational | Testing Library | role/text/label; `userEvent` over `fireEvent` |
| Hooks | `renderHook` | state and return values |
| Pages / flows | Testing Library + **MSW** | loading → success/error |

Prefer **MSW** for HTTP mocking in integration tests.

## Verification

```bash
npx tsc --noEmit
npm test
# or pnpm / project script
npm run lint
```

Use whatever the repo documents (`vitest`, `jest`, etc.).

## Done when

- Component/hook naming matches tables; state split correctly; tests follow Testing Library habits; commands run with evidence.

Aligned with basis as of 2026-03 — `docs/stack/react/react-stack-basis.md` (distill).
