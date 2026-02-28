# 04. Color System

## Overview

외부에서 입력되는 1~4개의 메인 컬러를 기반으로 전체 UI 색상을 구성하는 시스템.

---

## 4-Color 역할 정의

배색 이론 기반 4가지 역할:

| 역할 | 영문 | 용도 | 필수 |
|------|------|------|------|
| 주조색 | Primary | 브랜드 아이덴티티, 주요 액션 | **필수** |
| 보조색 | Secondary | Primary 보완, 보조 액션 | 선택 |
| 강조색 | Accent | 하이라이트, 주의 환기 | 선택 |
| 서브컬러 | Sub | 배경, 중립 요소, 넓은 면적 | 선택 |

---

## 입력 조합 패턴

### 배색책 기반 조합 유형

```
2색 조합
├── Primary + Sub          (기본 + 배경)
├── Primary + Secondary    (주 + 보조)
└── Primary + Accent       (주 + 강조)

3색 조합
├── Primary + Secondary + Sub
├── Primary + Accent + Sub
└── Primary + Secondary + Accent

4색 조합
└── Primary + Secondary + Accent + Sub
```

### 코드 예시

```typescript
// 2색: 심플한 모노톤 느낌
const palette2 = {
  primary: '#2D3436',
  sub: '#DFE6E9',
};

// 3색: Primary + Accent + 배경
const palette3 = {
  primary: '#6C5CE7',
  accent: '#FDCB6E',
  sub: '#F5F5F5',
};

// 4색: 풀 컬러 배색
const palette4 = {
  primary: '#E17055',
  secondary: '#00B894',
  accent: '#FDCB6E',
  sub: '#DFE6E9',
};
```

---

## 파생 규칙 (Derivation Rules)

미입력 색상은 Primary를 기반으로 자동 파생:

### Secondary 파생

```typescript
// 색상환에서 30도 이동 (유사색)
function deriveSecondary(primary: string): string {
  return adjustHue(primary, 30);
}
```

**원리**: 유사색 조화. Primary와 자연스럽게 어울리는 색상.

### Accent 파생

```typescript
// 색상환에서 180도 이동 (보색)
function deriveAccent(primary: string): string {
  return adjustHue(primary, 180);
}
```

**원리**: 보색 대비. 강한 시각적 주목도.

### Sub 파생

```typescript
// 채도 낮추고 밝게
function deriveSub(primary: string): string {
  return desaturate(lighten(primary, 40), 70);
}
```

**원리**: Primary 톤을 유지하면서 중립적 배경색 생성.

---

## 색상 스케일 (Color Scale)

각 메인 컬러에서 10단계 명도 스케일 생성:

```
50   ████░░░░░░  가장 밝음 (하이라이트, hover 배경)
100  █████░░░░░
200  ██████░░░░  밝은 배경
300  ███████░░░  비활성 요소
400  ████████░░
500  █████████░  기본값 (base)
600  ██████████  hover 상태
700  ██████████  active 상태
800  ██████████  진한 텍스트
900  ██████████  가장 어두움
```

### 스케일 생성 로직

```typescript
function generateScale(baseColor: string): ColorScale {
  return {
    50: lighten(baseColor, 45),   // 매우 밝음
    100: lighten(baseColor, 40),
    200: lighten(baseColor, 30),
    300: lighten(baseColor, 20),
    400: lighten(baseColor, 10),
    500: baseColor,               // 원본
    600: darken(baseColor, 10),
    700: darken(baseColor, 20),
    800: darken(baseColor, 30),
    900: darken(baseColor, 40),   // 매우 어두움
  };
}
```

---

## 시맨틱 컬러 매핑

4개 메인 컬러 스케일을 용도별로 매핑:

### Background (배경)

| 토큰 | 매핑 | 용도 |
|------|------|------|
| `bg.base` | `#FFFFFF` 또는 `sub.50` | 페이지 배경 |
| `bg.surface` | `sub.100` | 카드/패널 표면 |
| `bg.elevated` | `#FFFFFF` | 떠있는 요소 (모달 등) |
| `bg.muted` | `sub.200` | 비활성 영역 |

### Text (텍스트)

| 토큰 | 매핑 | 용도 |
|------|------|------|
| `text.primary` | `sub.900` | 주요 텍스트 |
| `text.secondary` | `sub.600` | 보조 텍스트 |
| `text.muted` | `sub.400` | 힌트, placeholder |
| `text.inverse` | `#FFFFFF` | 어두운 배경 위 |
| `text.onAction` | `#FFFFFF` | 버튼 위 텍스트 |

