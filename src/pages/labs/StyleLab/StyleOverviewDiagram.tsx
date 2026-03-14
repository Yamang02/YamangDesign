/**
 * Style Overview Diagram - GUI 스타일 조정 요소 시각화
 * StyleLab 상단에 표시되는 다이어그램
 */
import styles from './StyleOverviewDiagram.module.css';
import overviewJson from '../../../content/labs/style-lab/overview.json';
import type { StyleLabOverview } from '../../../content/labs/style-lab/types';

const overview = overviewJson as StyleLabOverview;
const { styleProperties, styleVariants } = overview;

function StyleComparisonDiagram() {
  return (
    <div className={styles.comparisonSection}>
      <h4 className={styles.sectionTitle}>스타일 비교</h4>
      <div className={styles.styleGrid}>
        {styleVariants.map((variant) => (
          <div key={variant.name} className={styles.variantCard}>
            <div className={styles.variantHeader}>
              <span className={styles.variantName}>{variant.name}</span>
              <span className={styles.variantDesc}>{variant.description}</span>
            </div>
            <div
              className={styles.previewBox}
              style={{
                boxShadow: variant.preview.shadow,
                border: variant.preview.border,
                background: variant.preview.background,
              }}
            >
              <span className={styles.previewLabel}>Preview</span>
            </div>
            <ul className={styles.characteristicsList}>
              {variant.characteristics.map((char, i) => (
                <li key={i} className={styles.characteristicItem}>
                  {char}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElevationScaleDiagram() {
  const shadowSizes = [
    { key: 'none', label: 'None', value: 'none' },
    { key: 'sm', label: 'Small', value: '0 1px 2px rgba(0,0,0,0.05)' },
    { key: 'md', label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
    { key: 'lg', label: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)' },
    { key: 'xl', label: 'X-Large', value: '0 20px 25px rgba(0,0,0,0.1)' },
  ];

  return (
    <div className={styles.shadowSection}>
      <h4 className={styles.sectionTitle}>Elevation (그림자 스케일)</h4>
      <div className={styles.shadowScale}>
        {shadowSizes.map((size) => (
          <div key={size.key} className={styles.shadowItem}>
            <div
              className={styles.shadowSample}
              style={{ boxShadow: size.value }}
            />
            <span className={styles.shadowLabel}>{size.label}</span>
            <code className={styles.shadowKey}>shadow-{size.key}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StyleOverviewDiagram() {
  return (
    <div className={styles.diagram}>
      {/* Adjustable Properties */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>조정 가능한 요소</h4>
        <div className={styles.propertyGrid}>
          {styleProperties.map((prop) => (
            <div key={prop.key} className={styles.propertyCard}>
              <div className={styles.propertyHeader}>
                <span className={styles.propertyLabel}>{prop.label}</span>
                <span className={styles.propertyDesc}>{prop.description}</span>
              </div>
              <div className={styles.valueList}>
                {prop.values.map((value, i) => (
                  <span key={i} className={styles.valueTag}>
                    {value}
                  </span>
                ))}
              </div>
              <code className={styles.cssVar}>{prop.cssVar}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Elevation scale (shadow 시각화) */}
      <ElevationScaleDiagram />

      {/* Style Comparison */}
      <StyleComparisonDiagram />
    </div>
  );
}
