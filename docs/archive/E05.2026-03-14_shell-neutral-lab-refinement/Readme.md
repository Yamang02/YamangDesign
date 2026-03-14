# Epic E05: Shell Neutral & Lab Refinement

## 목표

앱 셸 토큰(`--shell-*`)의 액션/호버 컬러를 브랜드 색에서 중립 회색 계열로 전환하여,
어떤 팔레트를 선택해도 셸 크롬이 항상 일관된 UX를 제공하도록 한다.
동시에 각 Lab 페이지·컴포넌트의 UX 의도가 명확히 전달되지 않는 부분을 개선한다.

## 배경 / 맥락

E04(Token Layer Separation) 완료 후 `--shell-*` 네임스페이스로 정비된 상태.
현재 `--shell-action-primary`, `--shell-border-hover/focus`, `--shell-focus-ring`,
`--shell-bg-hover`, `--shell-text-hover` 등이 기본 팔레트 브랜드 그린(`#5F9070`)으로
하드코딩되어 있다. 셸 크롬은 테마와 독립적이어야 하므로 이 의존성을 제거한다.

페이지 정비와 함께 진행하는 이유: 셸 중립화로 인터페이스 전반을 다시 보게 되는 시점에,
각 Lab 페이지에서 UX 의도가 불명확한 부분(StyleLab shadow 데모, FontLab Detail 날것 출력,
TokenLab 미완성 섹션, Playground 컬럼 목적 불명)을 함께 해소한다.

## 특이점

**Shell 중립화 방향:**
- 주 액션(`--shell-action-primary/hover/active`) → 진한 중립 회색 (`#374151` 계열)
- 호버 하이라이트(`--shell-bg-hover`, `--shell-text-hover`) → 브랜드와 어울리는 중립 색. 현재 기본 팔레트가 sage green 계열이므로 warm slate(`#475569`) 방향으로 결정.
- 포커스 링(`--shell-focus-ring`, `--shell-border-focus`) → `#374151` (진한 중립 회색)
- `--shell-action-active` → 현재 `#A8E6C7` (밝은 민트) → `#d1d5db` (밝은 회색)

**Shell vs DS 경계 (E04 원칙 유지):**
- `[data-shell]` 내부: 색상 → `--shell-*`, 프리미티브 → `--ds-*` 그대로
- `[data-context="preview"]` 내부: 모두 `--ds-*` (테마 반응형 유지)

**StyleLab shadow 데모:**
- 현재 shadow demo 박스가 `var(--shell-shadow-*)` 고정값 사용 → 스타일 변경 시 shadow가 바뀌지 않음
- ComparisonCard의 `styleVars`로 주입된 스타일 변수 내 shadow를 `var(--ds-shadow-*)` 로 참조하도록 수정

**FontLab Detail:**
- `JSON.stringify` 원시 출력 → 구조화된 토큰 테이블로 교체

**TokenLab Global Tokens:**
- color 5개만 표시 → spacing, motion, typography 카테고리 추가 (토큰 계층 전체 반영)

**Playground 컬럼 의도:**
- Brand/System 두 컬럼이 동일 themeVars를 받아 외관이 동일 → 컬럼 타이틀·설명 강화 및 System 컬럼 배경을 neutral surface로 구분

## Phase 목록

- [P01: Shell 액션/호버 토큰 중립화](./P01.shell-action-neutral.md)
- [P02: StyleLab shadow 데모 수정](./P02.stylelab-shadow-demo.md)
- [P03: FontLab Detail 구조화](./P03.fontlab-detail-structure.md)
- [P04: TokenLab Global 섹션 확장](./P04.tokenlab-global-expand.md)
- [P05: Playground 컬럼 의도 명확화](./P05.playground-column-intent.md)

## 검토 보완 (구현 전 참고)

- **P01**: 영향 범위에 PaletteLab 전반·Components 쇼케이스·모달·DetailPanel 등 추가됨. 모두 `:root` 참조라 구현은 `shell-variables.css`만 수정하면 됨. Readme의 "warm slate (#475569)"와 P01 테이블의 `#1f2937`/`rgba(55,65,81)` 불일치 — 의도적으로 중립 회색으로 갈 경우 P01 값 유지.
- **P04**: Typography 대표 토큰은 `variables.css`의 shorthand(`--ds-text-xs/sm/md/lg`, `--ds-font-sans/mono`)와 일치함. Motion은 `--ds-duration-fast/normal/slow`, `--ds-ease-easeOut/productive` 등 `variables.css`·ThemeProvider 주입 이름과 맞춤. TokenLab Component Inspector에 `useTheme()` + `getThemeVariables(palette, style)` 주입 시 테마 전환 반영 가능.

## 상태

- [x] P01 완료
- [x] P02 완료 — E06 P02(StyleLab 재설계)에서 흡수 처리
- [x] P03 완료
- [x] P04 완료 — E06 P03(TokenLab 3-레이어)에서 흡수 처리
- [ ] P05 완료
