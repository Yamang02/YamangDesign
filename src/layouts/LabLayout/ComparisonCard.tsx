/**
 * E05: Lab 비교 뷰 - 프리셋 나란히 비교용 카드
 */
import { clsx } from '../../utils/clsx';
import styles from './LabLayout.module.css';

export interface ComparisonCardProps {
  title: string;
  /** CSS 변수 오버라이드 (Palette/Style 적용용) */
  styleVars?: Record<string, string>;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export function ComparisonCard({
  title,
  styleVars = {},
  children,
  onClick,
  selected,
}: ComparisonCardProps) {
  return (
    <div
      className={clsx(styles.comparisonCard, selected && styles.comparisonCardSelected)}
      style={styleVars}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h3 className={styles.comparisonTitle}>{title}</h3>
      <div className={styles.comparisonContent}>{children}</div>
    </div>
  );
}
