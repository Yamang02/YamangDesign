/**
 * E05: Lab 비교 뷰 - 프리셋 나란히 비교용 카드
 *
 * 헤더에 실제 `<button>`이 올 수 있으므로, `headerAction`+`onClick` 동시에는
 * 루트를 `<button>`으로 두지 않는다(중첩 버튼·hydration 경고 방지).
 */
import type { KeyboardEvent } from 'react';
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
  const interactive = Boolean(onClick);
  /** 헤더 보조 버튼과 루트 네이티브 버튼을 동시에 쓰면 HTML상 중첩이 된다. */
  const useRootDivButton = interactive && Boolean(headerAction);
  const Wrapper = interactive && !useRootDivButton ? 'button' : 'div';

  let rootProps: Record<string, unknown> = {};
  if (interactive && useRootDivButton && onClick) {
    rootProps = {
      role: 'button' as const,
      tabIndex: 0 as const,
      onClick,
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      },
      'aria-pressed': selected,
    };
  } else if (interactive && !useRootDivButton && onClick) {
    rootProps = { type: 'button' as const, onClick, 'aria-pressed': selected };
  }

  return (
    <Wrapper
      {...rootProps}
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
