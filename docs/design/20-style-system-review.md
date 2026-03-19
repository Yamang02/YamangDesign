# 20. 디자인 사조 확장성 검토

> 이 문서는 YamangDesign의 디자인 시스템이 다양한 디자인 사조를 얼마나 잘 수용할 수 있는지, 그리고 배색(팔레트)과 사조의 관계를 어떻게 다루어야 하는지를 분석한다.

---

## 1. 토큰 설정만으로 새로운 사조를 커버할 수 있는가

### 현재 StyleDefinition이 제어하는 범위

`StyleDefinition` 인터페이스는 새 사조를 추가할 때 건드려야 할 슬롯을 명확히 정의하고 있다.

| 슬롯 | 제어 대상 | 현재 구현 예시 |
|------|-----------|---------------|
| `elevation.create` | 그림자 형태·강도 | Minimal: 부드러운 드롭, Brutalism: 하드 오프셋 |
| `stroke.width / style / colorStrategy` | 테두리 두께·색 전략 | Neumorphism: 0px, Brutalism: 3px |
| `material.backdropFilter` | 유리·블러 효과 | Glassmorphism: `blur(12px) saturate(1.5)` |
| `material.backgroundAlpha` | 표면 투명도 | Glassmorphism: 0.55 |
| `material.backgroundBlendMode` | 색상 합성 방식 | — |
| `filter.element` | CSS filter (hue-rotate 등) | — |
| `spatial.perspective` | 3D 원근감 | — |
| `createVars()` | 임의 CSS 변수 추가 | 사조 전용 확장 슬롯 |

`createVars()` 훅이 존재하므로, 인터페이스를 수정하지 않고도 사조 전용 CSS 변수를 자유롭게 추가할 수 있다.

### 커버 가능한 미래 사조 예시

| 사조 | 필요한 표현 | 사용 슬롯 |
|------|------------|-----------|
| Skeuomorphism | 사실적 그라데이션 + 복잡한 그림자 | `elevation`, `material.backgroundImage` |
| Flat 2.0 | 긴 드롭쉐도우, 원색 | `elevation`, `createVars` |
| Material Design | Z축 고도 그림자, Ripple | `elevation` + 컴포넌트 레이어 |
| Claymorphism | 부드러운 팽창 그림자 + 고채도 | `elevation`, `material` |
| Dark Mode Default | 어두운 bg + 낮은 alpha surface | `material.backgroundAlpha` + `bgStrategy` |

### 현재 토큰으로 표현이 어려운 영역

다음 영역은 `StyleDefinition` 슬롯 외부에 있어 사조별로 달라질 수 없다.

| 영역 | 현재 상태 | 한계 |
|------|-----------|------|
| **Radius** | 전역 고정값 (`--ds-radius-md: 8px`) | Brutalism(0px)·Glassmorphism(16px+)을 토큰으로 구분 불가 |
| **Motion personality** | 전역 고정값 (`--ds-duration-normal`) | Neumorphism(느린 전환)·Brutalism(즉각 전환)을 표현 불가 |
| **Typography** | 전역 font-family·weight | 사조별 폰트 개성 표현 불가 (Brutalism의 무거운 serif 등) |
| **Spacing density** | 전역 4px 스케일 | 사조별 여백 철학 차이 표현 불가 |

**해결 방향**: `createVars()`를 활용해 사조별 radius·duration·font 오버라이드를 주입하면 인터페이스 확장 없이도 표현 가능하다. 단, 이를 관례로 문서화해두어야 일관성이 유지된다.

---

## 2. 사조별 차이가 토큰에서 뚜렷하게 드러나는가

### 잘 분리된 토큰

**Shadow** — 사조 구분력이 가장 높은 토큰이다.

```
Minimal:      0 4px 6px rgba(0,0,0,0.1)        ← 방향성 있는 부드러운 그림자
Neumorphism:  3px 3px 6px #dark, -3px -3px 6px #light  ← 양방향 입체 그림자
Brutalism:    4px 4px 0 #dark                  ← 블러 없는 하드 오프셋
Glassmorphism: 0 8px 32px rgba(0,0,0,0.2)      ← 깊이감 그림자 + blur
```

`--ds-shadow-sm` / `--ds-shadow-md` / `--ds-shadow-lg`가 같은 이름이지만 사조마다 완전히 다른 값으로 주입된다.

**Surface** — Glassmorphism 전용 슬롯.

```css
--ds-surface-backdrop: blur(12px) saturate(1.5)
--ds-surface-bg-alpha: 0.55
```

다른 사조에서는 이 변수들이 `none`·`1`이 되어 효과가 사라진다.

**Border** — `--ds-border-width`가 0px~3px로 사조를 구분.

### 미흡한 부분

**Radius가 스타일별로 분리되지 않는다.**

