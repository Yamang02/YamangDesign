/**
 * E05: Palette Lab - 배색 비교 뷰 + DetailPanel
 */
import { useState } from 'react';
import {
  LabLayout,
  LabSection,
  ComparisonCard,
  type TocItem,
} from '../../../layouts';
import { DetailPanel } from '../../../components';
import {
  getPaletteVariables,
  getSystemColorVariables,
  getNeutralPresetVariables,
  comparisonPresets,
  sectionTitles,
} from '../../../constants';
import { useTheme } from '../../../themes';
import { palettePresets } from '../../../themes/presets';
import { createPalette } from '../../../palettes';
import type { PaletteName, SystemPresetName } from '../../../@types/theme';
import type { NeutralPresetName } from '../../../tokens/primitives/neutral-presets';
import styles from './PaletteLab.module.css';

const colorKeys = ['primary', 'secondary', 'accent', 'sub', 'neutral'] as const;
const systemColorKeys = ['error', 'warning', 'success', 'info'] as const;
const systemScaleSteps = [50, 500, 700] as const;
const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function PaletteDetail({ name }: { name: Exclude<PaletteName, 'custom'> }) {
  const preset = palettePresets[name];
  if (!preset) return null;
  const expanded = createPalette(preset);

  return (
    <div className={styles.paletteDetail}>
      <h4 className={styles.detailSectionTitle}>기본 색상</h4>
      <div className={styles.colorSwatches}>
        {(['primary', 'secondary', 'accent', 'sub', 'neutral'] as const).map(
          (key) => {
            const scale = expanded.scales[key];
            if (!scale || Object.keys(scale).length === 0) return null;
            const base = scale[500] ?? scale[400] ?? Object.values(scale)[0];
            return (
              <div key={key} className={styles.colorRow}>
                <span className={styles.colorLabel}>{capitalize(key)}</span>
                <span
                  className={styles.colorSample}
                  style={{ backgroundColor: base }}
                  title={base}
                />
                <code className={styles.colorHex}>{base}</code>
              </div>
            );
          }
        )}
      </div>
      <h4 className={styles.detailSectionTitle}>확장 스케일 (50~900)</h4>
      <div className={styles.scaleGrid}>
        {colorKeys.map((colorKey) => {
          const scale = expanded.scales[colorKey];
          if (!scale) return null;
          return (
            <div key={colorKey} className={styles.scaleColumn}>
              <span className={styles.scaleLabel}>{capitalize(colorKey)}</span>
              <div className={styles.scaleRow}>
                {scaleSteps.map((step) => {
                  const color = scale[step as keyof typeof scale];
                  if (!color) return null;
                  return (
                    <div
                      key={step}
                      className={styles.scaleSwatch}
                      style={{ backgroundColor: color }}
                      title={`${colorKey} ${step}: ${color}`}
                    />
                  );
                })}
              </div>
              <div className={styles.scaleLabels}>
                {scaleSteps.map((step) => (
                  <span key={step} className={styles.scaleStep}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const tocItems: TocItem[] = [
  { id: 'color-scales', label: sectionTitles.colorScales },
  { id: 'neutral-presets', label: sectionTitles.neutralPresets },
  { id: 'system-colors', label: sectionTitles.systemColors },
];

function NeutralPresetCard({ presetName }: { presetName: NeutralPresetName }) {
  return (
    <ComparisonCard
      title={capitalize(presetName)}
      styleVars={getNeutralPresetVariables(presetName)}
    >
      <div className={styles.colorColumn}>
        <p className={styles.colorKeyLabel}>Neutral</p>
        <div className={styles.swatchRow}>
          {[100, 300, 500, 700, 900].map((step) => (
            <div
              key={step}
              className={styles.swatch}
              style={{
                backgroundColor: `var(--ds-color-neutral-${step})`,
              }}
              title={`neutral ${step}`}
            />
          ))}
        </div>
      </div>
    </ComparisonCard>
  );
}

function SystemColorCard({
  presetName,
  selected,
  onSelect,
}: {
  presetName: SystemPresetName;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <ComparisonCard
      title={capitalize(presetName)}
      styleVars={getSystemColorVariables(presetName)}
      onClick={onSelect}
      selected={selected}
    >
      {systemColorKeys.map((colorKey) => (
        <div key={colorKey} className={styles.colorColumn}>
          <p className={styles.colorKeyLabel}>{capitalize(colorKey)}</p>
          <div className={styles.swatchRow}>
            {systemScaleSteps.map((step) => {
              const varSuffix =
                step === 50 ? '-bg' : step === 700 ? '-emphasis' : '';
              return (
                <div
                  key={step}
                  className={styles.swatch}
                  style={{
                    backgroundColor: `var(--ds-color-system-${colorKey}${varSuffix})`,
                  }}
                  title={`${colorKey} ${step}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </ComparisonCard>
  );
}

export function PaletteLab() {
  const { systemPreset, setSystemPreset } = useTheme();
  const [selectedPalette, setSelectedPalette] = useState<
    Exclude<PaletteName, 'custom'> | null
  >(null);

  return (
    <>
      <LabLayout
        title="Palette Lab"
        subtitle="배색 비교"
        tocItems={tocItems}
      >
        <LabSection title={sectionTitles.colorScales} id="color-scales">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.palettes.map((paletteName) => (
              <ComparisonCard
                key={paletteName}
                title={capitalize(paletteName)}
                styleVars={getPaletteVariables(paletteName)}
                onClick={() =>
                  setSelectedPalette(
                    paletteName as Exclude<PaletteName, 'custom'>
                  )
                }
                selected={selectedPalette === paletteName}
              >
                {colorKeys.map((colorKey) => (
                  <div key={colorKey} className={styles.colorColumn}>
                    <p className={styles.colorKeyLabel}>{capitalize(colorKey)}</p>
                    <div className={styles.swatchRow}>
                      {[100, 300, 500, 700, 900].map((step) => (
                        <div
                          key={step}
                          className={styles.swatch}
                          style={{
                            backgroundColor: `var(--ds-color-${colorKey}-${step})`,
                          }}
                          title={`${colorKey} ${step}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </ComparisonCard>
            ))}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.neutralPresets} id="neutral-presets">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.neutralPresets.map((presetName) => (
              <NeutralPresetCard key={presetName} presetName={presetName} />
            ))}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.systemColors} id="system-colors">
          <div className={styles.comparisonGrid}>
            {comparisonPresets.systemPresets.map((presetName) => (
              <SystemColorCard
                key={presetName}
                presetName={presetName}
                selected={systemPreset === presetName}
                onSelect={() => setSystemPreset(presetName)}
              />
            ))}
          </div>
        </LabSection>
      </LabLayout>

      <DetailPanel
        open={!!selectedPalette}
        onClose={() => setSelectedPalette(null)}
        title={selectedPalette ? capitalize(selectedPalette) : ''}
      >
        {selectedPalette && <PaletteDetail name={selectedPalette} />}
      </DetailPanel>
    </>
  );
}
