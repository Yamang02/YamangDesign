# E09: 중립색상(Neutral) 분리

## 목표

`sub` 스케일의 이중 역할을 분리하여:

1. **Neutral(무채색)** — 텍스트, 테두리, 배경 등 기본 UI 요소 전용 (신규 추가)
2. **Sub(컬러풀 보조색)** — 유지. 브랜드 톤의 보조 색상으로 **지정된 영역에만** 적용

현재 sub가 쓰이는 모든 곳 → neutral로 이전. sub는 **Sub 적용 정책**에 정의된 곳에만 사용.

---

## 현재 문제

### sub 스케일의 이중 역할

| 역할 | 용도 | 예시 |
|------|------|------|
| Neutral/Gray | 텍스트, 테두리, 배경 | `text.primary`, `border.default`, `bg.surface` |
| Sub Color | 보조 브랜드 색상 | (추후) 특정 폰트, 지정된 UI 요소 |

### 현재 프리셋 sub 값 분석

| 프리셋 | sub 값 | 특성 |
|--------|--------|------|
| default | `#E5E7EB` | 밝은 회색 (neutral) |
| vivid | `#1F2937` | 어두운 회색 (neutral) |
| pastel | `#F3F4F6` | 밝은 회색 (neutral) |
| monochrome | `#9CA3AF` | 중간 회색 (neutral) |
| earth | `#F5F5F4` | 따뜻한 회색/스톤 (neutral) |

→ 추후 sub를 **컬러풀하게** 사용할 예정이므로, 지금 sub가 쓰이는 곳(텍스트/테두리/배경)은 **neutral로 분리** 필요.

---

## 일반적인 디자인 시스템 패턴

대부분의 디자인 시스템은 **분리**합니다:

```
┌─────────────────────────────────────────────────────┐
│  Brand Colors (크로매틱)                             │
│  - Primary: 주 브랜드                                │
│  - Secondary: 보조 브랜드                            │
│  - Accent: 강조                                     │
├─────────────────────────────────────────────────────┤
│  Neutral Colors (무채색 또는 저채도)                  │
│  - Gray scale: 50~900                               │
│  - 텍스트, 테두리, 배경, divider 전용                │
└─────────────────────────────────────────────────────┘
```

| 시스템 | Neutral | Brand |
|--------|---------|-------|
| Tailwind | gray, slate, zinc | blue, red, etc. |
| Chakra UI | gray | brand, accent |
| Material Design | surface, on-surface | primary, secondary |

---

## 권장 구조

### Before (현재)

```typescript
scales: {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  sub: ColorScale;       // 🚨 neutral + 보조색 혼용
}
```

### After (권장)

```typescript
scales: {
  // Brand (크로매틱)
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  sub: ColorScale;       // 컬러풀 보조색 — 지정된 영역에만 사용

  // Neutral (무채색 - 텍스트/테두리/배경 전용)
  neutral: ColorScale;   // 신규 추가. 기존 sub의 "UI 용도" 담당
}
```

- **neutral**: 항상 무채색. 텍스트·테두리·배경은 neutral만 사용
- **sub**: 선택적. 컬러풀 가능. **Sub 적용 정책**에 정의된 곳에만 사용

---

## Sub 적용 정책 (Sub Usage System)

sub는 **가독성이 중요하지 않은, 브랜드 감성 표현용** 영역에만 적용. 일반 텍스트·테두리·배경에는 사용 금지.

### 1. 적용 가능 영역 (허용)

| 카테고리 | 용도 | 예시 토큰/용도 |
|----------|------|----------------|
| **Typography** | 특정 폰트 스타일에만 | `--ds-text-sub` (캡션, 라벨, 데코 텍스트 등) |
| **Decorative** | 장식/배경 패턴 | 히어로 배경 그라데이션, 카드 accent 라인 |
| **Component** | sub 전용 컴포넌트 variant | Button `variant="sub"`, Badge `variant="sub"` |
| **Icon/Illustration** | 아이콘·일러스트 톤 | 비강조 아이콘, 브랜드 일러스트 보조색 |

### 2. 적용 금지 영역

| 금지 | 이유 |
|------|------|
| 본문 텍스트 (body, paragraph) | 가독성 필수 |
| 테두리 (border.default, border.subtle) | 경계선은 중립이어야 함 |
| 배경 (bg.base, bg.surface, bg.muted) | 넓은 면적에 색상 → 산만 |
| 포커스 링 (border.focus) | 접근성·명확성 |

### 3. 시맨틱 토큰 설계

```typescript
// Sub 전용 시맨틱 토큰 (sub가 있을 때만 정의)

colors: {
  // ... 기존 semantic ...

  // Sub 적용 영역 (선택적)
  brandSub?: {
    default: string;   // sub[500]
    muted: string;     // sub[200] - 연한 배경
    emphasis: string;  // sub[700] - 강조
  };
}
```

