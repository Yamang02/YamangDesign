/**
 * E05: Playground - Palette × Style × Font 조합 선택 + Component Preview
 * 드롭다운으로 조합 선택 후 대표 컴포넌트 프리뷰
 * Brand Theme / System / Neutral 프리셋 선택 지원
 */
import { useState } from 'react';
import { Button, Card, Input, Select } from '../../../components';
import { LabLayout, LabSection, type TocItem } from '../../../layouts';
import {
  getThemeVariables,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
  sampleText,
  buttonLabels,
  inputPlaceholders,
  sectionTitles,
  fontFamilyLabels,
  semanticPreviews,
} from '../../../constants';
import { fontFamily } from '../../../tokens/primitives/typography';
import type {
  PaletteName,
  StyleName,
  SystemPresetName,
} from '../../../@types/theme';
import type { NeutralPresetName } from '../../../tokens/primitives/neutral-presets';
import styles from './Playground.module.css';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const paletteOptions = comparisonPresets.palettes.map((p) => ({
  value: p,
  label: capitalize(p),
}));

const systemPresetOptions = comparisonPresets.systemPresets.map((s) => ({
  value: s,
  label: capitalize(s),
}));

const neutralPresetOptions = comparisonPresets.neutralPresets.map((n) => ({
  value: n,
  label: capitalize(n),
}));

const styleOptions = comparisonPresets.styles.map((s) => ({
  value: s,
  label: capitalize(s),
}));

const fontOptions = [
  { value: 'sans', label: fontFamilyLabels.sans },
  { value: 'mono', label: fontFamilyLabels.mono },
];

type FontKey = 'sans' | 'mono';

const tocItems: TocItem[] = [
  { id: 'combination-select', label: sectionTitles.combinationSelect },
  { id: 'component-preview', label: sectionTitles.componentPreview },
];

