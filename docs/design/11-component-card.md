# 11. Component: Card

## Overview

Surface와 Shadow 토큰을 검증하는 컨테이너 컴포넌트. 테마별 표면 표현 차이를 보여줌.

---

## 역할

- surface 토큰 테스트
- shadow 구조 검증 (Minimal drop shadow vs Neumorphism raised)
- 컨텐츠 그룹핑

---

## Props 정의

```typescript
// components/Card/Card.types.ts

export interface CardProps {
  /**
   * 카드 변형
   * - elevated: 기본 그림자 있음
   * - outlined: 테두리만 (Minimal용)
   * - flat: 그림자 없음
   */
  variant?: 'elevated' | 'outlined' | 'flat';

  /**
   * 패딩 크기
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * hover 시 elevation 증가
   */
  hoverable?: boolean;

  /**
   * 클릭 가능 (cursor: pointer)
   */
  clickable?: boolean;

  /**
   * 클릭 핸들러
   */
  onClick?: () => void;

  /**
   * 카드 내용
   */
  children: React.ReactNode;

  /**
   * 추가 클래스명
   */
  className?: string;
}

// Card 하위 컴포넌트
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}
```

---

## 구조

```
┌─────────────────────────────────────┐
│ Card                                │
│ ┌─────────────────────────────────┐ │
│ │ Card.Header                     │ │
│ │ 제목, 아이콘 등                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Card.Body                       │ │
│ │ 주요 컨텐츠                      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Card.Footer                     │ │
│ │ 액션 버튼 등                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Variant별 스타일

### Elevated (기본)

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | bg.surface | bg.surface (배경과 동일) |
| 테두리 | border.subtle (1px) | none |
| Shadow | md (drop) | md (raised) |
| Hover | lg (drop) | lg (raised) |

### Outlined

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | bg.base | bg.surface |
| 테두리 | border.default (1px) | border.subtle (미세) |
| Shadow | none | none |
| Hover | border 색상 변화 | sm (raised) |

### Flat

| 요소 | Minimal | Neumorphism |
|------|---------|-------------|
| 배경 | bg.surface | bg.surface |
| 테두리 | none | none |
| Shadow | none | none |
| Hover | bg.muted | inset (미세) |

---

## 스타일 정의

```typescript
// components/Card/Card.styles.ts

export const cardStyles = {
  base: `
    border-radius: var(--ds-radius-lg);
    transition:
      box-shadow var(--ds-duration-normal) var(--ds-ease-out),
      transform var(--ds-duration-normal) var(--ds-ease-out),
      border-color var(--ds-duration-fast) var(--ds-ease-out);
  `,

  padding: {
    none: 'padding: 0;',
    sm: 'padding: var(--ds-spacing-3);',
    md: 'padding: var(--ds-spacing-4);',
    lg: 'padding: var(--ds-spacing-6);',
  },

  variants: {
    elevated: `
      background-color: var(--ds-color-bg-surface);
      border: var(--ds-border-thin) solid var(--ds-color-border-subtle);
      box-shadow: var(--ds-shadow-md);
    `,

    outlined: `
      background-color: var(--ds-color-bg-base);
      border: var(--ds-border-thin) solid var(--ds-color-border-default);
      box-shadow: none;
    `,

    flat: `
      background-color: var(--ds-color-bg-surface);
      border: none;
      box-shadow: none;
    `,
  },

  states: {
    hoverable: {
      elevated: `
        &:hover {
          box-shadow: var(--ds-shadow-lg);
          transform: translateY(-2px);
        }
      `,
      outlined: `
        &:hover {
          border-color: var(--ds-color-border-focus);
        }
      `,
      flat: `
        &:hover {
          background-color: var(--ds-color-bg-muted);
        }
      `,
    },

    clickable: `
      cursor: pointer;
      user-select: none;

      &:active {
        transform: translateY(0);
        box-shadow: var(--ds-shadow-sm);
      }
    `,
  },

  // 하위 컴포넌트
  header: `
    padding: var(--ds-spacing-4);
    border-bottom: var(--ds-border-thin) solid var(--ds-color-border-subtle);
    font-weight: var(--ds-font-semibold);
    font-size: var(--ds-text-lg);
    color: var(--ds-color-text-primary);
  `,

  body: `
    padding: var(--ds-spacing-4);
    color: var(--ds-color-text-secondary);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-normal);
  `,

  footer: `
    padding: var(--ds-spacing-4);
    border-top: var(--ds-border-thin) solid var(--ds-color-border-subtle);
    display: flex;
    gap: var(--ds-spacing-2);
    justify-content: flex-end;
  `,
} as const;
```

---

## 컴포넌트 구현

```tsx
// components/Card/Card.tsx

import type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card.types';
import { clsx } from '@/utils/clsx';

export function Card({
  variant = 'elevated',
  padding = 'none',
  hoverable = false,
  clickable = false,
  onClick,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        hoverable && 'card--hoverable',
        clickable && 'card--clickable',
        className
      )}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// 하위 컴포넌트
Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('card__header', className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={clsx('card__body', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('card__footer', className)}>
      {children}
    </div>
  );
};
```

---

## 테마별 차이점

### Minimal

```
┌─────────────────────┐
│                     │ ← 흰색/밝은 회색 배경
│   Card Content      │ ← 1px border (subtle)
│                     │
└─────────────────────┘
          ░░░░░░░░░░░░░ ← drop shadow (아래 방향)
```

### Neumorphism

```
░░░░┌─────────────────────┐
░░░░│                     │ ← 배경과 동일 색상
░░░░│   Card Content      │ ← border 없음
░░░░│                     │
░░░░└─────────────────────┘▓▓▓▓
                      ▓▓▓▓▓▓▓▓
        (좌상: 밝음, 우하: 어두움)
```

---

## 접근성

### 클릭 가능한 카드

```tsx
<Card
  clickable
  onClick={handleClick}
  // 자동으로 추가되는 속성:
  // role="button"
  // tabIndex={0}
>
  <Card.Body>Click me</Card.Body>
</Card>
```

### 키보드 지원

```tsx
// Card 내부에서 키보드 이벤트 처리
onKeyDown={(e) => {
  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
    onClick?.();
  }
}}
```

### Focus 스타일

```css
.card--clickable:focus-visible {
  outline: 2px solid var(--ds-color-border-focus);
  outline-offset: 2px;
}
```

---

## 사용 예시

### 기본 사용

```tsx
<Card>
  <Card.Header>카드 제목</Card.Header>
  <Card.Body>
    카드 내용이 여기에 들어갑니다.
  </Card.Body>
  <Card.Footer>
    <Button variant="ghost">취소</Button>
    <Button variant="primary">확인</Button>
  </Card.Footer>
</Card>
```

### Variant

```tsx
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="flat">Flat Card</Card>
```

### Interactive

```tsx
<Card hoverable>
  <Card.Body>Hover me</Card.Body>
</Card>

<Card clickable onClick={() => console.log('clicked')}>
  <Card.Body>Click me</Card.Body>
</Card>
```

### 패딩 조절

```tsx
<Card padding="lg">
  <p>Content with large padding</p>
</Card>

<Card padding="none">
  <Card.Header>Header</Card.Header>
  <Card.Body>Body</Card.Body>
</Card>
```

---

## 검증 항목

POC에서 확인할 것:

- [ ] elevated 카드의 shadow가 테마별로 다르게 표현
- [ ] Minimal: drop shadow, Neumorphism: raised shadow
- [ ] hoverable 상태에서 elevation 증가
- [ ] surface 색상이 테마에 맞게 적용
- [ ] Header/Body/Footer 구분선 표시
