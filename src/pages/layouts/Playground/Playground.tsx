/**
 * E04: Playground - Palette × Style 조합 테스트
 */
import { useTheme } from '../../../themes';
import { Select, Button, Card, Input } from '../../../components';
import type { PaletteName, StyleName } from '../../../@types/theme';

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

const styleOptions: { value: StyleName; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

export function Playground() {
  const { paletteName, setPaletteName, styleName, setStyleName } = useTheme();

  return (
    <main style={sectionStyle}>
      <h1 style={titleStyle}>Playground</h1>

      <div style={{ display: 'flex', gap: 'var(--ds-spacing-6)', marginBottom: 'var(--ds-spacing-8)', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: 'var(--ds-spacing-2)' }}>
            Palette
          </label>
          <Select
            options={paletteOptions}
            value={paletteName}
            onChange={(v) => setPaletteName(v as PaletteName)}
            variant="outline"
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: 'var(--ds-spacing-2)' }}>
            Style
          </label>
          <Select
            options={styleOptions}
            value={styleName}
            onChange={(v) => setStyleName(v as StyleName)}
            variant="outline"
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-spacing-4)' }}>
          Component Preview
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-spacing-4)', maxWidth: 400 }}>
          <div style={{ display: 'flex', gap: 'var(--ds-spacing-3)' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <Input placeholder="Input placeholder" />
          <Card padding="md">
            <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-primary)' }}>
              Card content - {paletteName} + {styleName}
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
