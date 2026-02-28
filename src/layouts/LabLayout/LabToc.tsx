/**
 * E03: Lab 사이드바 목차
 */
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
        {items.map((item) => (
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
