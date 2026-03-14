# Epic E04: Token Layer Separation

## 목표

CSS 토큰 네임스페이스를 세 레이어로 명확히 분리하고, 각 레이어의 사용 규칙을 코드 수준에서 강제한다.

- `--shell-*` : 앱 셸 레이어 (고정 라이트, 테마 무관) — 구 `--ui-*`
- `--ds-*` : 디자인 시스템 레이어 (테마 반응형 + 프리미티브) — 유지
- `--sys-*` : 시스템 레이어 (error/warning/success/info, 테마 무관) — 구 `--ds-color-system-*`

## 배경 / 맥락

기존 `--ui-*` / `--ds-*` 이분법은 의도는 있었으나 몇 가지 문제가 있었다.

1. `--ui-*` 접두사가 "UI" 전반을 의미하는 것처럼 읽혀 앱 셸 전용임이 불명확했다.
2. `[data-ui]` 컨텍스트 내부 CSS 파일들이 `--ds-color-*`를 그대로 사용해, 실제로는 고정값으로 해석되는데 읽을 때는 테마 반응형처럼 보이는 가독성 문제가 있었다.
3. 시스템 컬러(`--ds-color-system-*`)가 `--ds-*` 아래 묶여 있어 테마 반응형 컬러와 구분되지 않았다.

## 특이점

**Shell vs DS 경계 원칙:**
- 앱 자체의 인터페이스(툴 크롬)는 shell. 사용자가 디자인하는 대상(서비스 컨텐츠)은 ds.
- LabLayout의 sectionCard, labCard 등 Lab 인터페이스 요소는 shell (Figma의 캔버스 패널이 테마를 따르지 않는 것과 동일한 원리).
- 모달은 프레임(header/action)은 shell, 내부 팔레트/스케일 콘텐츠는 ds.
- **컴포넌트 쇼케이스 모달(ComponentDetailModal)**: 섹션 제목·그룹 라벨·Variant 라벨·Design tokens 테이블은 shell; 실제 컴포넌트(Button, Card, Input 등)만 `data-context="preview"`로 감싸 ds(테마) 적용. (P04 §4)
- 컴포넌트 자체는 중립 — 컨텍스트(`data-shell` / `data-context="preview"` 여부)가 해석을 결정한다.

**사용 규칙:**
```
[data-shell] 컨텍스트 내부
  색상 (bg, text, border, shadow) → --shell-*
  프리미티브 (spacing, radius, typography, motion) → --ds-* 그대로

[data-shell] 밖 (테마 반응형)
  모든 토큰 → --ds-*

시스템 상태 (error / warning / success / info)
  --sys-* → 컨텍스트 무관, 어디서나 사용 가능
```

**Shell 귀속 영역:**
Header, HeaderNav, Navigation, NavDropdown, DetailPanel, GlobalSettingsModal, Tooltip, ThemeSearchBar, Footer, LabLayout 전체(TOC/TabBar/sectionCard/labCard/comparisonCard), **ThemeTabNavigation**(PaletteLab 탭), 모달 프레임(ScaleSelectionModal·SemanticMappingModal·**ComponentDetailModal**의 header/action 영역), PaletteLab 내 shell 컨텍스트(ScaleStepGrid, ScaleSelectorPanel, ScaleGuide, EmptyCategory, ColorUsageDiagram, LabOverview), StyleLab/FontLab 개요 다이어그램.

## 영향도·구현 참고 (사전 파악 반영)

- **`--ui-bg-muted`**: `ui-variables.css`에 정의 없음. `[data-ui]`에서 `--ds-color-bg-muted: var(--ui-bg-surface)`만 매핑. 여러 CSS에서 `var(--ui-bg-muted)` 직접 사용 중 → P03에서 `--shell-bg-muted` 추가(또는 `--shell-bg-surface` 별칭) 후 교체.
- **P01**: `src/index.css`의 `ui-variables.css` import 경로 변경 필요. `ThemeProvider.tsx`에는 현재 `[data-ui]` 문자열 없음(확인 후 생략 가능). `tokens/ui/`는 내용을 `--shell-*` 기준으로 업데이트; 디렉토리명 `tokens/shell` 변경은 선택.
- **P02**: 시스템 컬러 주입 — 현재 ThemeProvider가 `--ds-color-system-*`를 주입하지 않음. `sys-variables.css` 고정값 사용 시 별도 주입 불필요. Lab/Playground 비교용 `getSystemColorVariables()`는 P02 후 `--sys-*` 키 반환으로 정리할지 결정 필요.
- **P04**: ComponentDetailModal도 단일 `[data-shell]` 모달이므로 크롬/콘텐츠 경계·레이어 주석 대상에 포함. 추가로 컴포넌트 모달 세분화 반영: body는 preview 없음, 섹션/라벨은 shell, 실제 컴포넌트만 `data-context="preview"`로 ds 적용 (P04 §4).

## Phase 목록

- [P01: shell 네임스페이스 rename](./P01.shell-namespace-rename.md)
- [P02: sys 토큰 분리](./P02.sys-token-separation.md)
- [P03: shell 컨텍스트 색상 토큰 교정](./P03.shell-context-color-correction.md)
- [P04: 모달 경계 명시 및 가독성 표준화](./P04.modal-boundary-and-readability.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
