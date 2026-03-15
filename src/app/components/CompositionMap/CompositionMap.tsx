/**
 * E06 P05: 조합 구조 트리 — Molecule/Organism 모달에서 "구성 Atoms/Molecules" 시각화
 */
import styles from './CompositionMap.module.css';

export interface CompositionMapProps {
  /** 트리 라인 배열 (예: ["FormCard", "└── Card", "    └── FormField × 2"]) */
  lines: string[];
}

export function CompositionMap({ lines }: CompositionMapProps) {
  if (!lines.length) return null;
  return (
    <pre className={styles.tree} data-context="preview" aria-label="조합 구조">
      <code className={styles.code}>
        {lines.map((line, i) => (
          <span key={i} className={styles.line}>
            {line}
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </code>
    </pre>
  );
}
