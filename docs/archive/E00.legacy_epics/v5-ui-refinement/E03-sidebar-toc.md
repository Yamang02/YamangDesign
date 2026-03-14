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

  // Intersection Observer: viewport 상단 40% 영역에 들어온 섹션을 active로 설정
  useEffect(() => {
    if (!showToc || tocItems.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length === 0) return;
        // viewport 상단에 가장 가까운 섹션 선택 (boundingClientRect.top 기준)
        const sorted = visibleEntries.sort(
          (a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
        );
        setActiveSection(sorted[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
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
      {showToc && tocItems.length >= 2 && (
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
              aria-current={activeId === item.id ? 'location' : undefined}
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

.tocItem:focus-visible {
  outline: 2px solid var(--ds-color-border-focus);
  outline-offset: 2px;
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

**LabSection scroll-margin**: 고정 헤더 아래 스크롤 시 섹션이 가려지지 않도록 `section[id]`에 `scroll-margin-top` 적용 (LabLayout.module.css):

```css
/* E03: TOC 클릭 시 스크롤 위치 보정 */
section[id] {
  scroll-margin-top: calc(var(--nav-height, 56px) + var(--ds-spacing-6));
}
```

## 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `src/layouts/LabLayout/types.ts` | 신규 - TocItem 인터페이스 |
| `src/layouts/LabLayout/LabToc.tsx` | 신규 - TOC 컴포넌트 |
| `src/layouts/LabLayout/LabLayout.tsx` | showToc, tocItems prop, Intersection Observer, LabToc 통합 |
| `src/layouts/LabLayout/LabLayout.module.css` | labLayoutWrapper, toc 스타일, section scroll-margin-top |
| `src/layouts/LabLayout/index.ts` | LabToc, TocItem export |
| `src/pages/layouts/FontLab/FontLab.tsx` | tocItems 추가 |
| `src/pages/layouts/PaletteLab/PaletteLab.tsx` | tocItems 생략 (1개 섹션만 있어 TOC 미표시) |
| `src/pages/layouts/StyleLab/StyleLab.tsx` | tocItems 추가 |
| `src/pages/layouts/Playground/Playground.tsx` | tocItems 생략 (1개 섹션만 있어 TOC 미표시) |

## 주의사항

- **TOC 표시 조건**: `tocItems.length >= 2`일 때만 표시 (1개 섹션만 있으면 TOC 비표시)
- **E04 호환**: TOC의 sticky `top`은 `--nav-height` 사용. E04 미적용 시 fallback 56px 적용
- **섹션 id 일치**: tocItems의 `id`는 LabSection의 `id` prop과 정확히 일치해야 함

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
- [ ] Intersection Observer 구현 (다중 visible 섹션 시 상단 기준 선택)
- [ ] CSS 스타일 추가 (focus-visible, scroll-margin-top)
- [ ] 반응형 처리 (768px 이하 TOC 숨김)
- [ ] FontLab, StyleLab에 tocItems 추가 (2개 이상 섹션)
- [ ] 스크롤 동작 및 접근성(aria-current) 검증
