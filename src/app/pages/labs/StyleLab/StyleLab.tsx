/**
 * Style Lab — Property Matrix, 비교 뷰, DetailPanel, Overview는 도메인 StyleDefinition·프리셋에서 동적 구성.
 */
import { useMemo, useState } from 'react';
import { Button, Card, DetailPanel } from '../../../components';
import { LabLayout, LabSection, LabOverview, ComparisonCard, ComparisonGrid, MetadataTable, type TocItem } from '../../../layouts';
import { sampleText, buttonLabels, sectionTitles } from '@app/content/lab-content';
import { getStyleVariables, getPaletteVariablesFromDefinition, getThemeVariables, comparisonPresets } from '@domain/constants';
import { createStyle } from '@domain/styles';
import { stylePresets, palettePresets } from '@domain/themes/presets';
import type { PaletteName, StyleName } from '@shared/@types/theme';
import type { StyleDefinition } from '@domain/styles';
import { createPalette } from '@domain/palettes';
import overviewJson from '@app/content/labs/style-lab/overview.json';
import type { StyleLabOverview, StyleVariant } from '@app/content/labs/style-lab/types';
import { StyleOverviewDiagram } from './StyleOverviewDiagram';
import { TokenDiffTable } from './TokenDiffTable';
import styles from './StyleLab.module.css';

const shadowKeys = ['sm', 'md', 'lg'] as const;

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'property-matrix', label: 'Property Matrix' },
  { id: 'component-comparison', label: sectionTitles.componentComparison },
  { id: 'shadow-comparison', label: sectionTitles.shadowComparison },
  { id: 'token-diff', label: 'Token Diff' },
];