```css
/* Typography - sub 전용 폰트 스타일 */
.text-sub { color: var(--ds-color-brand-sub-default); }

/* Component - sub variant */
.button[data-variant='sub'] { background: var(--ds-color-brand-sub-default); }
```

### 4. 폰트별 적용 예시

| 폰트 스타일 | sub 적용 | 비고 |
|-------------|----------|------|
| body, paragraph | ❌ | neutral only |
| heading (h1~h6) | ❌ | neutral only |
| caption, label | ✅ | 선택. 작은 텍스트에 sub 허용 |
| overline, eyebrow | ✅ | 데코용 |
| code, mono | ❌ | 가독성 우선 |

**규칙**: "본문 가독성에 영향" → neutral. "브랜드 감성·데코" → sub 허용.

---

## 설계 상세

### 1. 타입 변경

```typescript
// @types/tokens.d.ts

export interface ExternalPalette {
  primary: string;
  secondary?: string;
  accent?: string;
  /** Neutral (무채색). 텍스트/테두리/배경용. 미입력 시 고정 gray 사용 */
  neutral?: string;
  /** Sub (컬러풀 보조색). 지정된 영역에만 사용. Sub 적용 정책 참고 */
  sub?: string;
}

export interface ResolvedColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;   // 항상 존재 (미입력 시 고정 gray)
  sub?: string;      // 선택적. 없으면 brandSub 미노출
  _meta?: { ... };
}

export interface GeneratedScales {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;   // 항상 존재
  sub?: ColorScale;      // sub 입력 시에만 생성
}
```

### 2. resolvePalette 수정

```typescript
// utils/palette.ts

const DEFAULT_NEUTRAL = '#9CA3AF';  // 고정 gray (Tailwind gray-400)

function deriveNeutral(primary: string): string {
  return desaturate(lighten(primary, 40), 70);
}

export function resolvePalette(input: ExternalPalette): ResolvedColors {
  const { primary, secondary, accent, neutral, sub } = input;
  // neutral: 미입력 시 기존 sub(회색) 또는 고정 gray. 텍스트/테두리/배경용
  const neutralSource = neutral ?? sub ?? deriveNeutral(primary);

  return {
    primary,
    secondary: secondary ?? deriveSecondary(primary),
    accent: accent ?? deriveAccent(primary),
    neutral: neutralSource,
    sub: sub,  // 그대로 전달. 컬러풀 sub 가능
    _meta: { ... },
  };
}

export function generateColorScales(palette: ResolvedColors): GeneratedScales {
  const scales: GeneratedScales = {
    primary: generateColorScale(palette.primary),
    secondary: generateColorScale(palette.secondary),
    accent: generateColorScale(palette.accent),
    neutral: generateColorScale(palette.neutral),
  };
  if (palette.sub) {
    scales.sub = generateColorScale(palette.sub);
  }
  return scales;
}
```

### 3. 배경 전략 및 테마 수정

**시맨틱 색상(text, border, bg)은 모두 `scales.neutral` 참조로 변경.**

| 파일 | 변경 |
|------|------|
| `palettes/strategies/light-bg.ts` | `scales.sub` → `scales.neutral` |
| `palettes/strategies/colored-bg.ts` | `scales.sub` → `scales.neutral` |
| `palettes/strategies/dark-bg.ts` | `scales.sub` → `scales.neutral` |
| `themes/minimal/tokens.ts` | `scales.sub` → `scales.neutral` |
| `themes/neumorphism/tokens.ts` | `palette.sub` → `palette.neutral`, `scales.sub` → `scales.neutral` |

**Sub 적용 영역**용 시맨틱 토큰(`brandSub`)은 sub가 있을 때만 추가.

### 4. PaletteDefinition 변경

```typescript
// palettes/types.ts, palette-definitions.ts

colors: {
  primary: string;
  secondary?: string;
  accent?: string;
  neutral?: string;  // 텍스트/테두리/배경용. 미입력 시 sub 또는 고정 gray
  sub?: string;      // 컬러풀 보조색. 지정된 영역에만 사용
}
```

**기존 preset 마이그레이션**: `sub`(회색) → `neutral`로 이동. sub는 생략(추후 컬러풀 sub 추가 시 `sub` 필드에 넣음).

---

## Neutral 프리셋 (선택 사항)

팔레트별 neutral 톤을 다르게 두고 싶다면:

