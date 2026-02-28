# E03: 사이드바 TOC

## 목표

좌측에 섹션 목차(Table of Contents)를 배치하여 긴 Lab 페이지에서의 탐색성 향상

## 목표 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Navigation                                             │
├─────────────────────────────────────────────────────────┤
│         │                                               │
│  TOC    │  Lab Header                                   │
│  ────── │                                               │
│  • Sec1 │  ┌───────────────────────────────────────┐    │
│  ○ Sec2 │  │ Section 1 (active)                    │    │
│  ○ Sec3 │  │ content...                            │    │
│  ○ Sec4 │  └───────────────────────────────────────┘    │
│         │                                               │
│         │  ┌───────────────────────────────────────┐    │
│         │  │ Section 2                             │    │
│         │  │ content...                            │    │
│         │  └───────────────────────────────────────┘    │
│         │                                               │
└─────────────────────────────────────────────────────────┘
```

## 설계

### 데이터 구조

```typescript
// src/layouts/LabLayout/types.ts

export interface TocItem {
  id: string;
  label: string;
}
```

### LabLayout 확장

```tsx
// src/layouts/LabLayout/LabLayout.tsx

import { useState, useEffect } from 'react';
import { LabToc } from './LabToc';
import styles from './LabLayout.module.css';

export interface LabLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** TOC 표시 여부 (기본: true) */
  showToc?: boolean;
  /** TOC 항목 목록 */
  tocItems?: TocItem[];
}

export function LabLayout({
  title,
  subtitle,
  children,
  showToc = true,
  tocItems = []
}: LabLayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Intersection Observer로 현재 보이는 섹션 추적
  useEffect(() => {
    if (!showToc || tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    tocItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showToc, tocItems]);

  const handleTocClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.labLayoutWrapper}>
      {showToc && tocItems.length > 0 && (
        <LabToc
          items={tocItems}
          activeId={activeSection}
          onItemClick={handleTocClick}
        />
      )}
      <div className={styles.labLayout}>
        <header className={styles.labHeader}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
        <div className={styles.labContent}>{children}</div>
      </div>
    </div>
  );
}
```

### LabToc 컴포넌트

```tsx
// src/layouts/LabLayout/LabToc.tsx

import styles from './LabLayout.module.css';
import type { TocItem } from './types';

interface LabTocProps {
  items: TocItem[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}

export function LabToc({ items, activeId, onItemClick }: LabTocProps) {
  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <ul className={styles.tocList}>
        {items.map(item => (
          <li key={item.id}>
            <button
              type="button"
              className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
              onClick={() => onItemClick(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### CSS 스타일

```css
/* src/layouts/LabLayout/LabLayout.module.css */

.labLayoutWrapper {
  display: flex;
  min-height: 100%;
}

/* TOC */
.toc {
  position: sticky;
  top: calc(var(--nav-height, 56px) + var(--ds-spacing-6));
  width: 200px;
  flex-shrink: 0;
  padding: var(--ds-spacing-6);
  padding-right: 0;
  align-self: flex-start;
}

.tocList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-spacing-1);
}

.tocItem {
  display: block;
  width: 100%;
  padding: var(--ds-spacing-2) var(--ds-spacing-3);
  font-size: var(--ds-text-sm);
  color: var(--ds-color-text-secondary);
  background: none;
  border: none;
  border-left: 2px solid var(--ds-color-border-subtle);
  text-align: left;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;
}

.tocItem:hover {
  color: var(--ds-color-text-primary);
}

.tocItemActive {
  color: var(--ds-color-text-primary);
  border-left-color: var(--ds-color-border-focus);
  font-weight: var(--ds-font-weight-medium);
}

/* 반응형: 작은 화면에서 TOC 숨김 */
@media (max-width: 768px) {
  .toc {
    display: none;
  }

  .labLayoutWrapper {
    display: block;
  }
}
```

## 사용 예시

```tsx
// FontLab.tsx

const tocItems: TocItem[] = [
  { id: 'text-styles', label: 'Text Styles' },
  { id: 'semantic-mapping', label: 'Semantic Mapping' },
  { id: 'type-scale', label: 'Type Scale' },
  { id: 'font-families', label: 'Font Families' },
];

export function FontLab() {
  return (
    <LabLayout
      title="Font Lab"
      subtitle="Typography Explorer"
      tocItems={tocItems}
    >
      <LabSection title="Text Styles" id="text-styles">
        {/* ... */}
      </LabSection>
      <LabSection title="Semantic Mapping" id="semantic-mapping">
        {/* ... */}
      </LabSection>
      {/* ... */}
    </LabLayout>
  );
}
```

## 체크리스트

- [ ] TocItem 타입 정의
- [ ] LabToc 컴포넌트 생성
- [ ] LabLayout에 TOC 통합
- [ ] Intersection Observer 구현
- [ ] CSS 스타일 추가
- [ ] 반응형 처리
- [ ] 각 Lab 페이지에 tocItems 추가
- [ ] 스크롤 동작 검증
