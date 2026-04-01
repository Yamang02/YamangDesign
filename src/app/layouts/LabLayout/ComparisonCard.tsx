/**
 * E05: Lab 비교 뷰 - 프리셋 나란히 비교용 카드
 */
import { clsx } from '@shared/utils/clsx';
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
  /** 콘텐츠 영역에 surface(material) 토큰을 직접 적용 */
  surfaceContent?: boolean;
}

export function ComparisonCard({
  title,
  subtitle,
  styleVars = {},
  children,
  onClick,
  selected,
  headerAction,
  surfaceContent = false,
}: Readonly<ComparisonCardProps>) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={clsx(
        styles.comparisonCard,
        selected && styles.comparisonCardSelected,
        surfaceContent && styles.comparisonCardSurface
      )}
    >
      <div className={styles.comparisonHeader}>
        <div className={styles.comparisonHeaderMain}>
          <h3 className={styles.comparisonTitle}>{title}</h3>
          {subtitle && <p className={styles.comparisonSubtitle}>{subtitle}</p>}
        </div>
        {headerAction && (
          <div // NOSONAR typescript:S6819 typescript:S6847 — 헤더 액션 래퍼(카드 버튼과 이벤트 분리)
            className={styles.comparisonHeaderAction}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
            }}
            role="group"
            aria-label="카드 헤더 액션"
          >
            {headerAction}
          </div>
        )}
      </div>
      <div
        className={clsx(styles.comparisonContent, surfaceContent && styles.comparisonContentSurface)}
        data-context="preview"
        data-scope="local"
        style={styleVars}
      >
        <div>{children}</div>
      </div>
    </Wrapper>
  );
}