```typescript
// tokens/primitives/neutral-presets.ts (E08 system-colors 패턴 참고)

export type NeutralPresetName = 'gray' | 'slate' | 'zinc' | 'stone' | 'warm';

export const neutralPresets: Record<NeutralPresetName, { 50: string; ...; 900: string }> = {
  gray: { 50: '#F9FAFB', 100: '#F3F4F6', ... },
  slate: { ... },
  stone: { ... },  // earth 프리셋용
  warm: { ... },
};

// PaletteDefinition에 neutralPreset 추가 가능
```

**1차 범위에서는 생략** — 기존 sub 값을 neutral로 그대로 사용. 추후 필요 시 확장.

---

## 컬러시스템 / PaletteLab 통합

### PaletteLab

- `colorKeys`: `['primary', 'secondary', 'accent', 'neutral', 'sub']` — neutral 항상, sub는 있으면 표시
- 스와치: Neutral(필수), Sub(선택)

### lab-presets.ts

```typescript
const scaleKeys = ['primary', 'secondary', 'accent', 'neutral', 'sub'] as const;
// sub는 resolved.sub가 있을 때만 변수 생성
```

### ColorPicker

- `neutral`: Neutral (텍스트/테두리/배경)
- `sub`: Sub (지정된 영역용, 컬러풀 가능)

### CSS 변수

```css
/* Neutral - 항상 생성 */
--ds-color-neutral-50, --ds-color-neutral-100, ... --ds-color-neutral-900;

/* Sub - sub 입력 시에만 생성 */
--ds-color-sub-50, --ds-color-sub-100, ... --ds-color-sub-900;

/* Sub 적용 영역용 시맨틱 */
--ds-color-brand-sub-default, --ds-color-brand-sub-muted, --ds-color-brand-sub-emphasis;
```

---

## 마이그레이션 전략

### Phase 1: Neutral 추가 + 시맨틱 이전

1. `GeneratedScales`, `ResolvedColors`에 `neutral` 추가
2. preset의 기존 `sub`(회색) 값을 `neutral`로 이동. `sub`는 제거(추후 컬러풀 sub 추가 시 사용)
3. 배경 전략·테마에서 `scales.sub` → `scales.neutral` 참조 변경

### Phase 2: Sub 적용 시스템 구축

1. `brandSub` 시맨틱 토큰 추가 (sub가 있을 때만)
2. Sub 적용 가능 컴포넌트/토큰 정의 (caption, label, Button variant="sub" 등)
3. PaletteLab·ColorPicker에서 neutral + sub 둘 다 표시

### Phase 3: Sub 사용처 확장

1. 특정 Typography에 `--ds-text-sub` 적용
2. sub 전용 Button/Badge variant
3. 문서에 Sub 적용 정책 명시

---

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/@types/tokens.d.ts` | `neutral` 추가, `sub` 선택적 유지 |
| `src/utils/palette.ts` | `resolvePalette`, `generateColorScales` - neutral + sub 병존 |
| `src/palettes/types.ts` | `PaletteDefinition.colors.neutral`, `brandSub` 시맨틱 (선택) |
| `src/palettes/presets/*.ts` | 기존 `sub` → `neutral`로 이동, sub는 제거 또는 컬러풀 값으로 |
| `src/constants/palette-definitions.ts` | themePresets: neutral 추가, sub 선택적 |
| `src/palettes/strategies/*.ts` | 시맨틱 색상: `scales.sub` → `scales.neutral` |
| `src/themes/minimal/tokens.ts` | `scales.sub` → `scales.neutral`, brandSub 추가(선택) |
| `src/themes/neumorphism/tokens.ts` | 배경색 등 `scales.sub` → `scales.neutral` |
| `src/pages/layouts/PaletteLab/PaletteLab.tsx` | colorKeys: neutral + sub |
| `src/constants/lab-presets.ts` | neutral + sub 스케일 변수 |
| `src/components/ColorPicker/ColorPicker.tsx` | neutral, sub 필드 둘 다 |

---

## 체크리스트

- [ ] `@types/tokens.d.ts` - neutral 추가, sub 선택적
- [ ] `utils/palette.ts` - resolvePalette, generateColorScales (neutral + sub)
- [ ] `palettes/types.ts` - PaletteDefinition.colors.neutral
- [ ] `palettes/presets/*.ts` - 기존 sub → neutral, sub는 제거 또는 컬러풀
- [ ] `constants/palette-definitions.ts` - themePresets 수정
- [ ] `palettes/strategies/*.ts` - 시맨틱: scales.neutral 참조
- [ ] `themes/minimal/tokens.ts`, `themes/neumorphism/tokens.ts` - neutral 참조
- [ ] brandSub 시맨틱 토큰 (sub 있을 때)
- [ ] PaletteLab - colorKeys: neutral + sub
- [ ] lab-presets.ts - neutral, sub 스케일
- [ ] ColorPicker - neutral, sub 필드
- [ ] Sub 적용 정책 문서화 (caption, label, variant 등)
