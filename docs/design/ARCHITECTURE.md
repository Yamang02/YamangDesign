# Architecture Overview

에이전틱 코딩을 위한 프로젝트 구조 요약. AI가 프로젝트를 빠르게 이해하기 위한 필독 문서.

---

## 프로젝트 목적

디자인 시스템 기반 테마 전환 구조 검증 (POC).

- 동일 컴포넌트가 Minimal / Neumorphism 테마에서 토큰 교체만으로 변경
- 외부에서 1~4개 메인 컬러 입력 시 전체 UI 자동 적용

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | CSS Variables + TypeScript 객체 |
| Package Manager | pnpm |

---

## 핵심 개념

### 4-Color Palette System

```typescript
// 외부 입력 (1~4개)
interface ExternalPalette {
  primary: string;      // 필수
  secondary?: string;   // 선택 (없으면 파생)
  accent?: string;      // 선택 (없으면 파생)
  sub?: string;         // 선택 (없으면 파생)
}

// 항상 4개로 해석됨
interface ResolvedPalette {
  primary: string;
  secondary: string;   // 입력 또는 파생
  accent: string;      // 입력 또는 파생
  sub: string;         // 입력 또는 파생
}
```

### Token Flow (v4: Palette × Style 분리)

```
PaletteDefinition ─────────┐     StyleDefinition ─────────┐
(배색 프리셋/커스텀)         │     (minimal/neumorphism)    │
         │                 │              │               │
         ▼                 │              ▼               │
   createPalette()         │       createStyle(bgColor)   │
         │                 │              │               │
         ▼                 │              ▼               │
   ExpandedPalette         │       ResolvedStyle          │
   (scales + semantic)     │       (shadows + border)     │
         │                 │              │               │
         └─────────────────┴──────────────┘               │
                          │                              │
                          ▼                              │
                   combineTheme()                        │
                          │                              │
                          ▼                              │
                   Theme 객체 (colors, shadows, border)   │
                          │                              │
                          ▼                              │
               flattenToCSSVars() → injectCSSVariables() │
                          │                              │
                          ▼                              │
               var(--ds-xxx) → 컴포넌트에서 참조          │
```

### Theme Switching (v4)

```
ThemeProvider
    │
    ├── state: paletteName (default | vivid | pastel | ...)
    ├── state: styleName (minimal | neumorphism)
    ├── state: customColors (ExternalPalette | null)
    │
    └── combineTheme() → CSS 변수 주입
            │
            ▼
       data-palette, data-style 속성
```

---

## 폴더 구조 (v4)

```
src/
├── @types/              # 전역 타입
├── config/              # Site Style (E06)
│   └── site-style.ts
├── palettes/            # Palette 레이어 (E01)
│   ├── presets/         # default, vivid, pastel
│   ├── strategies/      # light-bg, colored-bg, dark-bg
│   └── types.ts
├── styles/              # Style 레이어 (E02)
│   ├── presets/         # minimal, neumorphism
│   └── types.ts
├── themes/
│   ├── combine.ts       # combineTheme (E03)
│   ├── presets.ts       # palettePresets, stylePresets
│   └── ThemeProvider.tsx
├── tokens/
│   ├── primitives/      # 원시 토큰
│   └── typography/      # Text Styles, Semantic (E05)
├── components/
│   ├── Button/          # 상태/shadow 검증
│   ├── Card/            # surface/shadow 검증
│   ├── Input/           # border/focus 검증
│   └── Navigation/      # layout/spacing + 테마 토글
│
├── utils/
│   ├── color.ts         # lighten, darken, adjustHue
│   ├── palette.ts       # resolvePalette
│   └── css.ts           # CSS 변수 주입
│
└── pages/
    └── Exhibition/      # 단일 전시 페이지
```

---

## 컴포넌트 패턴

각 컴포넌트 폴더 구조:

```
Button/
├── Button.tsx           # 컴포넌트 로직
├── Button.types.ts      # Props 타입 정의
├── Button.styles.ts     # CSS 변수 기반 스타일
└── index.ts             # export
```

### 스타일 규칙

```typescript
// 모든 스타일은 CSS 변수 참조
const styles = {
  background: 'var(--ds-color-action-primary-default)',
  boxShadow: 'var(--ds-shadow-md)',
  padding: 'var(--ds-spacing-4)',
};

// 하드코딩 금지
// ❌ background: '#6366F1'
// ❌ boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
```

---

## 테마별 핵심 차이

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | 흰색 | 밝은 회색 (sub) |
| 표면 | 배경과 다름 | 배경과 동일 |
| Shadow | drop (아래) | raised (양방향) |
| Border | 있음 (1px) | 없음 |
| Active | 어두운 배경 | inset shadow |

---

## 새 컴포넌트 추가

1. `src/components/NewComponent/` 폴더 생성
2. `NewComponent.types.ts` - Props 정의
3. `NewComponent.styles.ts` - CSS 변수 기반 스타일
4. `NewComponent.tsx` - 구현
5. `index.ts` - export
6. `src/components/index.ts`에 추가

---

## 새 테마 추가

1. `src/themes/newtheme/` 폴더 생성
2. `tokens.ts` - `createNewTheme(palette)` 함수
3. `ThemeProvider.tsx`의 switch 문에 케이스 추가
4. `ThemeName` 타입에 추가

---

## CSS 변수 네이밍

```
--ds-{category}-{property}-{variant}

예시:
--ds-color-bg-base
--ds-color-text-primary
--ds-color-action-primary-default
--ds-shadow-md
--ds-spacing-4
--ds-radius-md
```

---

## 토큰화 원칙

**모든 스타일을 토큰화하지 않는다.** 토큰 레이어와 컴포넌트 스타일 레이어를 분리하여, 토큰은 "꼭 필요한 것만" 둔다.