function usePaletteVars(paletteId: PaletteName): Record<string, string> {
  return useMemo(() => {
    const def = palettePresets[paletteId];
    return def ? getPaletteVariablesFromDefinition(def) : {};
  }, [paletteId]);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isBuiltinPaletteName(value: string): value is PaletteName {
  return comparisonPresets.palettes.includes(value as PaletteName);
}

const STYLE_METADATA: Partial<Record<string, Pick<StyleVariant, 'description' | 'characteristics'>>> =
  Object.fromEntries(
    (overviewJson as StyleLabOverview).styleVariants.map((v) => [
      v.name.toLowerCase(),
      { description: v.description, characteristics: v.characteristics },
    ])
  );

/** E06 P02: Property Matrix — 스타일별 슬롯 값 표 */
function PropertyMatrix({
  presets,
  activeStyle,
  onStyleSelect,
}: Readonly<{
  presets: StyleName[];
  activeStyle: StyleName | null;
  onStyleSelect: (name: StyleName) => void;
}>) {
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
          const blurRe = /blur\(([^)]+)\)/;
          const m = blurRe.exec(v);
          if (m) return m[1].trim();
          if (v.length > 12) return `${v.slice(0, 12)}…`;
          return v;
        },
      },
      {
        id: 'material-alpha',
        label: 'material alpha',
        getValue: (def) =>
          def.material?.backgroundAlpha == null ? '—' : String(def.material.backgroundAlpha),
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

function StyleDetail({ name, bgColor }: Readonly<{ name: StyleName; bgColor: string }>) {
  const styleDef = stylePresets[name];
  const meta = STYLE_METADATA[name];
  if (!styleDef) return null;
  const resolved = createStyle(styleDef, bgColor);

  return (
    <div className={styles.styleDetail}>
      {meta && (
        <>
          <h4 className={styles.detailSectionTitle}>설명</h4>
          <p className={styles.detailDescription}>{meta.description}</p>
          <h4 className={styles.detailSectionTitle}>특징</h4>
          <ul className={styles.characteristicsList}>
            {meta.characteristics.map((char) => (
              <li key={char} className={styles.characteristicItem}>
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
            const v = key === 'none' ? resolved.shadows.none : resolved.shadows[key];
            return v !== undefined;
          })
          .map((key) => {
            const v = key === 'none' ? resolved.shadows.none : resolved.shadows[key];
            return { key: `shadow-${key}`, value: v };
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
  const [paletteId, setPaletteId] = useState<PaletteName>('default');
  const [baseStyle, setBaseStyle] = useState<StyleName>('minimal');
  const [compareStyle, setCompareStyle] = useState<StyleName>('neumorphism');
  const [previewBackdrop, setPreviewBackdrop] = useState<'neutral' | 'glass'>('neutral');

  const paletteVars = usePaletteVars(paletteId);
  const backgroundBaseColor = useMemo(() => {
    const paletteDef = palettePresets[paletteId];
    return paletteDef
      ? createPalette(paletteDef).semantic.bg.base
      : createPalette(palettePresets.default).semantic.bg.base;
  }, [paletteId]);
  const activeStyles = useMemo(
    () => [baseStyle, compareStyle].filter((s, i, arr) => arr.indexOf(s) === i),
    [baseStyle, compareStyle]
  );

  const styleAffinityWarning = useMemo(() => {
    const styleDef = stylePresets[baseStyle];
    const paletteDef = palettePresets[paletteId];
    const bg = paletteDef?.bgStrategy;
    if (!styleDef?.incompatibleBgStrategies?.length || !bg) return null;
    if (!styleDef.incompatibleBgStrategies.includes(bg)) return null;
    return `경고: ${capitalize(baseStyle)}는 bgStrategy가 '${bg}'일 때 효과가 소멸할 수 있습니다.`;
  }, [baseStyle, paletteId]);

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

        <LabSection title="Comparison Controls" id="comparison-controls" card={false}>
          <div className={styles.comparisonControls}>
            <label className={styles.controlGroup}>
              <span className={styles.controlLabel}>Palette</span>
              <select
                className={styles.paletteSelect}
                value={paletteId}
                onChange={(e) => {
                  const next = e.target.value;
                  if (isBuiltinPaletteName(next)) setPaletteId(next);
                }}
              >
                {comparisonPresets.palettes.map((p) => (
                  <option key={p} value={p}>
                    {capitalize(p)}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Base Style</span>
              <select
                className={styles.paletteSelect}
                value={baseStyle}
                onChange={(e) => {
                  const next = e.target.value as StyleName;
                  setBaseStyle(next);
                  if (next === compareStyle) {
                    const fallback = comparisonPresets.styles.find((s) => s !== next);
                    if (fallback) setCompareStyle(fallback);
                  }
                }}
              >
                {comparisonPresets.styles.map((styleName) => (
                  <option key={styleName} value={styleName}>
                    {capitalize(styleName)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Compare Style</span>
              <select
                className={styles.paletteSelect}
                value={compareStyle}
                onChange={(e) => setCompareStyle(e.target.value as StyleName)}
              >
                {comparisonPresets.styles
                  .filter((styleName) => styleName !== baseStyle)
                  .map((styleName) => (
                    <option key={styleName} value={styleName}>
                      {capitalize(styleName)}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Preview Backdrop</span>
              <select
                className={styles.paletteSelect}
                value={previewBackdrop}
                onChange={(e) => setPreviewBackdrop(e.target.value as 'neutral' | 'glass')}
              >
                <option value="neutral">Neutral</option>
                <option value="glass">Glass-friendly</option>
              </select>
            </div>
          </div>

          {styleAffinityWarning && (
            <div className={styles.styleAffinityWarning} role="alert">
              {styleAffinityWarning}
            </div>
          )}
        </LabSection>

        <LabSection
          title={sectionTitles.componentComparison}
          id="component-comparison"
        >
          <ComparisonGrid
            className={`${styles.comparisonWrapper} ${
              previewBackdrop === 'glass'
                ? styles.comparisonWrapperGlass
                : styles.comparisonWrapperNeutral
            }`}
          >
            {activeStyles.map((styleName) => (
              <ComparisonCard
                key={styleName}
                title={capitalize(styleName)}
                styleVars={getThemeVariables(paletteId, styleName)}
                surfaceContent
                onClick={() => setSelectedStyle(styleName)}
                selected={selectedStyle === styleName}
              >
                <div
                  className={styles.cardInner}
                  style={{
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

        <LabSection title={sectionTitles.shadowComparison} id="shadow-comparison">
          <ComparisonGrid
            paletteVars={paletteVars}
            className={`${styles.comparisonWrapper} ${
              previewBackdrop === 'glass'
                ? styles.comparisonWrapperGlass
                : styles.comparisonWrapperNeutral
            }`}
          >
            {activeStyles.map((styleName) => (
              <ComparisonCard
                key={styleName}
                title={capitalize(styleName)}
                styleVars={getStyleVariables(styleName, backgroundBaseColor)}
                surfaceContent
                onClick={() => setSelectedStyle(styleName)}
                selected={selectedStyle === styleName}
              >
                <div className={styles.cardInner}>
                  <div>
                    {shadowKeys.map((size) => (
                      <div
                        key={size}
                        className={styles.shadowDemo}
                        style={{
                          boxShadow: `var(--ds-shadow-${size})`,
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

        <LabSection title="Token Diff" id="token-diff" card={false}>
          <TokenDiffTable
            baseStyle={baseStyle}
            compareStyles={[compareStyle]}
            paletteId={paletteId}
          />
        </LabSection>
      </LabLayout>

      <DetailPanel
        open={!!selectedStyle}
        onClose={() => setSelectedStyle(null)}
        title={selectedStyle ? capitalize(selectedStyle) : ''}
      >
        {selectedStyle && <StyleDetail name={selectedStyle} bgColor={backgroundBaseColor} />}
      </DetailPanel>
    </>
  );
}
