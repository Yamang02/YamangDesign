/**
 * E05: Style Lab - GUI 스타일 비교 뷰 + DetailPanel
 */
import { useState } from 'react';
import { Button, Card, DetailPanel } from '../../../components';
import { LabLayout, LabSection, LabOverview, ComparisonCard, type TocItem } from '../../../layouts';
import {
  getStyleVariables,
  comparisonPresets,
  sampleText,
  buttonLabels,
  sectionTitles,
} from '../../../constants';
import { createStyle } from '../../../styles';
import { stylePresets } from '../../../themes/presets';
import type { StyleName } from '../../../@types/theme';
import { StyleOverviewDiagram } from './StyleOverviewDiagram';
import styles from './StyleLab.module.css';

const shadowKeys = ['sm', 'md', 'lg'] as const;

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'shadow-comparison', label: sectionTitles.shadowComparison },
  { id: 'component-comparison', label: sectionTitles.componentComparison },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STYLE_METADATA: Record<
  StyleName,
  { description: string; characteristics: string[] }
> = {
  minimal: {
    description: '클린하고 모던한 스타일',
    characteristics: ['아래 방향 드롭 섀도우', '얇은 테두리 (1px)', '플랫한 배경'],
  },
  neumorphism: {
    description: '소프트하고 입체적인 스타일',
    characteristics: ['양방향 그림자 (raised)', '테두리 없음', '배경과 융합'],
  },
  glassmorphism: {
    description: '반투명 글래스 효과',
    characteristics: ['부드러운 블러 그림자', '얇은 rgba 테두리', '반투명 배경'],
  },
  brutalism: {
    description: '거칠고 강렬한 비주얼',
    characteristics: ['하드 드롭 섀도우', '굵은 테두리 (3px)', '강한 대비'],
  },
};

function StyleDetail({ name }: { name: StyleName }) {
  const styleDef = stylePresets[name];
  const meta = STYLE_METADATA[name];
  if (!styleDef) return null;
  const resolved = createStyle(styleDef, '#f5f5f5');

  return (
    <div className={styles.styleDetail}>
      {meta && (
        <>
          <h4 className={styles.detailSectionTitle}>설명</h4>
          <p className={styles.detailDescription}>{meta.description}</p>
          <h4 className={styles.detailSectionTitle}>특징</h4>
          <ul className={styles.characteristicsList}>
            {meta.characteristics.map((char, i) => (
              <li key={i} className={styles.characteristicItem}>
                {char}
              </li>
            ))}
          </ul>
        </>
      )}
      <h4 className={styles.detailSectionTitle}>Surface</h4>
      <div className={styles.borderInfo}>
        <span>default: {styleDef.surface.default}</span>
        <span>interactive: {styleDef.surface.interactive}</span>
        <span>active: {styleDef.surface.active}</span>
      </div>
      <h4 className={styles.detailSectionTitle}>States</h4>
      <div className={styles.borderInfo}>
        <span>hover: {styleDef.states.hover}</span>
        <span>active: {styleDef.states.active}</span>
      </div>
      <h4 className={styles.detailSectionTitle}>Shadow</h4>
      <div className={styles.shadowList}>
        {(['none', 'sm', 'md', 'lg', 'xl', 'inset'] as const).map((key) => {
          const value =
            key === 'none'
              ? resolved.shadows.none
              : resolved.shadows[key as keyof typeof resolved.shadows];
          if (value === undefined) return null;
          return (
            <div key={key} className={styles.shadowRow}>
              <code className={styles.shadowKey}>shadow-{key}</code>
              <code className={styles.shadowValue}>{value}</code>
            </div>
          );
        })}
      </div>
      <h4 className={styles.detailSectionTitle}>Border</h4>
      <div className={styles.borderInfo}>
        <span>width: {resolved.border.width}</span>
        <span>style: {resolved.border.style}</span>
        {styleDef.border.useColor !== undefined && (
          <span>useColor: {String(styleDef.border.useColor)}</span>
        )}
      </div>
    </div>
  );
}

export function StyleLab() {
  const [selectedStyle, setSelectedStyle] = useState<StyleName | null>(null);
  const bgColor = '#f5f5f5';

  return (
    <>
      <LabLayout title="Style Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <StyleOverviewDiagram />
          </LabOverview>
        </LabSection>

        <LabSection title={sectionTitles.shadowComparison} id="shadow-comparison">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.styles.map((styleName) => (
              <ComparisonCard
                key={styleName}
                title={capitalize(styleName)}
                styleVars={getStyleVariables(styleName, bgColor)}
                onClick={() => setSelectedStyle(styleName)}
                selected={selectedStyle === styleName}
              >
                <div
                  className={styles.cardInner}
                  style={{ backgroundColor: bgColor }}
                >
                  {shadowKeys.map((size) => (
                    <div
                      key={size}
                      className={styles.shadowDemo}
                      style={{
                        boxShadow: `var(--ds-shadow-${size})`,
                        backgroundColor: 'var(--ds-color-bg-base)',
                      }}
                    >
                      shadow-{size}
                    </div>
                  ))}
                </div>
              </ComparisonCard>
            ))}
          </div>
        </LabSection>

        <LabSection
          title={sectionTitles.componentComparison}
          id="component-comparison"
        >
          <div className={styles.comparisonGrid}>
            {comparisonPresets.styles.map((styleName) => (
              <ComparisonCard
                key={styleName}
                title={capitalize(styleName)}
                styleVars={getStyleVariables(styleName, bgColor)}
                onClick={() => setSelectedStyle(styleName)}
                selected={selectedStyle === styleName}
              >
                <div
                  className={styles.cardInner}
                  style={{
                    backgroundColor: bgColor,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--ds-spacing-4)',
                  }}
                >
                  <div
                    style={{ display: 'flex', gap: 'var(--ds-spacing-3)' }}
                  >
                    <Button variant="primary">{buttonLabels.primary}</Button>
                    <Button variant="secondary">{buttonLabels.secondary}</Button>
                  </div>
                  <Card padding="md">
                    <p
                      style={{
                        margin: 0,
                        fontSize: 'var(--ds-text-sm)',
                        color: 'var(--ds-color-text-primary)',
                      }}
                    >
                      {sampleText.pangram.en}
                    </p>
                  </Card>
                </div>
              </ComparisonCard>
            ))}
          </div>
        </LabSection>
      </LabLayout>

      <DetailPanel
        open={!!selectedStyle}
        onClose={() => setSelectedStyle(null)}
        title={selectedStyle ? capitalize(selectedStyle) : ''}
      >
        {selectedStyle && <StyleDetail name={selectedStyle} />}
      </DetailPanel>
    </>
  );
}
