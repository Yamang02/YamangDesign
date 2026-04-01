---
name: yamang-art-page-workflow
description: Use when adding or restructuring a YamangDesign Art Reference Gallery page — new artwork, new style chapter flow, or three-chapter layout with ArtShell — only when this repository contains the art gallery paths below.
---

# Yamang Art Page Workflow

Applies when the project has the **YamangDesign** art gallery layout (paths below). If this repo is a boilerplate **without** `src/app/pages/art/`, confirm with the user before applying.

## Pipeline

1. **`creative-design-brainstorm`** — lock chapter structure, motion level, quotes, palette story (minimal input: image URL + design movement).
2. **`epic-lifecycle`** — CREATE_EPIC / Phase docs for the work slice.
3. Implement per rules below; use **`layered-tdd-workflow`** / **`evidence-before-completion`** as appropriate for code.

## Directory layout (mandatory)

```
src/app/pages/art/
  _shared/
    ArtShell.tsx
    ArtShell.module.css
  {ArtworkName}/
    {ArtworkName}.tsx
    {ArtworkName}.module.css
    components/
    index.ts
```

## Routing (each new artwork)

- `src/app/config/nav-categories.ts` — add under `art`
- `src/App.tsx` — extend `PageName` and `renderPage()` switch
- `src/app/pages/index.ts` — export

## Design system

- Use `--ds-spacing-*`, `--ds-text-*`, `--ds-border-radius-*` for layout/typography rhythm only.
- **Do not** change `ThemeProvider` / global token sets.
- Artwork-specific colors: **constants** in the artwork module (e.g. `MONET_PALETTE`).

## Sharing vs self-contained

- Only `_shared/ArtShell` is shared across artworks.
- All other UI for one artwork stays inside its `{ArtworkName}/` tree.
- Extract shared patterns only after a **second** artwork truly needs them.

## Three chapters

| Ch. | Intent | Elements |
|-----|--------|----------|
| **1 — The Painting** | Direct reference | Hero image, MuseumLabel (top-right), PaletteSwatchBar (bottom-left) |
| **2 — The Impression** | Borrowed imagery / interaction | Background motion, pointer interaction, glass quote card |
| **3 — The Application** | Palette × DS | Color tokens, buttons, typography, art card |

Each chapter needs `id="chapter-1"` … `chapter-3` (or project convention) so **ArtShell** intersection observer works.

## MuseumLabel (text only, top-right)

```
{Full title}
{Subtitle if any}
──────────
{Artist}
{Medium}, {Year}
```

Do **not** show collection/museum name in this label.

## Design analysis

If `src/templates/art-page-prompt.md` exists, use it for movement → tokens → component mapping.

## Checklist (new artwork)

- [ ] Design analysis per template (if present)
- [ ] Brainstorm complete; epic/Phase docs if used
- [ ] Nav + `App.tsx` + `pages/index` wired
- [ ] Artwork folder + `components/`
- [ ] Ch.1 hero + MuseumLabel + PaletteSwatchBar
- [ ] Ch.2 motion + interaction + quote card
- [ ] Ch.3 four blocks: tokens, buttons, typography, art card
- [ ] Typecheck / lint / tests per project (`tsc`, etc.) with evidence
- [ ] Commit

## Done when

- Checklist satisfied or user explicitly scoped down with docs updated.

Aligned with basis as of 2026-03 — prior yamang-art skill (distilled).
