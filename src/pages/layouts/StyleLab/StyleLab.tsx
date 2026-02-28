/**
 * E04: Style Lab - GUI 스타일 실험 페이지 (E08 LabLayout 적용)
 */
import { useTheme } from '../../../themes';
import { Select, Button, Card } from '../../../components';
import { LabLayout, LabSection } from '../../../layouts';
import type { StyleName } from '../../../@types/theme';

const styleOptions: { value: StyleName; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

export function StyleLab() {
  const { styleName, setStyleName } = useTheme();

  return (
    <LabLayout title="Style Lab" subtitle="GUI 스타일 탐색">
      <LabSection title="Style 선택" withDivider={false}>
        <div style={{ maxWidth: 200 }}>
          <Select
            options={styleOptions}
            value={styleName}
            onChange={(v) => setStyleName(v as StyleName)}
            variant="outline"
          />
        </div>
      </LabSection>

      <LabSection title="Shadow Samples">
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
      </LabSection>

      <LabSection title="Component Preview">
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-4)', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Card padding="md">
            <p style={{ margin: 0, fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-text-primary)' }}>
              Card with {styleName} style
            </p>
          </Card>
        </div>
      </LabSection>
    </LabLayout>
  );
}