### Border (테두리)

| 토큰 | 매핑 | 용도 |
|------|------|------|
| `border.default` | `sub.300` | 기본 테두리 |
| `border.subtle` | `sub.200` | 연한 구분선 |
| `border.focus` | `primary.500` | 포커스 링 |

### Action (액션)

| 토큰 | 매핑 | 용도 |
|------|------|------|
| `action.primary.default` | `primary.500` | Primary 버튼 |
| `action.primary.hover` | `primary.600` | hover |
| `action.primary.active` | `primary.700` | active/pressed |
| `action.secondary.*` | `secondary.500/600/700` | Secondary 버튼 |
| `action.accent.*` | `accent.500/600` | Accent 강조 |

---

## 컴포넌트별 컬러 사용

### Button

| Variant | 배경 | 텍스트 | Border |
|---------|------|--------|--------|
| `primary` | `action.primary.default` | `text.onAction` | none |
| `secondary` | `action.secondary.default` | `text.onAction` | none |
| `accent` | `action.accent.default` | `text.onAction` | none |
| `outline` | transparent | `action.primary.default` | `action.primary.default` |
| `ghost` | transparent | `text.primary` | none |
| `subtle` | `bg.muted` | `text.primary` | none |

### Card

| 요소 | 컬러 |
|------|------|
| 배경 | `bg.surface` |
| 테두리 | `border.subtle` |
| 제목 | `text.primary` |
| 본문 | `text.secondary` |

### Input

| 상태 | 배경 | Border | 텍스트 |
|------|------|--------|--------|
| default | `bg.base` | `border.default` | `text.primary` |
| hover | `bg.base` | `sub.400` | `text.primary` |
| focus | `bg.base` | `border.focus` | `text.primary` |
| disabled | `bg.muted` | `border.subtle` | `text.muted` |
| placeholder | - | - | `text.muted` |

### Navigation

| 요소 | 컬러 |
|------|------|
| 배경 | `bg.surface` |
| 로고/제목 | `action.primary.default` |
| 링크 기본 | `text.primary` |
| 링크 hover | `action.primary.default` |
| 토글 버튼 | `action.accent.default` |

---

## CSS 변수 출력

```css
:root {
  /* Background */
  --ds-color-bg-base: #FFFFFF;
  --ds-color-bg-surface: #F5F5F5;
  --ds-color-bg-elevated: #FFFFFF;
  --ds-color-bg-muted: #E8E8E8;

  /* Text */
  --ds-color-text-primary: #1A1A1A;
  --ds-color-text-secondary: #666666;
  --ds-color-text-muted: #999999;
  --ds-color-text-inverse: #FFFFFF;
  --ds-color-text-onAction: #FFFFFF;

  /* Border */
  --ds-color-border-default: #D4D4D4;
  --ds-color-border-subtle: #E8E8E8;
  --ds-color-border-focus: #6366F1;

  /* Action - Primary */
  --ds-color-action-primary-default: #6366F1;
  --ds-color-action-primary-hover: #4F46E5;
  --ds-color-action-primary-active: #4338CA;

  /* Action - Secondary */
  --ds-color-action-secondary-default: #8B5CF6;
  --ds-color-action-secondary-hover: #7C3AED;
  --ds-color-action-secondary-active: #6D28D9;

  /* Action - Accent */
  --ds-color-action-accent-default: #F59E0B;
  --ds-color-action-accent-hover: #D97706;
}
```

---

## 접근성 고려

### 색상 대비 (WCAG 2.1)

| 레벨 | 비율 | 적용 |
|------|------|------|
| AA (일반 텍스트) | 4.5:1 | `text.primary` on `bg.base` |
| AA (대형 텍스트) | 3:1 | 제목, 버튼 텍스트 |
| AAA | 7:1 | 권장 (선택) |

### 검증 필요 조합

```
✅ text.primary on bg.base
✅ text.primary on bg.surface
✅ text.onAction on action.primary.default
✅ text.onAction on action.secondary.default
✅ text.onAction on action.accent.default
```

### 색맹 대응

- 색상만으로 정보 전달하지 않음
- 아이콘, 텍스트 라벨 병행
- focus 상태는 outline 추가
