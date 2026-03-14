/**
 * E05: Lab 비교 뷰 - 프리셋 나란히 비교용 카드
 */
import { clsx } from '../../utils/clsx';
import styles from './LabLayout.module.css';

export interface ComparisonCardProps {
  title: string;
  /** 서브타이틀 (설명) */
  subtitle?: string;
  /** CSS 변수 오버라이드 (Palette/Style 적용용) */
  styleVars?: Record<string, string>;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  /** 헤더 우측 상단 액션 (아이콘 버튼 등) */
  headerAction?: React.ReactNode;
}

export function ComparisonCard({
  title,
  subtitle,
  styleVars = {},
  children,
  onClick,
  selected,
  headerAction,
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
      <div className={styles.comparisonHeader}>
        <div className={styles.comparisonHeaderMain}>
          <h3 className={styles.comparisonTitle}>{title}</h3>
          {subtitle && <p className={styles.comparisonSubtitle}>{subtitle}</p>}
        </div>
        {headerAction && (
          <div
            className={styles.comparisonHeaderAction}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            {headerAction}
          </div>
        )}
      </div>
      <div className={styles.comparisonContent}>
        <div data-context="preview">{children}</div>
      </div>
    </div>
  );
}
