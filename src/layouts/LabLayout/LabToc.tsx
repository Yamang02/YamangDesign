/**
 * E03: Lab 사이드바 목차
 */
import styles from './LabLayout.module.css';
import type { TocItem, TocItemTree } from './types';

interface LabTocProps {
  items: TocItem[] | TocItemTree[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}

function hasChildren(item: TocItem | TocItemTree): item is TocItemTree {
  return 'children' in item && Array.isArray((item as TocItemTree).children) && (item as TocItemTree).children!.length > 0;
}

function renderTocItems(
  items: (TocItem | TocItemTree)[],
  activeId: string | null,
  onItemClick: (id: string) => void,
  depth = 0
) {
  return items.map((item) => {
    const isActive = activeId === item.id;
    const hasChildItems = hasChildren(item);
    const children = hasChildItems ? (item as TocItemTree).children! : [];

    return (
      <li key={item.id}>
        <button
          type="button"
          className={`${styles.tocItem} ${isActive ? styles.tocItemActive : ''} ${depth > 0 ? styles.tocItemChild : ''}`}
          style={depth > 0 ? { paddingLeft: `calc(var(--ds-spacing-3) + ${depth * 12}px)` } : undefined}
          onClick={() => onItemClick(item.id)}
          aria-current={isActive ? 'location' : undefined}
        >
          {item.label}
        </button>
        {hasChildItems && (
          <ul className={styles.tocList}>
            {renderTocItems(children, activeId, onItemClick, depth + 1)}
          </ul>
        )}
      </li>
    );
  });
}

export function LabToc({ items, activeId, onItemClick }: LabTocProps) {
  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <ul className={styles.tocList}>
        {renderTocItems(items, activeId, onItemClick)}
      </ul>
    </nav>
  );
}
