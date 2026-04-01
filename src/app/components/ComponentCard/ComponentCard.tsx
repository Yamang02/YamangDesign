/**
 * E02 P04: 전시장 그리드용 컴포넌트 카드
 * elevation 1 (shadow-sm), hover 시 elevation 2 (shadow-md)
 * 프리뷰 영역에 data-context="preview" 적용해 테마 반영
 */
import type { ComponentCardProps } from './ComponentCard.types';
import styles from './ComponentCard.module.css';

export function ComponentCard({
  title,
  variantCount,
  preview,
  onClick,
  usedIn,
  composedOf,
  composedOfLabel = 'Atoms:',
}: Readonly<ComponentCardProps>) {
  const hasUsedIn = usedIn && usedIn.length > 0;
  const hasComposedOf = composedOf && composedOf.length > 0;
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`${title} 상세 보기`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.variantCount}>{variantCount} variants</span>
      </div>
      <div className={styles.preview} data-context="preview">
        {preview}
      </div>
      {hasUsedIn && (
        <div className={styles.usedIn} aria-label="사용처">
          <span className={styles.usedInLabel}>Used in:</span>
          {usedIn.map((name) => (
            <span key={name} className={styles.usedInBadge}>{name}</span>
          ))}
        </div>
      )}
      {hasComposedOf && (
        <div className={styles.composedOf} aria-label="구성">
          <span className={styles.composedOfLabel}>{composedOfLabel}</span>
          {composedOf.map((name) => (
            <span key={name} className={styles.composedOfBadge}>{name}</span>
          ))}
        </div>
      )}
    </button>
  );
}
