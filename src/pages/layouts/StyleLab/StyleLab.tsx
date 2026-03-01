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
import { minimalStyle, neumorphismStyle } from '../../../styles';
import type { StyleName } from '../../../@types/theme';
import { StyleOverviewDiagram } from './StyleOverviewDiagram';
import styles from './StyleLab.module.css';

const styleMap = {
  minimal: minimalStyle,
  neumorphism: neumorphismStyle,
} as const;

const shadowKeys = ['sm', 'md', 'lg'] as const;

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'shadow-comparison', label: sectionTitles.shadowComparison },
  { id: 'component-comparison', label: sectionTitles.componentComparison },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function StyleDetail({ name }: { name: StyleName }) {
  const styleDef = styleMap[name as keyof typeof styleMap];
  if (!styleDef) return null;
  const resolved = createStyle(styleDef, '#f5f5f5');

  return (
    <div className={styles.styleDetail}>
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
      </div>
    </div>
  );
}

export function StyleLab() {
  const [selectedStyle, setSelectedStyle] = useState<StyleName | null>(null);
  const bgColor = '#f5f5f5';

  return (
    <>
      <LabLayout title="Style Lab" subtitle="GUI 스타일 비교" tocItems={tocItems}>
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
                        backgroundColor: 'var(--ds-color-bg-surface)',
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
