# E02: 섹션 카드 레이아웃

## 목표

각 섹션을 카드로 감싸서 시각적 분리를 강화하고, 섹션 간 구분을 명확하게 함

## 현재 상태

```
┌─────────────────────────────────────┐
│  Lab Header                         │
├─────────────────────────────────────┤
│  Section Title                      │
│  ───────────────────────────────    │ ← hr 태그로만 구분
│  content content content            │
│                                     │
│  Section Title                      │
│  ───────────────────────────────    │
│  content content content            │
└─────────────────────────────────────┘
```

## 목표 상태

```
┌─────────────────────────────────────┐
│  Lab Header                         │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ Section Title                 │  │
│  │                               │  │
│  │ content content content       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Section Title                 │  │
│  │                               │  │
│  │ content content content       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 설계

### 컴포넌트 구조

기존 `LabSection`을 확장하여 카드 스타일 옵션 추가:

```tsx
// src/layouts/LabLayout/LabSection.tsx

export interface LabSectionProps {
  title: string;
  children: React.ReactNode;
  /** 카드 스타일 적용 여부 (기본: true) */
  card?: boolean;
  /** 섹션 ID (TOC 연동용) */
  id?: string;
}

export function LabSection({
  title,
  children,
  card = true,
  id
}: LabSectionProps) {
  const content = (
    <section id={id} className={styles.labSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );

  if (!card) return content;

  return (
    <div className={styles.sectionCard}>
      {content}
    </div>
  );
}
```

### CSS 스타일

```css
/* src/layouts/LabLayout/LabLayout.module.css */

/* 기존 스타일 유지 */
.labSection {
  padding: var(--ds-spacing-4) 0;
}

.sectionTitle {
  font-size: var(--ds-text-xl);
  font-weight: var(--ds-font-weight-semibold);
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-spacing-4) 0;
}

.sectionContent {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-spacing-4);
}

/* 신규: 섹션 카드 래퍼 */
.sectionCard {
  background-color: var(--ds-color-bg-surface);
  border: 1px solid var(--ds-color-border-subtle);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-spacing-6);
  margin-bottom: var(--ds-spacing-6);
  box-shadow: var(--ds-shadow-sm);
}

.sectionCard .labSection {
  padding: 0;
}

.sectionCard:last-child {
  margin-bottom: 0;
}
```

## 마이그레이션

### Before

```tsx
<LabSection title="Text Styles" withDivider={false}>
  {/* content */}
</LabSection>

<LabSection title="Semantic Mapping">
  {/* content */}
</LabSection>
```

### After

```tsx
<LabSection title="Text Styles" id="text-styles">
  {/* content */}
</LabSection>

<LabSection title="Semantic Mapping" id="semantic-mapping">
  {/* content */}
</LabSection>
```

- `withDivider` prop 제거 (더 이상 필요 없음)
- `id` prop 추가 (E03 TOC 연동 준비)
- `card` prop은 기본 true이므로 명시 불필요

## 체크리스트

- [ ] LabSection 컴포넌트 수정
- [ ] CSS 스타일 추가
- [ ] `withDivider` prop 제거
- [ ] 각 Lab 페이지에서 `id` prop 추가
- [ ] 시각적 검증
