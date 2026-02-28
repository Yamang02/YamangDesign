/**
 * E04: Palette Lab - 배색 실험 페이지 (E08 LabLayout 적용)
 */
import { useMemo } from 'react';
import { useTheme } from '../../../themes';
import { createPalette } from '../../../palettes';
import { palettePresets, toCustomPaletteDefinition } from '../../../themes/presets';
import { Select, Button } from '../../../components';
import { LabLayout, LabSection } from '../../../layouts';
import type { PaletteName } from '../../../@types/theme';

const paletteOptions: { value: PaletteName; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'monochrome', label: 'Monochrome' },
  { value: 'earth', label: 'Earth' },
];

export function PaletteLab() {
  const { paletteName, setPaletteName, customColors, setCustomColors } = useTheme();

  const paletteDef = useMemo(() => {
    if (customColors) return toCustomPaletteDefinition(customColors);
    return palettePresets[paletteName as Exclude<PaletteName, 'custom'>] ?? palettePresets.default;
  }, [paletteName, customColors]);

  const expandedPalette = useMemo(() => createPalette(paletteDef), [paletteDef]);

  return (
    <LabLayout title="Palette Lab" subtitle="배색 탐색">
      <LabSection title="Preset 선택" withDivider={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)', maxWidth: 300 }}>
          <Select
            options={paletteOptions}
            value={paletteName}
            onChange={(v) => setPaletteName(v as PaletteName)}
            variant="outline"
          />
          {customColors && (
            <Button variant="ghost" size="sm" onClick={() => setCustomColors(null)}>
              Preset으로 초기화
            </Button>
          )}
        </div>
      </LabSection>

      <LabSection title="Color Scales">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ds-spacing-4)', width: '100%' }}>
          {(['primary', 'secondary', 'accent', 'sub'] as const).map((key) => (
            <div key={key}>
              <p
                style={{
                  fontSize: 'var(--ds-text-sm)',
                  fontWeight: 'var(--ds-font-weight-medium)',
                  color: 'var(--ds-color-text-secondary)',
                  marginBottom: 'var(--ds-spacing-2)',
                  textTransform: 'capitalize',
                }}
              >
                {key}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor:
                        expandedPalette.scales[key][n as keyof typeof expandedPalette.scales.primary],
                      borderRadius: 4,
                    }}
                    title={`${key} ${n}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
