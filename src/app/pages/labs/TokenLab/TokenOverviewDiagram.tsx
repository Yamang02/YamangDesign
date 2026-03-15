/**
 * Token Lab Overview - 3-layer 구조 + 카테고리별 설명
 * StyleOverviewDiagram 패턴 따름 (LabOverview 래퍼 사용)
 */
import styles from './TokenOverviewDiagram.module.css';
import overviewJson from '../../../content/labs/token-lab/overview.json';

type Layer = {
  id: string;
  title: string;
  note: string;
  categories: { label: string; desc: string }[];
};

const { layers } = overviewJson as { layers: Layer[] };

export function TokenOverviewDiagram() {
  return (
    <div className={styles.diagram} role="img" aria-label="3-layer token architecture">
      {layers.map((layer) => (
        <div key={layer.id} className={styles.layerCard}>
          <h4 className={styles.layerTitle}>{layer.title}</h4>
          <p className={styles.layerNote}>{layer.note}</p>
          <dl className={styles.categoryList}>
            {layer.categories.map((cat) => (
              <div key={cat.label} className={styles.categoryRow}>
                <dt className={styles.categoryLabel}>{cat.label}</dt>
                <dd className={styles.categoryDesc}>{cat.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
