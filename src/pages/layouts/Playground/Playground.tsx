/**
 * E05: Playground - Palette × Style × Font 조합 선택 + Component Preview
 * 드롭다운으로 조합 선택 후 대표 컴포넌트 프리뷰
 */
import { useState } from 'react';
import { Button, Card, Input, Select } from '../../../components';
import { LabLayout, LabSection, type TocItem } from '../../../layouts';
import {
  getThemeVariables,
  comparisonPresets,
  sampleText,
  buttonLabels,
  inputPlaceholders,
  sectionTitles,
  fontFamilyLabels,
  semanticPreviews,
} from '../../../constants';
import { fontFamily } from '../../../tokens/primitives/typography';
import type { PaletteName, StyleName } from '../../../@types/theme';
import styles from './Playground.module.css';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const paletteOptions = comparisonPresets.palettes.map((p) => ({
  value: p,
  label: capitalize(p),
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
  const [style, setStyle] = useState<StyleName>(comparisonPresets.styles[0]);
  const [font, setFont] = useState<FontKey>('sans');

  const themeVars = getThemeVariables(palette, style);
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
            label="Palette"
            options={paletteOptions}
            value={palette}
            onChange={(v) => setPalette(v as PaletteName)}
            placeholder="Palette 선택"
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
      </LabSection>
    </LabLayout>
  );
}
