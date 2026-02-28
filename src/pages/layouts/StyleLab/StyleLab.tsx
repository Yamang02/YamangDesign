/**
 * E04: Style Lab - GUI 스타일 실험 페이지
 * E01: 비교 뷰 + lab-content/lab-presets 적용
 */
import { Button, Card } from '../../../components';
import { LabLayout, LabSection, type TocItem } from '../../../layouts';
import {
  getStyleVariables,
  comparisonPresets,
  sampleText,
  buttonLabels,
  sectionTitles,
} from '../../../constants';

const shadowKeys = ['sm', 'md', 'lg'] as const;

const tocItems: TocItem[] = [
  { id: 'shadow-comparison', label: sectionTitles.shadowComparison },
  { id: 'component-comparison', label: sectionTitles.componentComparison },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function StyleLab() {
  return (
    <LabLayout title="Style Lab" subtitle="GUI 스타일 비교" tocItems={tocItems}>
      <LabSection title={sectionTitles.shadowComparison} id="shadow-comparison">
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-spacing-6)',
            flexWrap: 'wrap',
          }}
        >
          {comparisonPresets.styles.map((styleName) => (
            <div
              key={styleName}
              style={{
                ...getStyleVariables(styleName, '#f5f5f5'),
                flex: 1,
                minWidth: 200,
                padding: 'var(--ds-spacing-6)',
                backgroundColor: '#f5f5f5',
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
                {capitalize(styleName)}
              </h3>
              {shadowKeys.map((size) => (
                <div
                  key={size}
                  style={{
                    padding: 'var(--ds-spacing-4)',
                    backgroundColor: 'var(--ds-color-bg-surface)',
                    boxShadow: `var(--ds-shadow-${size})`,
                    borderRadius: 'var(--ds-radius-md)',
                    marginBottom: 'var(--ds-spacing-3)',
                    fontSize: 'var(--ds-text-sm)',
                    color: 'var(--ds-color-text-secondary)',
                  }}
                >
                  shadow-{size}
                </div>
              ))}
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title={sectionTitles.componentComparison} id="component-comparison">
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-spacing-6)',
            flexWrap: 'wrap',
          }}
        >
          {comparisonPresets.styles.map((styleName) => (
            <div
              key={styleName}
              style={{
                ...getStyleVariables(styleName, '#f5f5f5'),
                flex: 1,
                minWidth: 200,
                padding: 'var(--ds-spacing-6)',
                backgroundColor: '#f5f5f5',
                borderRadius: 'var(--ds-radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-spacing-4)',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 'var(--ds-text-lg)',
                  fontWeight: 'var(--ds-font-weight-semibold)',
                  color: 'var(--ds-color-text-primary)',
                }}
              >
                {capitalize(styleName)}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--ds-spacing-3)' }}>
                <Button variant="primary">{buttonLabels.primary}</Button>
                <Button variant="secondary">{buttonLabels.secondary}</Button>
              </div>
              <Card padding="md">
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--ds-text-sm)',
                    color: 'var(--ds-color-text-primary)',
                  }}
                >
                  {sampleText.pangram.en}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