```css
/* 현재: 모든 사조에서 동일 */
--ds-radius-md: 8px

/* 이상적인 상태 */
/* Brutalism  → --ds-radius-md: 0px   */
/* Minimal    → --ds-radius-md: 6px   */
/* Glassmorphism → --ds-radius-md: 16px */
```

radius는 사조의 시각적 성격을 크게 좌우하는 토큰이다. `createVars()`로 `--ds-radius-*`를 오버라이드하는 것을 공식 관례로 채택하는 것을 권장한다.

**Motion이 사조별 리듬을 반영하지 못한다.**

| 사조 | 적합한 전환 | 현재 |
|------|------------|------|
| Neumorphism | 느리고 부드럽게 (300–400ms, ease-in-out) | 동일 |
| Brutalism | 즉각적·단계적 (0–100ms, linear) | 동일 |
| Glassmorphism | 매끄럽고 유연하게 (250ms, ease) | 동일 |
| Minimal | 절제된 속도 (200ms, ease-out) | 동일 |

---

## 3. 비교 연구를 위한 시스템 분리 수준

### 강점

**Palette × Style의 직교성** — 가장 중요한 설계 결정이다.
같은 팔레트로 4개 사조를 즉시 비교할 수 있고, 같은 사조에서 다양한 팔레트를 실험할 수 있다.

```
(palette: SpringCream) × (style: minimal)
(palette: SpringCream) × (style: neumorphism)   ← 배색 고정, 사조만 변경
(palette: SpringCream) × (style: brutalism)
(palette: SpringCream) × (style: glassmorphism)
```

**CSS Variables 단일 주입점** — `injectCSSVariables()`가 `:root`에 일괄 주입하므로
사조 전환 시 모든 컴포넌트가 리렌더링 없이 즉시 반응한다.

**`data-theme` / `data-style` 속성** — `document.documentElement`에 설정되어
CSS selector(`[data-theme="brutalism"]`)나 외부 관찰 도구에서 현재 사조를 식별할 수 있다.

**StyleDefinition의 닫힌 인터페이스** — 새 사조를 추가할 때
기존 코드를 수정하지 않고 새 파일 하나만 추가하면 된다.

### 개선이 필요한 부분

**전역 토큰과 스타일 토큰의 경계가 불명확하다.**

```
전역(공유): spacing, typography, radius, motion  ← 사조 무관
스타일(사조별): shadow, border, surface, filter  ← 사조마다 다름
```

현재 radius·motion은 전역으로 분류되어 있지만 실제로는 사조별 성격을 가진다.
사조 비교 실험에서 radius·motion까지 다르게 보이려면 스타일 레이어로 이동이 필요하다.

**사이드바이사이드 비교 모드가 없다.** 현재는 단일 스타일만 표시한다.
동일 컴포넌트를 2~4개 스타일로 나란히 비교하는 뷰가 있으면 사조 연구의 핵심 기능이 된다.

**StyleDefinition에 서술적 메타데이터가 없다.**

```typescript
// 현재
{ name: 'brutalism' }

// 이상적
{
  name: 'brutalism',
  era: '2010s',
  origin: 'web design',
  characteristics: ['high contrast', 'raw aesthetic', 'bold typography'],
  preferredBgStrategy: ['light', 'dark'],
}
```

메타데이터가 있으면 UI에서 사조 설명을 자동으로 표시하거나 팔레트 추천에 활용할 수 있다.

---

## 4. 배색(팔레트)과 디자인 사조의 관계

이것이 현재 구조에서 가장 설계적 긴장이 발생하는 지점이다.

### 문제: 두 차원이 완전히 직교하지 않는다

Palette와 Style은 독립 차원으로 설계되었지만, 실제로는 **결합 의존성(coupling)**이 존재한다.

```
예시 1: Glassmorphism + light bgStrategy
  → glass 표면이 흰 배경에 녹아들어 효과 소멸
  → bgStrategy가 'dark' 또는 'colored'여야 의도한 효과 발생

예시 2: Neumorphism + 다색 대비 팔레트
  → 뉴모픽의 단색 입체감이 컬러 대비에 묻힘
  → 단색에 가까운 팔레트일 때 효과 극대화
```

### 배색과 사조의 역사적 관계

디자인 사조는 저마다 역사적·미적으로 선호하는 배색이 있다.

| 사조 | 역사적 대표 배색 | 특징 |
|------|----------------|------|
| Bauhaus (1919-33) | 빨강·노랑·파랑 3원색 + 흑백 | 원색 직접 사용, 무채색 배경 |
| Art Deco (1920-30s) | 금색·흑색·상아색·에메랄드 | 금속성, 고급 소재 느낌 |
| Swiss/International (1950s) | 모노크롬 + 단일 강조색 | 극도의 절제, 그리드 중시 |
| Pop Art (1960s) | 원색 보색 대비 | 대담한 대비, 의도적 충돌 |
| Memphis Design (1980s) | 고채도 다색 + 흑백 패턴 | 밝고 유쾌함, 복잡한 패턴 |
| Vaporwave (2010s) | 핑크·퍼플·시안 (파스텔~네온) | 레트로 미래주의 |
| Neumorphism (2019-) | 단일 중성 배경색 기반 | 배경색 = 주조색, 그림자로만 구분 |
| Glassmorphism (2020-) | 어둡거나 그라데이션 배경 | 투명 레이어의 깊이감 필수 |
| Web Brutalism (2010s-) | 흑백 고대비 또는 날카로운 원색 | 원칙 없는 배색도 미학으로 수용 |

