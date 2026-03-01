/**
 * Color Usage Diagram - 브랜드 컬러 용도 시각화
 * PaletteLab 상단에 표시되는 인터랙티브 다이어그램
 */
import { useState } from 'react';
import styles from './ColorUsageDiagram.module.css';

interface ColorRole {
  key: string;
  label: string;
  description: string;
  usages: string[];
  cssVar: string;
}

const colorRoles: ColorRole[] = [
  {
    key: 'primary',
    label: 'Primary',
    description: '브랜드 정체성, 주요 액션',
    usages: ['주요 버튼', 'CTA', '링크', '로고', '포커스 링'],
    cssVar: '--ds-color-primary-500',
  },
  {
    key: 'secondary',
    label: 'Secondary',
    description: '보조 액션, 대안적 강조',
    usages: ['보조 버튼', '선택된 항목', '태그', '탭'],
    cssVar: '--ds-color-secondary-500',
  },
  {
    key: 'accent',
    label: 'Accent',
    description: '하이라이트, 주의 끌기',
    usages: ['CTA 강조', '배지', '알림', '프로모션'],
    cssVar: '--ds-color-accent-500',
  },
  {
    key: 'sub',
    label: 'Sub',
    description: '미묘한 강조, 보조 UI',
    usages: ['비활성 요소', '구분선', '아이콘', '보조 텍스트'],
    cssVar: '--ds-color-sub-500',
  },
  {
    key: 'neutral',
    label: 'Neutral',
    description: '배경, 텍스트, 테두리',
    usages: ['본문 텍스트', '배경', '테두리', '그림자'],
    cssVar: '--ds-color-neutral-500',
  },
];

/** 코드에서 사용하는 시맨틱 토큰 (ThemeProvider가 theme.colors → --ds-color-* 로 주입) */
interface SemanticToken {
  token: string;
  note: string;
}

const semanticMappings: Array<{ category: string; items: SemanticToken[] }> = [
  {
    category: 'Background',
    items: [
      { token: '--ds-color-bg-base', note: '페이지 배경' },
      { token: '--ds-color-bg-surface', note: '카드, 패널' },
      { token: '--ds-color-bg-elevated', note: '모달, 팝오버' },
      { token: '--ds-color-bg-muted', note: '비활성 영역' },
    ],
  },
  {
    category: 'Text',
    items: [
      { token: '--ds-color-text-primary', note: '본문' },
      { token: '--ds-color-text-secondary', note: '부제목' },
      { token: '--ds-color-text-muted', note: '플레이스홀더, 힌트' },
      { token: '--ds-color-text-inverse', note: '어두운 배경 위' },
      { token: '--ds-color-text-onAction', note: '버튼 위 텍스트' },
    ],
  },
  {
    category: 'Border',
    items: [
      { token: '--ds-color-border-default', note: '기본' },
      { token: '--ds-color-border-subtle', note: '미묘한 구분선' },
      { token: '--ds-color-border-focus', note: '포커스 링' },
    ],
  },
  {
    category: 'Action',
    items: [
      { token: '--ds-color-action-primary-default', note: 'Primary 기본' },
      { token: '--ds-color-action-primary-hover', note: 'Primary 호버' },
      { token: '--ds-color-action-primary-active', note: 'Primary 액티브' },
      { token: '--ds-color-action-secondary-default', note: 'Secondary 기본' },
      { token: '--ds-color-action-secondary-hover', note: 'Secondary 호버' },
      { token: '--ds-color-action-secondary-active', note: 'Secondary 액티브' },
      { token: '--ds-color-action-accent-default', note: 'Accent 기본' },
      { token: '--ds-color-action-accent-hover', note: 'Accent 호버' },
      { token: '--ds-color-action-accent-active', note: 'Accent 액티브' },
    ],
  },
];

function SemanticMappingTabs({
  mappings,
}: {
  mappings: Array<{ category: string; items: SemanticToken[] }>;
}) {
  const [activeCategory, setActiveCategory] = useState(mappings[0]?.category ?? '');
  const activeMapping = mappings.find((m) => m.category === activeCategory);

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>시맨틱 컬러 매핑</h4>
      <div className={styles.mappingTabs}>
        <div className={styles.tabList} role="tablist">
          {mappings.map((m) => (
            <button
              key={m.category}
              type="button"
              role="tab"
              aria-selected={activeCategory === m.category}
              className={styles.tab}
              data-active={activeCategory === m.category}
              onClick={() => setActiveCategory(m.category)}
            >
              {m.category}
            </button>
          ))}
        </div>
        <div className={styles.tabPanel} role="tabpanel">
          {activeMapping && (
            <div className={styles.tokenList}>
              {activeMapping.items.map((item) => (
                <div key={item.token} className={styles.tokenRow}>
                  <div
                    className={styles.tokenSwatch}
                    style={{ backgroundColor: `var(${item.token})` }}
                    title={item.token}
                  />
                  <code className={styles.tokenName}>{item.token}</code>
                  {item.note && <span className={styles.tokenNote}>{item.note}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComponentDiagram() {
  return (
    <div className={styles.componentDiagram}>
      <div className={styles.diagramTitle}>컴포넌트 예시</div>
      <div className={styles.mockUI}>
        {/* Mock Card */}
        <div className={styles.mockCard}>
          <div className={styles.mockCardHeader}>
            <span className={styles.mockTitle}>Card Title</span>
            <span className={styles.mockBadge}>Accent</span>
          </div>
          <p className={styles.mockBody}>
            본문 텍스트는 <span className={styles.colorTag} data-color="neutral">neutral</span>을 사용합니다.
          </p>
          <div className={styles.mockActions}>
            <button className={styles.mockBtnPrimary}>
              <span className={styles.colorTag} data-color="primary">Primary</span>
            </button>
            <button className={styles.mockBtnSecondary}>
              <span className={styles.colorTag} data-color="secondary">Secondary</span>
            </button>
          </div>
        </div>
        {/* Mock Input */}
        <div className={styles.mockInputGroup}>
          <label className={styles.mockLabel}>Input Label</label>
          <div className={styles.mockInput}>
            <span className={styles.mockPlaceholder}>Placeholder text</span>
          </div>
          <span className={styles.mockHelper}>Helper text uses muted color</span>
        </div>
      </div>
    </div>
  );
}

export function ColorUsageDiagram() {
  return (
    <div className={styles.diagram}>
      {/* Color Roles Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>브랜드 컬러 역할</h4>
        <div className={styles.roleGrid}>
          {colorRoles.map((role) => (
            <div key={role.key} className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: `var(${role.cssVar})` }}
                />
                <div className={styles.roleInfo}>
                  <span className={styles.roleLabel}>{role.label}</span>
                  <span className={styles.roleDesc}>{role.description}</span>
                </div>
              </div>
              <div className={styles.usageList}>
                {role.usages.map((usage, i) => (
                  <span key={i} className={styles.usageTag}>
                    {usage}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Mapping Section */}
      <SemanticMappingTabs mappings={semanticMappings} />

      {/* Component Diagram */}
      <ComponentDiagram />
    </div>
  );
}
