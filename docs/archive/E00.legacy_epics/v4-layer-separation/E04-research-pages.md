# E04: 연구 페이지 구축

> **핵심 구현 완료** (2025-02) — BgStrategyPreview, StateDemo, CSSVarsViewer, PropsPanel 등 선택 항목 미구현

## 목표

배색, 스타일, 조합을 개별적으로 확인하고 학습할 수 있는 연구 페이지 구축.

---

## 페이지 구조

```
/                     → 홈 (현재 데모)
/palette              → 배색 연구 페이지
/style                → GUI 스타일 연구 페이지
/playground           → 조합 테스트 페이지
/components           → 컴포넌트 쇼케이스
```

---

## 1. 배색 연구 페이지 (`/palette`)

### 목적
- 배색 프리셋 비교
- 배경 전략별 차이 확인
- 색상 스케일 시각화

### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Palette Lab                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Preset 선택: Default | Vivid | Pastel | ...]         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Color Scales                                    │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │ Primary   [50][100][200]...[800][900]   │    │   │
│  │  │ Secondary [50][100][200]...[800][900]   │    │   │
│  │  │ Accent    [50][100][200]...[800][900]   │    │   │
│  │  │ Sub       [50][100][200]...[800][900]   │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Background Strategy                             │   │
│  │  [Light] [Colored] [Dark]                       │   │
│  │                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │ Preview  │ │ Preview  │ │ Preview  │        │   │
│  │  │ (Light)  │ │ (Color)  │ │ (Dark)   │        │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Custom Color Input                              │   │
│  │  Primary: [#____] Secondary: [#____]            │   │
│  │  Accent:  [#____] Sub:       [#____]            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트
- `PalettePresetSelector` - 프리셋 선택
- `ColorScaleDisplay` - 스케일 시각화 (10단계)
- `BgStrategyPreview` - 배경 전략 미리보기
- `CustomColorInput` - 커스텀 색상 입력 (기존 ColorPicker 재사용)

---

## 2. 스타일 연구 페이지 (`/style`)

### 목적
- GUI 스타일별 특징 비교
- 그림자, 경계선, 상태 표현 차이 확인
- 스타일 적용 결과 시각화

### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Style Lab                                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Style 선택: Minimal | Neumorphism | Glass | ...]     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Shadow Samples                                  │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │   │
│  │  │  None  │ │   SM   │ │   MD   │ │   LG   │   │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  State Demonstration                             │   │
│  │  ┌────────────────────────────────────────┐     │   │
│  │  │  [Rest] → [Hover] → [Active] → [Focus] │     │   │
│  │  │   ○        ○          ○          ○     │     │   │
│  │  └────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Surface Treatment                               │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐               │   │
│  │  │  Flat  │ │ Raised │ │ Inset  │               │   │
│  │  └────────┘ └────────┘ └────────┘               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Style Characteristics                           │   │
│  │  • Border: 1px solid / none                     │   │
│  │  • Hover: shadow / background                   │   │
│  │  • Active: inset shadow / scale                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트
- `StylePresetSelector` - 스타일 선택
- `ShadowSamples` - 그림자 단계별 표시
- `StateDemo` - 상태별 변화 시연
- `StyleCharacteristics` - 스타일 특성 설명

---

## 3. 조합 테스트 페이지 (`/playground`)

### 목적
- Palette × Style 자유 조합
- 실시간 미리보기
- 조합 결과 확인

### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Playground                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────┐  ┌────────────────────┐        │
│  │  Palette           │  │  Style             │        │
│  │  [▼ Vivid      ]   │  │  [▼ Neumorphism]   │        │
│  └────────────────────┘  └────────────────────┘        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │              Component Preview                   │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │                                          │   │   │
│  │  │   [Button]  [Input____]  [Select▼]      │   │   │
│  │  │                                          │   │   │
│  │  │   ┌────────────────────────────────┐    │   │   │
│  │  │   │          Card                  │    │   │   │
│  │  │   │   Some content here...         │    │   │   │
│  │  │   └────────────────────────────────┘    │   │   │
│  │  │                                          │   │   │
│  │  │   [Toggle] [Checkbox] [Radio]           │   │   │
│  │  │                                          │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Generated CSS Variables (collapsible)           │   │
│  │  --ds-color-bg-base: #FFFFFF                    │   │
│  │  --ds-shadow-md: 5px 5px 10px...                │   │
│  │  ...                                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 주요 컴포넌트
- `PaletteSelector` - 드롭다운
- `StyleSelector` - 드롭다운
- `ComponentPreview` - 실제 컴포넌트 렌더링
- `CSSVarsViewer` - 생성된 CSS 변수 표시

---

## 4. 컴포넌트 쇼케이스 (`/components`)

### 목적
- 각 컴포넌트 개별 확인
- Props 변경 테스트
- 코드 스니펫 표시

### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Components                                             │
├──────────────┬──────────────────────────────────────────┤
│  Navigation  │  Component Detail                        │
│              │                                          │
│  • Button    │  ┌──────────────────────────────────┐   │
│  • Input     │  │  Button                          │   │
│  • Select    │  │                                  │   │
│  • Card      │  │  [Primary] [Secondary] [Ghost]   │   │
│  • ...       │  │                                  │   │
│              │  │  Props:                          │   │
│              │  │  variant: [▼ primary]            │   │
│              │  │  size:    [▼ md     ]            │   │
│              │  │  disabled: [ ]                   │   │
│              │  │                                  │   │
│              │  └──────────────────────────────────┘   │
│              │                                          │
│              │  ┌──────────────────────────────────┐   │
│              │  │  Code                            │   │
│              │  │  ```tsx                          │   │
│              │  │  <Button variant="primary">      │   │
│              │  │    Click me                      │   │
│              │  │  </Button>                       │   │
│              │  │  ```                             │   │
│              │  └──────────────────────────────────┘   │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### 주요 컴포넌트
- `ComponentNav` - 사이드 네비게이션
- `ComponentDemo` - 컴포넌트 렌더링
- `PropsEditor` - Props 조절 UI
- `CodeSnippet` - 코드 표시

---

## 라우팅 설정

```typescript
// App.tsx 또는 router.tsx
const routes = [
  { path: '/', component: HomePage },
  { path: '/palette', component: PaletteLab },
  { path: '/style', component: StyleLab },
  { path: '/playground', component: Playground },
  { path: '/components', component: ComponentShowcase },
  { path: '/components/:name', component: ComponentDetail },
];
```

> 라우터 라이브러리 없이 간단한 상태 기반 라우팅으로 구현 가능

---

## 작업 항목

### 1. 페이지 레이아웃
- [x] 공통 레이아웃 (Navigation, main 영역)
- [x] 상태 기반 페이지 전환 (App.tsx `page` state)

### 2. Palette Lab 페이지
- [x] PalettePresetSelector (Select)
- [x] ColorScaleDisplay (스케일 그리드)
- [ ] BgStrategyPreview (전략별 미리보기)

### 3. Style Lab 페이지
- [x] StylePresetSelector (Select)
- [x] ShadowSamples (none/sm/md/lg/inset)
- [ ] StateDemo (Rest→Hover→Active→Focus)
- [x] Component Preview

### 4. Playground 페이지
- [x] 조합 선택 UI (Palette + Style Select)
- [x] ComponentPreview (Button, Input, Card)
- [ ] CSSVarsViewer (생성된 CSS 변수 표시)

### 5. Component Showcase 페이지
- [x] Components 페이지 (Button, Input, Select, Card 등)
- [ ] ComponentNav (사이드 네비) — 현재 상단 버튼으로 페이지 이동
- [ ] PropsEditor (전용 패널)
- [ ] CodeSnippet (코드 블록)

---

## 완료 기준

- [x] 4개 페이지 구현 완료 (PaletteLab, StyleLab, Playground, Components)
- [x] 페이지 간 이동 가능 (Landing/Palette/Style/Playground/Components)
- [x] Palette Lab에서 배색 프리셋 비교 가능
- [x] Style Lab에서 스타일 특성 확인 가능 (Shadow Samples, Component Preview)
- [x] Playground에서 자유 조합 가능
- [x] Component Showcase에서 개별 컴포넌트 확인 가능

---

## 우선순위

1. **Playground** (P0) - 조합 테스트가 핵심 기능
2. **Palette Lab** (P1) - 배색 연구
3. **Style Lab** (P1) - 스타일 연구
4. **Component Showcase** (P2) - 기존 데모 페이지 확장

---

## 참고

### 라우팅 전략

**현재 접근 (E04 범위):**
- 라우터 라이브러리 없이 `useState`로 간단 구현
- 페이지 상태를 `currentPage: 'palette' | 'style' | 'playground' | 'components'`로 관리
- URL은 변경되지 않음 (SPA 단일 페이지)

**추후 확장 가능성:**
- 페이지가 많아지거나 딥링크/북마크가 필요해지면 `react-router` 도입 고려
- 도입 시점: 5개 이상 페이지 또는 URL 공유 필요성 발생 시
- 마이그레이션 용이하도록 페이지 컴포넌트는 독립적으로 설계
