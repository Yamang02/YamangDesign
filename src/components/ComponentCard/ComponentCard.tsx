/**
 * E02 P04: 전시장 그리드용 컴포넌트 카드
 * elevation 1 (shadow-sm), hover 시 elevation 2 (shadow-md)
 * 프리뷰 영역에 data-context="preview" 적용해 테마 반영
 */
import type { ReactNode } from 'react';
import styles from './ComponentCard.module.css';

export interface ComponentCardProps {
  id: string;
  title: string;
  variantCount: number;
  preview: ReactNode;
  onClick: () => void;
  /** E06 P04: 이 Atom이 어떤 Molecule에서 쓰이는지 (Atoms 카드 하단) */
  usedIn?: string[];
  /** E06 P05: 이 Molecule/Organism을 구성하는 Atoms/Molecules 이름 목록 (카드 하단) */
  composedOf?: string[];
}

export function ComponentCard({
  title,
  variantCount,
  preview,
  onClick,
  usedIn,
  composedOf,
}: ComponentCardProps) {
  const hasUsedIn = usedIn && usedIn.length > 0;
  const hasComposedOf = composedOf && composedOf.length > 0;
  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
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
          {usedIn!.map((name) => (
            <span key={name} className={styles.usedInBadge}>{name}</span>
          ))}
        </div>
      )}
      {hasComposedOf && (
        <div className={styles.composedOf} aria-label="구성">
          <span className={styles.composedOfLabel}>Atoms:</span>
          {composedOf!.map((name) => (
            <span key={name} className={styles.composedOfBadge}>{name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
