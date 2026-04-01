import type { ReactNode } from 'react';
import { clsx } from '@shared/utils/clsx';
import styles from './ComparisonGrid.module.css';

export interface ComparisonGridProps {
  children: ReactNode;
  /** CSS 변수 맵 — wrapper에 인라인으로 주입, 자식 카드에 cascade로 전달 */
  paletteVars?: Record<string, string>;
  className?: string;
}

export function ComparisonGrid({ children, paletteVars, className }: Readonly<ComparisonGridProps>) {
  return (
    <div
      className={clsx(styles.grid, className)}
      style={paletteVars}
    >
      {children}
    </div>
  );
}
