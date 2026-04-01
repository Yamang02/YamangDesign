---
name: typescript-stack
description: Use when writing or reviewing TypeScript in this repo’s style — naming, files, errors, collections, and verification (tsc/tests) without a React-specific framework.
source: vibe_boilerplate@E26
---

# TypeScript Stack Workflow

Distilled from **`typescript-stack-basis`**. For **React UI**, use **`react-stack`** (it extends these rules).

## Naming (compress)

| Target | Case |
|--------|------|
| vars, functions, methods | camelCase |
| types, interfaces, classes, enums | PascalCase |
| module-level constants, env vars | UPPER_SNAKE_CASE |
| Files | kebab-case + role suffix: `.type.ts`, `.service.ts`, `.repository.ts`, `.use-case.ts`, `.dto.ts`, `.mapper.ts`, `.test.ts` |
| Directories | kebab-case |

**Boundary:** camelCase in domain/app code; map snake_case from APIs/DB in infrastructure only.

**Privacy:** prefer `#` private fields; avoid `_` prefix for “private”.

**Errors:** `throw` custom `Error` subclasses for domain failures; document recoverable vs fatal.

**Collections:** pure-transform chaining (`filter`, `map`, `sorted`, etc.) OK when each step is a single operation with no side effects. If intermediate results need a variable to understand, switch to imperative (basis CC-01-07).

## Type safety

- **Minimize `as` assertions.** Use type guards, `as const`, or return-type annotations instead. `as` allowed only at external boundaries (JSON parse, test mocks). (S4043)
- **Use type guards** (`typeof`, `instanceof`, `in`, user-defined `value is T`) to narrow union/unknown. (S4138)
- **No generic shadowing.** Inner generic params must not reuse outer scope names — use `TEntity`/`TResult`. (S4323)

## Immutability (CC-01-10, CC-04-06)

- `as const` for literal/array/object freezing: `const ROLES = ["admin", "user"] as const`
- `readonly` on interface/type fields; `ReadonlyArray<T>` for collections
- Props, DTOs, Domain Entities default to `readonly` fields

## Structure types

| Role | Pattern |
|------|---------|
| Service | `{Domain}Service` |
| Repository | `{Domain}Repository` |
| Use Case | `{Verb}{Noun}UseCase` |
| Mapper | `{Domain}Mapper` |

## Relation to other skills

- **`layered-tdd-workflow`:** Domain/Application → strict TDD; UI/infra adapters → TC-01 optional layer.
- **`evidence-before-completion`:** always run project verify before “done”.

## Verification (adjust to project)

Run **all** that apply and cite output:

```bash
# types
npx tsc --noEmit
# or: pnpm exec tsc --noEmit

# unit/integration (script from package.json)
npm test
# or: pnpm test
```

If the repo uses **Bun** / **pnpm** only, substitute the project’s documented commands.

## Done when

- Changes match naming/file rules above, errors use the agreed pattern, and verify commands were run for the claimed scope.

Aligned with basis as of 2026-03 — `docs/stack/typescript/typescript-stack-basis.md` (distill).
