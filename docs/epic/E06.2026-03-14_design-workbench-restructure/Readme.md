# Epic E06: Design Workbench Restructure

## 목표

페이지/내비게이션 구조를 세 개의 독립적인 탐구 축으로 재편하여,
디자인 시스템을 체계적으로 학습·실험할 수 있는 워크벤치를 구축한다.

- **축 1 — 디자인 레이어 (Labs)**: 토큰이 어떻게 스타일을 정의하는지 탐구
- **축 2 — 복잡도 계층 (Build)**: Atomic Design 단계별 컴포넌트 조합 탐구
- **축 3 — 사용 맥락 (Context)**: Shell / Service / Admin 컨텍스트별 렌더링 분리

## 배경 / 맥락

현재 네 카테고리(Pages / Components / Labs / Playground)가 세 축을 혼재한다.
- `--shell-*`(크롬) 레이어를 시각화하는 페이지가 없음
- Atomic Design 계층이 Atoms(Components)만 있고 Molecules/Organisms 없음
- Style Lab이 preset 비교에 그쳐, "어떤 토큰이 이 ism을 정의하는가"를 학습할 수 없음
- `StyleDefinition`의 material/filter/spatial 슬롯이 Lab에 노출되지 않음
  (→ glassmorphism 같은 새 스타일을 추가하더라도 볼 방법이 없음)

E05 P01(Shell 토큰 중립화)이 선행되어야 Context/Shell 뷰가 의미 있다.

## 특이점

### 새 내비게이션 구조

```
Labs        디자인 재료 탐구 (축1)
├── Palette     색상 레이어 (기존 PaletteLab)
├── Style       스타일 레이어 (재설계)
├── Font        타이포그래피 (기존 FontLab)
└── Tokens      3레이어 live 검사 (재설계: Shell / DS / Sys 섹션 분리)

Build       Atomic Design 계층 탐구 (축2)
├── Atoms       단일 컴포넌트 (기존 Components 페이지 재활용)
├── Molecules   조합 패턴 (신규)
└── Organisms   복합 섹션 (신규)

Context     사용 맥락 분리 (축3)
├── Service     DS 테마가 적용된 서비스 UI (기존 Playground 확장)
└── Shell       앱 크롬 자체 시각화 (신규)

Playground  자유 조합 실험 (기존, 축1×2×3 교차점)
```

### Style Lab 재설계 핵심 — Property Matrix

"스타일(ism)은 어떤 토큰의 어떤 값으로 정의되는가"를 표로 노출.

`StyleDefinition`의 슬롯 → 속성 차원 매핑:

| 속성 차원 | StyleDefinition 슬롯 | CSS 토큰 | 현재 프리셋 |
|----------|---------------------|---------|-----------|
| Shadow 방향·형태 | elevation | --ds-shadow-* | drop / bilateral / hard-offset |
| Border 두께 | stroke.width | --ds-border-width | 1px / 0 / 3px |
| Border 전략 | stroke.colorStrategy | — | palette / transparent |
| 표면 투명도 | material.backgroundAlpha | --ds-surface-bg-alpha | — (미사용) |
| Backdrop blur | material.backdropFilter | --ds-surface-backdrop | — (미사용) |
| Element filter | filter.element | --ds-filter | — (미사용) |
| 3D perspective | spatial.perspective | --ds-perspective | — (미사용) |

Style Lab의 새 "Properties" 섹션은 이 표를 live 값과 함께 보여주고,
프리셋 선택 시 각 행의 값이 어떻게 달라지는지 강조 표시한다.

### Glassmorphism 프리셋 추가

`material` 슬롯을 실제로 사용하는 첫 번째 프리셋.
`StyleDefinition` 구조를 확장하지 않고 기존 슬롯만으로 구현 가능한지 검증하는 역할.

```typescript
// src/styles/presets/glassmorphism.ts (신규)
material: {
  backdropFilter: 'blur(12px) saturate(1.5)',
  backgroundAlpha: 0.6,
},
stroke: { width: '1px', style: 'solid', colorStrategy: 'fixed', fixedColor: 'rgba(255,255,255,0.2)' },
elevation: { create: () => ({ ...drop shadows with rgba 0.15... }) },
```

### Lab 비교 섹션 기준 컨텍스트 원칙 (E05 논의 반영)

모든 Lab의 Comparison 섹션은 **탐색 중인 dimension만** 변수가 달라지도록 래퍼를 둔다.

```
Overview 섹션   → ThemeProvider 현재값 그대로 (현재 상태 표시)
Comparison 섹션 → fixedBaseContext 래퍼 + 탐색 dimension만 ComparisonCard에 주입
```

- StyleLab Comparison: default 팔레트 고정 래퍼 + 스타일 변수 카드별 주입
- PaletteLab Comparison: minimal 스타일 고정 래퍼 + 팔레트 변수 카드별 주입

### Build 섹션 — Atomic Design 매핑

| 계층 | 포함할 컴포넌트/패턴 |
|------|-------------------|
| Atoms | Button / Input / Badge / Icon / Avatar / Select / Tooltip |
| Molecules | FormField(Label+Input+Helper) / SearchBar / TagGroup / ProfileCard |
| Organisms | HeaderBar / NavigationSidebar / CardGrid / FormCard |

Molecules/Organisms는 Atoms를 조합해 만들며, 각 페이지가 "어떤 Atom이 여기 쓰이는가"를 명시한다.

### Context 섹션 — Shell 뷰

Shell 컨텍스트 페이지는 **앱 크롬 자체(Header/Nav/Footer)를 디자인 아티팩트로** 시각화한다.
- `--shell-*` 토큰 목록과 live 값
- 해당 토큰이 크롬의 어느 영역을 칠하는지 오버레이 표시
- E05 P01(Shell 중립화) 이후 기준값 확인 용도

## Phase 목록

- [P01: 내비게이션 구조 재편](./P01.nav-restructure.md)
- [P02: Style Lab 재설계 — Property Matrix + Glassmorphism](./P02.stylelab-property-matrix.md)
- [P03: Token Lab 3-레이어 뷰](./P03.tokenlab-3layer.md)
- [P04: Build — Atoms 정비](./P04.build-atoms.md)
- [P05: Build — Molecules & Organisms](./P05.build-molecules-organisms.md)
- [P06: Context — Shell & Service 뷰](./P06.context-shell-service.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료
- [x] P05 완료
- [x] P06 완료
