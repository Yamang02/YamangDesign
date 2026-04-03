---
name: yamang-craft
description: Use when adding a new CSS or rendering technique section to CraftLab under src/app/pages/labs/CraftLab — new craft folder, CraftSection wiring, and nav/App consistency.
source: YamangDesign E29
---

# Yamang Craft Lab Workflow

Applies when the repo contains **`src/app/pages/labs/CraftLab/`**. Aligns structurally with **`yamang-art-page-workflow`** (chapter-style narrative) but for **technique catalog** rather than artwork pages.

## Two parts (CraftLab)

| Part | Role | In CraftLab |
|------|------|-------------|
| **1 — 설명** | What & when | `CraftSection` `title` + `description` (short, when to use) |
| **2 — 참고 스니펫** | Copy-paste reference | `code` string (static example; **no interactive demo** in page) |

## Directory layout (mandatory)

```
src/app/pages/labs/CraftLab/
  CraftLab.tsx              # LabLayout + TOC; mounts each craft
  CraftSection.tsx          # Shared wrapper: description + <pre><code>
  crafts/
    {CraftName}/
      {CraftName}Craft.tsx  # Const snippet + CraftSection (CSS optional)
      index.ts              # export { XxxCraft } from './XxxCraft'
```

- One craft = one folder under `crafts/`. Keep snippet text and any craft-local constants in that folder.
- **Do not** use CraftLab for DS token exploration; use spacing/color tokens only for **layout rhythm** (`--ds-spacing-*`, etc.). Snippet content may use DS variables for consistency.

## Wiring a new craft

1. **Implement** `{CraftName}Craft.tsx` with a **`code` string** and **`CraftSection`** with stable **`id`** (matches TOC anchor).
2. **Export** from `crafts/{CraftName}/index.ts`.
3. **Mount** in `CraftLab.tsx`: import and render `<XxxCraft />` below Overview.
4. **TOC** — add `{ id: '<same-as-section-id>', label: '…' }` to `tocItems` in `CraftLab.tsx` (order = scroll order).

## Routing (single entry)

- CraftLab is reached via **`PageName` `craft`** and **`nav-categories`** Labs item `id: 'craft'`.
- Adding a craft **does not** change `App.tsx` or nav — only `CraftLab.tsx` and the new folder.

## CraftSection props (contract)

- `id: string` — section DOM id (TOC / scroll spy).
- `title: string`
- `description: React.ReactNode`
- `code: string` — displayed in `<pre><code>`

## Checklist (new craft)

- [ ] Folder under `crafts/{CraftName}/` with `*Craft.tsx`, `index.ts`
- [ ] Uses `CraftSection`; description + `code` present
- [ ] `CraftLab.tsx` imports craft and extends `tocItems`
- [ ] No direct imports from art pages (e.g. Golconda) unless explicitly shared utility
- [ ] `npm run lint` and `npx tsc --noEmit` clean

## Reference implementations

- **border-image:** `crafts/BorderImage/BorderImageCraft.tsx`
- **Pretext:** `crafts/PretextLayout/PretextLayoutCraft.tsx`

Aligned with E29 CraftLab epic — repo skill file is the source of truth; optional copy to personal `.claude/skills` for other tools.