### 권장 접근법

현재의 **Palette ⊥ Style 독립성은 유지**한다. 이 설계 원칙이 시스템의 실험적 가치를 만든다.
대신 **"어울림" 정보를 메타데이터로 추가**하여 UX와 연구를 지원한다.

#### A. bgStrategy 제약 (즉시 적용 권장)

일부 스타일은 특정 `bgStrategy`에서만 의도한 효과가 나타난다. 이를 `StyleDefinition`에 명시한다.

```typescript
interface StyleDefinition {
  // 기존 필드...

  /** 이 스타일이 의도대로 작동하는 bgStrategy 목록. 미지정 시 제약 없음 */
  preferredBgStrategies?: BgStrategy[];

  /** 이 bgStrategy에서는 효과가 소멸됨 (경고용) */
  incompatibleBgStrategies?: BgStrategy[];
}

// glassmorphism.ts 예시
{
  preferredBgStrategies: ['dark', 'colored'],
  incompatibleBgStrategies: ['light'],
}
```

이 정보로 UI에서 "현재 배색에서는 유리 효과가 보이지 않을 수 있습니다" 같은 안내가 가능하다.

#### B. 사조별 역사적 팔레트 프리셋 (점진적 추가)

팔레트 프리셋의 `category`를 사조 이름으로 확장한다.

```typescript
// 현재: 'default' | 'custom' | 'natural' | 'pop'
// 확장: 'bauhaus' | 'art-deco' | 'swiss' | 'vaporwave' | ...

// 예시
{
  id: 'bauhaus-primary',
  displayName: 'Bauhaus Classic',
  category: 'bauhaus',
  colors: {
    primary: '#E63329',    // Bauhaus red
    secondary: '#F5C518',  // Bauhaus yellow
    accent: '#1A3C8F',     // Bauhaus blue
    neutral: '#1A1A1A',
  },
  bgStrategy: 'light',
  recommendedForStyles: ['minimal', 'brutalism'],
}
```

팔레트 선택 UI에서 "이 사조와 잘 어울리는 팔레트"를 필터링하는 기능으로 연결된다.

#### C. 팔레트 추천 메타데이터 (선택적)

`PaletteDefinition`에 `recommendedForStyles`를, `StyleDefinition`에 `suggestedPaletteCategories`를 추가하여 양방향 추천을 구현한다.

```typescript
// PaletteDefinition 확장
{
  recommendedForStyles?: StyleName[];
}

// StyleDefinition 확장
{
  suggestedPaletteCategories?: string[];
  // 예: glassmorphism → ['dark', 'gradient', 'vaporwave']
}
```

### 핵심 원칙

> **배색과 사조는 독립 차원으로 유지한다. 다만 "잘 어울리는 조합"은 메타데이터로 안내한다.**

사용자가 Bauhaus 팔레트에 Glassmorphism을 적용하는 실험도 시스템이 허용해야 한다.
그 결과가 미적으로 어색하더라도, 그것 자체가 연구적 발견이 된다.

---

## 5. 요약: 현재 상태와 개선 방향

### 현재 잘 작동하는 것

- Palette × Style 직교 설계로 조합 실험이 자유롭다
- Shadow가 사조별로 완전히 다르게 주입되어 가장 강력한 구분자 역할을 한다
- `StyleDefinition` 인터페이스가 명확해 새 사조 추가 시 기존 코드 변경이 없다
- `createVars()` 훅으로 인터페이스 확장 없이 사조별 임의 토큰 주입이 가능하다

### 단계별 개선 제안

| 우선순위 | 작업 | 효과 |
|---------|------|------|
| 높음 | `createVars()`로 사조별 `--ds-radius-*` 오버라이드 관례화 | Brutalism 0px, Glassmorphism 16px+ 구현 |
| 높음 | `StyleDefinition`에 `preferredBgStrategies` 추가 | Glassmorphism 호환성 경고 |
| 중간 | `createVars()`로 사조별 `--ds-duration-*` 오버라이드 | Motion personality 구현 |
| 중간 | 사조별 역사적 팔레트 프리셋 추가 (bauhaus, art-deco 등) | 연구 자료로 활용 |
| 낮음 | `StyleDefinition` 서술적 메타데이터 (`era`, `characteristics`) | UI 설명 자동화 |
| 낮음 | 사이드바이사이드 비교 뷰 | 사조 차이 직관적 확인 |
