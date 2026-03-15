/**
 * E08: Lab 공통 레이아웃
 * E03: 사이드바 TOC 통합
 */
import { useState, useEffect, useMemo } from 'react';
import { LabToc } from './LabToc';
import styles from './LabLayout.module.css';
import type { TocItem, TocItemTree } from './types';

function flattenTocIds(items: (TocItem | TocItemTree)[]): string[] {
  return items.flatMap((item) => {
    const ids = [item.id];
    if ('children' in item && Array.isArray(item.children) && item.children.length > 0) {
      ids.push(...flattenTocIds(item.children));
    }
    return ids;
  });
}

export interface LabLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** TOC 표시 여부 (기본: true) */
  showToc?: boolean;
  /** TOC 항목 목록 (2개 이상일 때만 표시, flat 또는 tree) */
  tocItems?: TocItem[] | TocItemTree[];
  /** 기본값: 'scroll'. 'tab'이면 TOC 대신 상단 탭 바 렌더 */
  navigationMode?: 'scroll' | 'tab';
}

export function LabLayout({
  title,
  subtitle,
  children,
  showToc = true,
  tocItems = [],
  navigationMode = 'scroll',
}: LabLayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const idsToObserve = useMemo(() => flattenTocIds(tocItems), [tocItems]);
  const useToc = showToc && idsToObserve.length >= 2 && navigationMode === 'scroll';
  const useTabBar = showToc && idsToObserve.length >= 2 && navigationMode === 'tab';

  useEffect(() => {
    if (!useToc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const sorted = visible.sort(
          (a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
        );
        setActiveSection(sorted[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    idsToObserve.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [useToc, idsToObserve]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  const flatItems = tocItems.flatMap((item) => {
    if ('children' in item && Array.isArray(item.children) && item.children.length > 0) {
      return [item, ...item.children];
    }
    return [item];
  });

  return (
    <div className={styles.labLayoutWrapper} data-shell>
      {useToc && (
        <LabToc
          items={tocItems}
          activeId={activeSection}
          onItemClick={handleNavClick}
        />
      )}
      {useTabBar && (
        <div className={styles.tabBar} role="tablist">
          {flatItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeSection === item.id}
              className={activeSection === item.id ? styles.tabActive : styles.tab}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
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
