/**
 * Font Overview Diagram - 타이포그래피 조정 요소 시각화
 * FontLab 상단에 표시되는 다이어그램
 */
import styles from './FontOverviewDiagram.module.css';

interface TypographyProperty {
  key: string;
  label: string;
  description: string;
  scale: string[];
  cssVar: string;
}

const typographyProperties: TypographyProperty[] = [
  {
    key: 'size',
    label: 'Font Size',
    description: '텍스트 크기',
    scale: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    cssVar: '--ds-text-{name}-size',
  },
  {
    key: 'weight',
    label: 'Font Weight',
    description: '텍스트 굵기',
    scale: ['normal', 'medium', 'semibold', 'bold'],
    cssVar: '--ds-font-weight-{name}',
  },
  {
    key: 'leading',
    label: 'Line Height',
    description: '줄 간격',
    scale: ['tight', 'normal', 'relaxed'],
    cssVar: '--ds-text-{name}-leading',
  },
  {
    key: 'tracking',
    label: 'Letter Spacing',
    description: '자간',
    scale: ['tight', 'normal', 'wide'],
    cssVar: '--ds-text-{name}-tracking',
  },
];

interface SemanticRole {
  role: string;
  styleName: string;
  description: string;
  example: string;
}

const semanticRoles: SemanticRole[] = [
  { role: 'page-title', styleName: 'heading-lg', description: '페이지 제목', example: 'Welcome' },
  { role: 'section-title', styleName: 'heading-md', description: '섹션 제목', example: 'Features' },
  { role: 'card-title', styleName: 'heading-sm', description: '카드 제목', example: 'Card Title' },
  { role: 'body', styleName: 'body-md', description: '본문', example: 'Lorem ipsum...' },
  { role: 'button', styleName: 'body-sm', description: '버튼', example: 'Click me' },
  { role: 'caption', styleName: 'body-xs', description: '캡션', example: 'Updated 2h ago' },
];

function TextStyleHierarchy() {
  const sizes = [
    { name: '3xl', px: '30px', use: 'Hero' },
    { name: '2xl', px: '24px', use: 'Page Title' },
    { name: 'xl', px: '20px', use: 'Section' },
    { name: 'lg', px: '18px', use: 'Subsection' },
    { name: 'md', px: '16px', use: 'Body' },
    { name: 'sm', px: '14px', use: 'UI' },
    { name: 'xs', px: '12px', use: 'Caption' },
  ];

  return (
    <div className={styles.hierarchySection}>
      <h4 className={styles.sectionTitle}>타입 스케일</h4>
      <div className={styles.hierarchyGrid}>
        {sizes.map((size) => (
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
