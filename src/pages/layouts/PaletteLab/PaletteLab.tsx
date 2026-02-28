/**
 * E04: Palette Lab - 배색 실험 페이지
 * E01: 비교 뷰 + lab-content/lab-presets 적용
 */
import { LabLayout, LabSection } from '../../../layouts';
import {
  getPaletteVariables,
  comparisonPresets,
  sectionTitles,
} from '../../../constants';

const colorKeys = ['primary', 'secondary', 'accent', 'sub'] as const;
const scaleSteps = [100, 300, 500, 700, 900] as const;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function PaletteLab() {
  return (
    <LabLayout title="Palette Lab" subtitle="배색 비교">
      <LabSection title={sectionTitles.colorScales} id="color-scales">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--ds-spacing-6)',
          }}
        >
          {comparisonPresets.palettes.map((paletteName) => (
            <div
              key={paletteName}
              style={{
                ...getPaletteVariables(paletteName),
                padding: 'var(--ds-spacing-6)',
                backgroundColor: 'var(--ds-color-bg-surface)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: 'var(--ds-radius-lg)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 var(--ds-spacing-4) 0',
                  fontSize: 'var(--ds-text-lg)',
                  fontWeight: 'var(--ds-font-weight-semibold)',
                  color: 'var(--ds-color-text-primary)',
                }}
              >
                {capitalize(paletteName)}
              </h3>
              {colorKeys.map((colorKey) => (
                <div
                  key={colorKey}
                  style={{
                    marginBottom: 'var(--ds-spacing-3)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--ds-text-xs)',
                      fontWeight: 'var(--ds-font-weight-medium)',
                      color: 'var(--ds-color-text-secondary)',
                      margin: '0 0 var(--ds-spacing-2) 0',
                      textTransform: 'capitalize',
                    }}
                  >
                    {colorKey}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    {scaleSteps.map((step) => (
                      <div
                        key={step}
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: `var(--ds-color-${colorKey}-${step})`,
                          borderRadius: 4,
                        }}
                        title={`${colorKey} ${step}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
