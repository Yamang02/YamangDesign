/**
 * Font Overview Diagram - 타이포그래피 조정 요소 시각화
 * FontLab 상단에 표시되는 다이어그램
 */
import styles from './FontOverviewDiagram.module.css';
import overviewJson from '../../../content/labs/font-lab/overview.json';
import type { FontLabOverview } from '../../../content/labs/font-lab/types';

const overview = overviewJson as FontLabOverview;
const { typographyProperties, semanticRoles, sizeScale } = overview;

function TextStyleHierarchy() {
  return (
    <div className={styles.hierarchySection}>
      <h4 className={styles.sectionTitle}>타입 스케일</h4>
      <div className={styles.hierarchyGrid}>
        {sizeScale.map((size) => (
          <div key={size.name} className={styles.hierarchyItem}>
            <span className={styles.sizePreview} style={{ fontSize: size.px }}>
              Aa
            </span>
            <div className={styles.sizeInfo}>
              <span className={styles.sizeName}>{size.name}</span>
              <span className={styles.sizeValue}>{size.px}</span>
              <span className={styles.sizeUse}>{size.use}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SemanticMappingDiagram() {
  return (
    <div className={styles.semanticSection}>
      <h4 className={styles.sectionTitle}>시맨틱 매핑</h4>
      <div className={styles.semanticGrid}>
        {semanticRoles.map((item) => (
          <div key={item.role} className={styles.semanticItem}>
            <div className={styles.semanticHeader}>
              <code className={styles.roleCode}>{item.role}</code>
              <span className={styles.arrow}>→</span>
              <code className={styles.styleCode}>{item.styleName}</code>
            </div>
            <span className={styles.roleDesc}>{item.description}</span>
            <span className={styles.roleExample}>{item.example}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FontOverviewDiagram() {
  return (
    <div className={styles.diagram}>
      {/* Adjustable Properties */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>조정 가능한 요소</h4>
        <div className={styles.propertyGrid}>
          {typographyProperties.map((prop) => (
            <div key={prop.key} className={styles.propertyCard}>
              <div className={styles.propertyHeader}>
                <span className={styles.propertyLabel}>{prop.label}</span>
                <span className={styles.propertyDesc}>{prop.description}</span>
              </div>
              <div className={styles.scaleList}>
                {prop.scale.map((value, i) => (
                  <span key={i} className={styles.scaleTag}>
                    {value}
                  </span>
                ))}
              </div>
              <code className={styles.cssVar}>{prop.cssVar}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Type Scale */}
      <TextStyleHierarchy />

      {/* Semantic Mapping */}
      <SemanticMappingDiagram />
    </div>
  );
}
