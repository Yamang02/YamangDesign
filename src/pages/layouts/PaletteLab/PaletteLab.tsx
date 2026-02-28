/**
 * E04: Palette Lab - 배색 실험 페이지
 */
import { useMemo } from 'react';
import { useTheme } from '../../../themes';
import { createPalette } from '../../../palettes';
import { palettePresets, toCustomPaletteDefinition } from '../../../themes/presets';
import { Select, Button } from '../../../components';
import type { PaletteName } from '../../../@types/theme';

const sectionStyle = {
  padding: 'var(--ds-spacing-8) var(--ds-spacing-6)',
  maxWidth: '1200px',
  margin: '0 auto',
};

const titleStyle = {
  fontSize: 'var(--ds-text-3xl)',
  fontWeight: 'var(--ds-font-weight-bold)' as const,
  color: 'var(--ds-color-text-primary)',
  marginBottom: 'var(--ds-spacing-6)',
};

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
    <main style={sectionStyle}>
      <h1 style={titleStyle}>Palette Lab</h1>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <label style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: 'var(--ds-spacing-2)' }}>
          Preset 선택
        </label>
        <Select
          options={paletteOptions}
          value={paletteName}
          onChange={(v) => setPaletteName(v as PaletteName)}
          variant="outline"
        />
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-spacing-4)' }}>
          Color Scales
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ds-spacing-4)' }}>
          {(['primary', 'secondary', 'accent', 'sub'] as const).map((key) => (
            <div key={key}>
              <p style={{ fontSize: 'var(--ds-text-sm)', fontWeight: 'var(--ds-font-weight-medium)', color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-spacing-2)', textTransform: 'capitalize' }}>{key}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: expandedPalette.scales[key][n as keyof typeof expandedPalette.scales.primary],
                      borderRadius: 4,
                    }}
                    title={`${key} ${n}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {customColors && (
        <div>
          <Button variant="ghost" size="sm" onClick={() => setCustomColors(null)}>
            Preset으로 초기화
          </Button>
        </div>
      )}
    </main>
  );
}
