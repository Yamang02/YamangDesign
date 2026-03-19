# P01: Lab 크롬 격리

## 목표

Lab 페이지의 정보 영역(테이블 헤더, 토큰 이름, 값 텍스트, 컨트롤)이 DS 테마 토큰(`--ds-color-*`)에 반응하지 않도록 `--shell-*` 토큰으로 전환한다. 컬러 스와치와 `[data-context="preview"]` 영역만 `--ds-*`를 유지한다.

## 구현 상세

### 전환 대상 CSS 모듈

**TokenLab.module.css** — 가장 큰 누출. 테이블 전체가 `--ds-color-*` 사용:
- `.tokenTable th` → `color: --shell-text-secondary`, `background: --shell-bg-muted`
- `.tokenTable td` → `color: --shell-text-primary`
- `.tokenTableWrap` border → `--shell-border-subtle`
- `.categoryTitle` → `--shell-text-primary`
- `.controlLabel` → `--shell-text-secondary`
- `.controlInput`, `.controlSelect` → `--shell-bg-muted`, `--shell-border-subtle`, `--shell-text-primary`
- `.groupHeaderBtn` → `--shell-text-primary`
- `.groupHeaderIcon` → `--shell-text-secondary`

**StyleLab.module.css** — 부분 누출:
- `.tokenDiffTable th` → `--shell-text-secondary`, `--shell-bg-muted`
- `.tokenDiffTable td` border → `--shell-border-subtle`
- `.tokenDiffTableWrap` border → `--shell-border-subtle`
- `.paletteSelect` → `--shell-bg-muted`, `--shell-border-subtle`
- `.styleAffinityWarning` border/bg → `--shell-border-subtle`, `--shell-bg-muted`
- `.comparisonWrapperNeutral` → `--shell-bg-muted`

### 유지 대상 (--ds-* 그대로)

- `.tokenSwatch` — 컬러 스와치 (인라인 style로 색상 표시)
- `.previewCard` — 프리뷰 카드 (`--ds-color-bg-base` 등)
- `.cardInner` — 스타일 비교 프리뷰 영역
- `.shadowDemo` — 그림자 데모 영역
- spacing/radius/font-weight 등 레이아웃 토큰 (`--ds-spacing-*`, `--ds-radius-*`, `--ds-text-*`, `--ds-font-weight-*`)은 테마 독립이므로 그대로 유지

### Component Comparison 시맨틱 변수 주입

기존: `ComparisonCard`에 `getStyleVariables()`(그림자/보더만) 전달, `ComparisonGrid`에 `paletteVars`(스케일만) 전달 → 시맨틱 변수 부재로 Button/Card가 전역 테마 색상 사용.

수정: Component Comparison의 `ComparisonCard`에 `getThemeVariables(paletteId, styleName)` 전달 → 스케일 + 시맨틱 + 스타일 변수 전체 주입. Shadow Comparison은 그림자만 보는 것이므로 기존 `getStyleVariables` 유지.

### 변경 파일

- `src/app/pages/labs/TokenLab/TokenLab.module.css` — 주요 변경
- `src/app/pages/labs/StyleLab/StyleLab.module.css` — 부분 변경
- `src/app/pages/labs/StyleLab/StyleLab.tsx` — Component Comparison에 `getThemeVariables` 적용
- `src/app/components/GenericTabs/GenericTabs.module.css` — Lab 크롬 전용 탭 → shell 토큰
- `src/app/pages/labs/DesignSettingsLab/PresetTab.module.css` — Select 컴포넌트 스코프 오버라이드
- (PaletteLab.module.css는 이미 대부분 `--shell-*` 사용 중이므로 변경 최소)

## 체크리스트

- [x] TokenLab.module.css: 테이블 헤더/셀/테두리의 `--ds-color-*` → `--shell-*` 전환
- [x] TokenLab.module.css: 컨트롤(검색, 정렬 셀렉트)의 `--ds-color-*` → `--shell-*` 전환
- [x] TokenLab.module.css: 그룹 헤더 버튼의 `--ds-color-*` → `--shell-*` 전환
- [x] StyleLab.module.css: tokenDiffTable 헤더/테두리의 `--ds-color-*` → `--shell-*` 전환
- [x] StyleLab.module.css: paletteSelect, styleAffinityWarning의 `--ds-color-*` → `--shell-*` 전환
- [x] 프리뷰 영역(`.previewCard`, `.cardInner`, `.tokenSwatch`)은 `--ds-*` 유지 확인
- [x] Component Comparison에 `getThemeVariables` 적용하여 선택 팔레트 시맨틱 변수 주입
- [x] GenericTabs.module.css: Lab 크롬 전용 탭 → `--shell-*` 전환
- [x] PresetTab.module.css: `.settingSelect`에서 Select 컴포넌트 ds-color 스코프 오버라이드
- [ ] 브라우저에서 팔레트 변경 시 정보 영역 색상 불변 + Component Comparison 팔레트 반영 확인
