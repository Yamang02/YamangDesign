/**
 * E05/E06 P02: Style Lab - Property Matrix, 비교 뷰, DetailPanel
 */
import { useState, useMemo } from 'react';
import { Button, Card, DetailPanel } from '../../../components';
import { LabLayout, LabSection, LabOverview, ComparisonCard, ComparisonGrid, MetadataTable, type TocItem } from '../../../layouts';
import { sampleText, buttonLabels, sectionTitles } from '@app/content/lab-content';
import { getStyleVariables, getPaletteVariablesFromDefinition, comparisonPresets } from '@domain/constants';
import { createStyle } from '@domain/styles';
import { stylePresets } from '@domain/themes/presets';
import { palettePresets } from '@domain/themes/presets';
import type { StyleName } from '@shared/@types/theme';
import type { StyleDefinition } from '@domain/styles';
import { StyleOverviewDiagram } from './StyleOverviewDiagram';
import styles from './StyleLab.module.css';

const shadowKeys = ['sm', 'md', 'lg'] as const;
const bgColor = '#F5F5F5';

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'property-matrix', label: 'Property Matrix' },
  { id: 'shadow-comparison', label: sectionTitles.shadowComparison },
  { id: 'component-comparison', label: sectionTitles.componentComparison },
];

/** E06 P02: 기준 팔레트 변수 (Comparison 섹션 고정 배경용) */
function useFixedPaletteVars(): Record<string, string> {
  return useMemo(() => {
    const firstPaletteId = comparisonPresets.palettes[0];
    const def = firstPaletteId ? palettePresets[firstPaletteId] : undefined;
    return def ? getPaletteVariablesFromDefinition(def) : {};
  }, []);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STYLE_METADATA: Partial<
  Record<StyleName, { description: string; characteristics: string[] }>
> = {
  minimal: {
    description: '클린하고 모던한 스타일',
    characteristics: ['아래 방향 드롭 섀도우', '얇은 테두리 (1px)', '플랫한 배경'],
  },
  neumorphism: {
    description: '소프트하고 입체적인 스타일',
    characteristics: ['양방향 그림자 (raised)', '테두리 없음', '배경과 융합'],
  },
  brutalism: {
    description: '거칠고 강렬한 비주얼',
    characteristics: ['하드 드롭 섀도우', '굵은 테두리 (3px)', '강한 대비'],
  },
  glassmorphism: {
    description: '유리 효과 스타일',
    characteristics: ['배경 블러', '반투명 표면', '얇은 밝은 테두리'],
  },
};

/** E06 P02: Property Matrix — 스타일별 슬롯 값 표 */
function PropertyMatrix({
  presets,
  activeStyle,
  onStyleSelect,
}: {
  presets: StyleName[];
  activeStyle: StyleName | null;
  onStyleSelect: (name: StyleName) => void;
}) {
  const propertyRows = useMemo(() => {
    const rows: { id: string; label: string; getValue: (def: StyleDefinition) => string }[] = [
      {
        id: 'elevation-sm',
        label: 'elevation (sm)',
        getValue: () => 'shadow-sm',
      },
      {
        id: 'elevation-inset',
        label: 'elevation (inset)',
        getValue: () => 'shadow-inset',
      },
      { id: 'stroke-width', label: 'stroke width', getValue: (def) => def.stroke.width },
      { id: 'stroke-strategy', label: 'stroke strategy', getValue: (def) => def.stroke.colorStrategy },
      {
        id: 'material-blur',
        label: 'material blur',
        getValue: (def) => {
          const v = def.material?.backdropFilter;
          if (!v) return '—';
          const m = v.match(/blur\(([^)]+)\)/);
          return m ? m[1].trim() : (v.length > 12 ? `${v.slice(0, 12)}…` : v);
        },
      },
      {
        id: 'material-alpha',
        label: 'material alpha',
        getValue: (def) => (def.material?.backgroundAlpha != null ? String(def.material.backgroundAlpha) : '—'),
      },
      {
        id: 'filter',
        label: 'filter',
        getValue: (def) => {
          const v = def.filter?.element;
          if (!v) return '—';
          return v.length > 20 ? `${v.slice(0, 18)}…` : v;
        },
      },
      { id: 'spatial', label: 'spatial', getValue: (def) => def.spatial?.perspective ?? '—' },
    ];
    return rows;
  }, []);

  return (
    <div className={styles.propertyMatrixWrap}>
      <table className={styles.propertyMatrix}>
        <thead>
          <tr>
            <th className={styles.propertyMatrixDim}>속성</th>
            {presets.map((name) => (
              <th key={name} className={styles.propertyMatrixPreset}>
                <button
                  type="button"
                  className={styles.propertyMatrixPresetBtn}
                  onClick={() => onStyleSelect(name)}
                >
                  {capitalize(name)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {propertyRows.map((row) => (
            <tr key={row.id}>
              <td className={styles.propertyMatrixDim}>{row.label}</td>
              {presets.map((name) => {
                const d = stylePresets[name];
                const value = d ? row.getValue(d) : '—';
                const isActiveCol = activeStyle === name;
                return (
                  <td
                    key={name}
                    className={styles.propertyMatrixCellWrap}
                    data-active={isActiveCol ? true : undefined}
                  >
                    <span className={styles.propertyMatrixCell}>{value}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StyleDetail({ name }: { name: StyleName }) {
  const styleDef = stylePresets[name];
  const meta = STYLE_METADATA[name];
  if (!styleDef) return null;
  const resolved = createStyle(styleDef, '#F5F5F5');

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
      <MetadataTable
        title="Shadow"
        rows={(['none', 'sm', 'md', 'lg', 'xl', 'inset'] as const)
          .filter((key) => {
            const v = key === 'none' ? resolved.shadows.none : resolved.shadows[key as keyof typeof resolved.shadows];
            return v !== undefined;
          })
          .map((key) => {
            const v = key === 'none' ? resolved.shadows.none : resolved.shadows[key as keyof typeof resolved.shadows];
            return { key: `shadow-${key}`, value: v! };
          })}
      />
      <MetadataTable
        title="Stroke"
        rows={[
          { key: 'width', value: resolved.border.width },
          { key: 'style', value: resolved.border.style },
          { key: 'colorStrategy', value: styleDef.stroke.colorStrategy },
        ]}
      />
    </div>
  );
}

export function StyleLab() {
  const [selectedStyle, setSelectedStyle] = useState<StyleName | null>(null);
  const fixedPaletteVars = useFixedPaletteVars();

  return (
    <>
      <LabLayout
        title="Style Lab"
        tocItems={tocItems}
      >
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <StyleOverviewDiagram />
          </LabOverview>
        </LabSection>

        <LabSection title="Property Matrix" id="property-matrix">
          <PropertyMatrix
            presets={comparisonPresets.styles}
            activeStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
          />
        </LabSection>

        <LabSection title={sectionTitles.shadowComparison} id="shadow-comparison">
          <ComparisonGrid paletteVars={fixedPaletteVars} className={styles.comparisonWrapper}>
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
                  style={{ backgroundColor: 'var(--ds-color-bg-base)' }}
                >
                  <div data-context="preview">
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
                </div>
              </ComparisonCard>
            ))}
          </ComparisonGrid>
        </LabSection>

        <LabSection
          title={sectionTitles.componentComparison}
          id="component-comparison"
        >
          <ComparisonGrid paletteVars={fixedPaletteVars} className={styles.comparisonWrapper}>
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
                    backgroundColor: 'var(--ds-color-bg-base)',
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
                        color: 'var(--shell-text-primary)',
                      }}
                    >
                      {sampleText.pangram.en}
                    </p>
                  </Card>
                </div>
              </ComparisonCard>
            ))}
          </ComparisonGrid>
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
