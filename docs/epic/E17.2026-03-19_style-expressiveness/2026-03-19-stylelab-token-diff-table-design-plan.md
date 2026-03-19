# StyleLab Token Diff Table Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
>
> **Goal:** Add a new “Token Diff” section to `StyleLab` that shows value-based diffs for the semantic alias tokens (TokenLab `aliasGroups`) across the preset styles, using the currently selected style card as the base.
>
> (Note: this plan assumes no test harness is configured; verification uses `eslint` + `tsc`/`vite build`.)

## Goal
`StyleLab`에서 사조 비교 시, 선택된 기준 사조를 기준으로 TokenLab에서 노출되는 semantic alias 토큰들의 **값 차이(diff)** 를 표 형태로 제공한다.

## Architecture
1. 토큰 범위는 `src/app/content/labs/token-lab/categories.json`의 `aliasGroups[].tokens`를 flatten하여 고정한다(= TokenLab UI와 1:1 매칭).
2. 값은 DOM `getComputedStyle` 대신 도메인 계산을 사용한다. `src/domain/themes/token-set.ts`의 `buildThemeAndTokenSet(paletteDef, styleDef)`로 각 스타일의 `tokenSet.semanticVars`를 생성한 뒤, diff 테이블에 필요한 토큰만 뽑는다.
3. 렌더링은 `StyleLab.tsx`에 신규 `LabSection`을 추가하고, 테이블은 전용 컴포넌트(`TokenDiffTable.tsx`)로 분리한다.

## Tech Stack
- React + TypeScript
- Vite
- eslint
- 도메인 함수: `buildThemeAndTokenSet`, `comparisonPresets`, `palettePresets`, `stylePresets`

---

## Task 1: Token 범위(semantic alias) + diff 데이터 생성 로직

### Files
- Create: `src/app/pages/labs/StyleLab/TokenDiffTable.tsx`
- Modify: `src/app/pages/labs/StyleLab/StyleLab.tsx` (Task 3에서 사용)

### Step 1: 토큰 목록 flatten 구현
1. `TokenDiffTable.tsx`에서 `categories.json`을 import한다.
2. `aliasGroups`를 flatten해서 `string[] tokens`를 만든다.
3. 토큰 배열은 memoization(`useMemo`)으로 고정한다.

### Step 2: style별 semanticVars 값 생성
1. 기준 palette는 `comparisonPresets.palettes[0]`로 고정한다.
2. paletteDef = `palettePresets[basePaletteId]`, styleDef = `stylePresets[styleName]`를 사용한다.
3. 각 `styleName`에 대해 `buildThemeAndTokenSet(paletteDef, styleDef).tokenSet.semanticVars`를 생성한다.
4. diff 테이블용 값은 `tokens`에 대해 `semanticVars[token]`를 매핑한다.
5. 누락 값은 `'(미정의)'`로 치환한다.

### Step 3: diff 계산(값 비교)
1. baseStyle이 아닌 다른 style들에 대해 `baseValue !== compareValue`이면 diff 표시를 한다.
2. 비교 로직은 문자열 그대로 비교(정규화 정책은 별도 요구사항이 없으므로 현재 값 그대로).

### Step 4: 데이터 반환 구조 설계
- `rows`: 각 row는 `{ token, baseValue, valuesByStyleName }` 형태로 구성

---

## Task 2: TokenDiffTable UI 렌더링

### Files
- Modify: `src/app/pages/labs/StyleLab/StyleLab.module.css` (Task 4에서 추가 스타일 반영)
- Modify: `src/app/pages/labs/StyleLab/TokenDiffTable.tsx`

### Step 1: 표 레이아웃
1. 테이블 헤더는 고정 컬럼으로 구성한다:
   - 1열: token name
   - N열: `comparisonPresets.styles` 각 스타일의 값
2. baseStyle 컬럼/셀은 강조하지 않고, baseStyle 대비 달라진 셀만 highlight 한다.

### Step 2: token name display
1. `--ds-` 접두어를 제거한 표시(`token.replace(/^--ds-/, '')`)를 사용한다.
2. Token 값은 모노스페이스로 표시(`ui-monospace, ...`).

### Step 3: highlight 스타일
1. highlight class는 `tokenDiffCellDifferent`로 설계한다.
2. baseStyle과 값이 같은 셀은 highlight하지 않는다.

---

## Task 3: StyleLab에 Token Diff 섹션 통합

### Files
- Modify: `src/app/pages/labs/StyleLab/StyleLab.tsx`

### Step 1: TOC 항목 추가
1. `tocItems`에 `id: 'token-diff', label: 'Token Diff'`를 추가한다.

### Step 2: 신규 LabSection 추가
1. `ComparisonCard` 섹션들(Shadow/Component) 아래쪽에 신규 `LabSection`을 추가한다.
2. baseStyle은 현재 `selectedStyle`로 사용한다.
3. `selectedStyle === null`이면:
   - 기본 값은 `comparisonPresets.styles[0]`를 base로 사용하거나,
   - 혹은 “기준 사조를 선택하세요” 안내를 보여준다(둘 중 하나를 선택).

### Step 3: TokenDiffTable 렌더
1. `<TokenDiffTable baseStyle={selectedStyle ?? comparisonPresets.styles[0]} />` 형태로 호출한다.

---

## Task 4: Styling 반영

### Files
- Modify: `src/app/pages/labs/StyleLab/StyleLab.module.css`

### Step 1: diff 셀 스타일 추가
1. `.tokenDiffCellDifferent` 클래스 추가:
   - 배경색: `var(--shell-bg-primary-subtle)` 또는 `var(--ds-color-bg-primary-subtle)` 계열 중 프로젝트 토큰에 맞게 선택
   - 텍스트색/테두리: 기존 테이블 스타일과 충돌하지 않게 최소 조정
2. 표의 폰트/컬럼 폭은 기존 `tokenTable` 패턴을 재사용한다.

---

## Task 5: 문서(P05) 정합성 확인(값 기반 diff 테이블)

### Files
- Modify: `docs/epic/E17.2026-03-19_style-expressiveness/P05-token-display-sort.md`

### Step 1: diff 설명이 “값 기반 table + base/compare 값 표시”와 일치하는지 확인

---

## Task 6: 검증(명령 실행)

### Step 1: lint
- Run: `npm run lint`
- Expected: eslint no errors

### Step 2: build
- Run: `npm run build`
- Expected: TypeScript compile + vite build pass

---

## Execution Hand-off
Plan complete.

Two execution options:
1. Subagent-Driven (this session) - I will dispatch fresh subagent per task with review between tasks.
2. Parallel Session (separate worktree) - Open a new session in a separate worktree.

Which approach? (1 or 2)