### 토큰으로 정의해야 하는 것

| 대상 | 이유 | 예시 |
|------|------|------|
| 시스템 스케일 값 | 디자인 일관성 | `--ds-spacing-4`, `--ds-radius-md` |
| 테마 전환에 영향받는 값 | 테마/다크모드 대응 | `--ds-color-bg-base`, `--ds-shadow-md` |
| 여러 컴포넌트에서 동일하게 사용 | 일괄 수정 용이 | `--ds-focus-ring-color`, `--ds-duration-fast` |
| 디자인 시스템 "원자" | 브랜드 일관성 | 색상, 타이포그래피, 간격, 모션 |

### 컴포넌트 스타일에 두어도 되는 것

| 대상 | 이유 | 예시 |
|------|------|------|
| 해당 컴포넌트만의 레이아웃 | 재사용 안 함 | `display: flex`, `grid-template-columns` |
| 시스템 스케일이 아닌 고유 값 | 규격화 불필요 | `max-width: 800px`, 특정 아이콘 `48px` |
| 의미가 "스케일"이 아닌 값 | 토큰화 과잉 | `z-index: 10`, `aspect-ratio: 16/9` |

### 혼합 사용 예시

```css
/* Card.module.css */
.card {
  /* 토큰 참조 - 시스템 레벨 */
  padding: var(--ds-spacing-4);
  border-radius: var(--ds-radius-md);
  background: var(--ds-color-bg-surface);
  box-shadow: var(--ds-shadow-md);
  transition: var(--ds-transition-interactive);

  /* 하드코딩 허용 - 컴포넌트 전용 */
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
```

> **핵심**: "시스템 레벨·테마·일관성에 필요한 것만 토큰, 나머지는 컴포넌트 스타일에 둔다."

---

## Z-Index 및 Sticky 레이어 관리

레이어 순서와 sticky 헤더가 콘텐츠에 가려지는 문제를 방지하려면 **토큰 기반 z-index**와 **단일 스케일**을 사용한다.

### 토큰 스케일 (tokens/primitives/sizes.ts)

| 토큰 | 용도 | 권장 사용처 |
|------|------|-------------|
| `--ds-z-base` (0) | 기본 문서 흐름 | 페이지 본문·섹션은 지정하지 않거나 0 |
| `--ds-z-dropdown` (100) | 드롭다운, 팝오버 | Select, Navigation 메뉴 |
| `--ds-z-sticky` (200) | 고정/스티키 UI | **헤더(Navigation), 푸터** 등 스크롤 시 상단/하단 고정 |
| `--ds-z-overlay` (300) | 딤, 백드롭 | 모달 뒤 배경 |
| `--ds-z-modal` (400) | 모달 | 다이얼로그 |
| `--ds-z-tooltip` (600) | 툴팁 | 말풍선 UI |

### 관리 원칙

1. **Sticky/Fixed에만 `--ds-z-sticky` 사용**  
   스크롤해도 위에 남아야 하는 요소(Navigation, 고정 푸터 등)에만 적용. 일반 콘텐츠에는 사용하지 않는다.

2. **페이지 본문은 z-index 지정 금지(또는 0)**  
   본문·카드·섹션에 임의의 `z-index`를 주지 않는다. `transform`, `filter`, `opacity < 1`은 새 **stacking context**를 만들어 sticky 헤더 위로 올라갈 수 있으므로, “강조”용 `transform: scale()` 등은 필요한 경우에만 쓰고, 레이아웃 루트에는 적용하지 않는다.

3. **새 컴포넌트는 토큰 참조**  
   드롭다운/모달/툴팁 등 레이어가 필요한 UI는 숫자 하드코딩 대신 `var(--ds-z-dropdown)`, `var(--ds-z-modal)` 등을 사용한다.

4. **값 변경은 토큰 한 곳에서**  
   실제 숫자는 `tokens/primitives/sizes.ts`의 `zIndex` 객체만 수정하고, ThemeProvider에서 CSS 변수로 주입된다. 컴포넌트는 항상 `var(--ds-z-*)`만 참조한다.

---

## 문서 목록

| 문서 | 내용 |
|------|------|
| [01-tech-stack.md](./01-tech-stack.md) | 기술 스택 선정 |
| [02-folder-structure.md](./02-folder-structure.md) | 폴더 구조 |
| [03-token-architecture.md](./03-token-architecture.md) | 토큰 계층 구조 |
| [04-color-system.md](./04-color-system.md) | 4-Color 시스템 |
| [05-shadow-system.md](./05-shadow-system.md) | Shadow 시스템 |
| [06-spacing-typography-borders.md](./06-spacing-typography-borders.md) | 기타 토큰 |
| [07-theme-minimal.md](./07-theme-minimal.md) | Minimal 테마 |
| [08-theme-neumorphism.md](./08-theme-neumorphism.md) | Neumorphism 테마 |
| [09-theme-switching.md](./09-theme-switching.md) | 테마 전환 메커니즘 |
| [10-component-button.md](./10-component-button.md) | Button 스펙 |
| [11-component-card.md](./11-component-card.md) | Card 스펙 |
| [12-component-input.md](./12-component-input.md) | Input 스펙 |
| [13-component-navigation.md](./13-component-navigation.md) | Navigation 스펙 |

---

## POC 완료 기준

- [ ] 테마 토글 시 모든 컴포넌트 즉시 변화
- [ ] 스타일 하드코딩 없음 (모두 CSS 변수)
- [ ] 테마 추가 시 기존 코드 수정 최소
- [ ] Shadow가 테마별로 완전히 다르게 동작
- [ ] 외부 컬러 1~4개 입력 시 전체 UI 반영
