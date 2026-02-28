/**
 * E04: Style Lab - GUI 스타일 실험 페이지
 */
import { useTheme } from '../../../themes';
import { Select, Button, Card } from '../../../components';
import type { StyleName } from '../../../@types/theme';

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

const styleOptions: { value: StyleName; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

export function StyleLab() {
  const { styleName, setStyleName } = useTheme();

  return (
    <main style={sectionStyle}>
      <h1 style={titleStyle}>Style Lab</h1>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <label style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: 'var(--ds-spacing-2)' }}>
          Style 선택
        </label>
        <Select
          options={styleOptions}
          value={styleName}
          onChange={(v) => setStyleName(v as StyleName)}
          variant="outline"
        />
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-spacing-4)' }}>
          Shadow Samples
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-spacing-4)' }}>
          {['none', 'sm', 'md', 'lg', 'inset'].map((key) => (
            <div
              key={key}
              style={{
                padding: 'var(--ds-spacing-6)',
                backgroundColor: 'var(--ds-color-bg-surface)',
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: `var(--ds-shadow-${key})`,
                fontSize: 'var(--ds-text-sm)',
                color: 'var(--ds-color-text-secondary)',
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-spacing-4)' }}>
          Component Preview
        </h2>
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-4)', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Card padding="md">
            <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-primary)' }}>
              Card with {styleName} style
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