export function Playground() {
  const [palette, setPalette] = useState<PaletteName>(comparisonPresets.palettes[0]);
  const [systemPreset, setSystemPreset] = useState<SystemPresetName>(
    comparisonPresets.systemPresets[0]
  );
  const [neutralPreset, setNeutralPreset] = useState<NeutralPresetName>(
    comparisonPresets.neutralPresets[0]
  );
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);
  const [font, setFont] = useState<FontKey>('sans');

  const themeVars = {
    ...getThemeVariables(palette, style),
    ...getSystemColorVariables(systemPreset),
    ...getNeutralPresetVariables(neutralPreset),
  };
  const fontFamilyValue = font === 'sans' ? fontFamily.sans : fontFamily.mono;

  return (
    <LabLayout
      title="Playground"
      subtitle="Palette × Style × Font 조합 실험"
      tocItems={tocItems}
    >
      <LabSection title={sectionTitles.combinationSelect} id="combination-select">
        <div className={styles.selectRow}>
          <Select
            label="Palette (Brand)"
            options={paletteOptions}
            value={palette}
            onChange={(v) => setPalette(v as PaletteName)}
            placeholder="Palette 선택"
          />
          <Select
            label="System"
            options={systemPresetOptions}
            value={systemPreset}
            onChange={(v) => setSystemPreset(v as SystemPresetName)}
            placeholder="System 선택"
          />
          <Select
            label="Neutral"
            options={neutralPresetOptions}
            value={neutralPreset}
            onChange={(v) => setNeutralPreset(v as NeutralPresetName)}
            placeholder="Neutral 선택"
          />
          <Select
            label="Style"
            options={styleOptions}
            value={style}
            onChange={(v) => setStyle(v as StyleName)}
            placeholder="Style 선택"
          />
          <Select
            label="Font"
            options={fontOptions}
            value={font}
            onChange={(v) => setFont(v as FontKey)}
            placeholder="Font 선택"
          />
        </div>
      </LabSection>

      <LabSection title={sectionTitles.componentPreview} id="component-preview">
        <div className={styles.previewGrid}>
          <div className={styles.previewColumn}>
            <h3 className={styles.previewColumnTitle}>Brand</h3>
            <div
              className={styles.previewContainer}
              style={{
                ...themeVars,
                fontFamily: fontFamilyValue,
              }}
            >
              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Typography</h3>
                <p className={styles.previewPageTitle}>{semanticPreviews['page-title']}</p>
                <p className={styles.previewSectionSubtitle}>
                  {semanticPreviews['section-title']}
                </p>
            <p className={styles.previewBody}>{sampleText.pangram.en}</p>
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Buttons</h3>
                <div className={styles.previewRow}>
              <Button variant="primary">{buttonLabels.primary}</Button>
              <Button variant="secondary">{buttonLabels.secondary}</Button>
              <Button variant="ghost">{buttonLabels.ghost}</Button>
                </div>
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Form Elements</h3>
                <Input placeholder={inputPlaceholders.input} />
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Card</h3>
                <Card padding="md">
                  <h4
                    style={{
                      margin: '0 0 var(--ds-spacing-2) 0',
                      fontSize: 'var(--ds-text-lg)',
                      fontWeight: 'var(--ds-font-weight-semibold)',
                      color: 'var(--ds-color-text-primary)',
                    }}
                  >
                    Card Title
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--ds-text-sm)',
                      color: 'var(--ds-color-text-primary)',
                    }}
                  >
                    Card content with the selected combination applied.
                  </p>
                  <div className={styles.cardAction}>
                    <Button variant="primary" size="sm">
                      Action
                    </Button>
                  </div>
                </Card>
              </section>
            </div>
          </div>

          <div className={styles.previewColumn}>
            <h3 className={styles.previewColumnTitle}>System</h3>
            <div
              className={styles.previewContainer}
              style={{
                ...themeVars,
                fontFamily: fontFamilyValue,
              }}
            >
              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Typography</h3>
                <p
                  className={styles.previewBody}
                  style={{ color: 'var(--ds-color-system-error)' }}
                >
                  Error text
                </p>
                <p
                  className={styles.previewBody}
                  style={{ color: 'var(--ds-color-system-warning)' }}
                >
                  Warning text
                </p>
                <p
                  className={styles.previewBody}
                  style={{ color: 'var(--ds-color-system-success)' }}
                >
                  Success text
                </p>
                <p
                  className={styles.previewBody}
                  style={{ color: 'var(--ds-color-system-info)' }}
                >
                  Info text
                </p>
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Form Elements</h3>
                <Input
                  placeholder={inputPlaceholders.input}
                  isError
                  errorMessage="입력값을 확인해 주세요"
                />
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Status</h3>
                <div className={styles.statusRow}>
                  <span
                  className={styles.statusChip}
                  style={{ color: 'var(--ds-color-system-error)' }}
                >
                  Error
                </span>
                <span
                  className={styles.statusChip}
                  style={{ color: 'var(--ds-color-system-warning)' }}
                >
                  Warning
                </span>
                <span
                  className={styles.statusChip}
                  style={{ color: 'var(--ds-color-system-success)' }}
                >
                  Success
                </span>
                <span
                  className={styles.statusChip}
                  style={{ color: 'var(--ds-color-system-info)' }}
                >
                  Info
                </span>
                </div>
              </section>

              <section className={styles.previewSection}>
                <h3 className={styles.previewSectionTitle}>Card</h3>
                <Card padding="md">
                  <h4
                    style={{
                      margin: '0 0 var(--ds-spacing-2) 0',
                      fontSize: 'var(--ds-text-lg)',
                      fontWeight: 'var(--ds-font-weight-semibold)',
                      color: 'var(--ds-color-text-primary)',
                    }}
                  >
                    System Message
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--ds-text-sm)',
                      color: 'var(--ds-color-system-error)',
                    }}
                  >
                    Error: 입력값을 확인해 주세요
                  </p>
                  <div className={styles.cardAction}>
                    <Button variant="primary" size="sm">
                      Retry
                    </Button>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </LabSection>
    </LabLayout>
  );
}
