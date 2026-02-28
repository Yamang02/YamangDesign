/**
 * E04: Playground - Palette × Style 조합 테스트
 * E01: 조합 매트릭스 + lab-content 적용
 */
import { Button, Card, Input } from '../../../components';
import { LabLayout, LabSection } from '../../../layouts';
import {
  getThemeVariables,
  comparisonPresets,
  sampleText,
  buttonLabels,
  inputPlaceholders,
  sectionTitles,
} from '../../../constants';
import type { PaletteName, StyleName } from '../../../@types/theme';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Playground() {
  return (
    <LabLayout title="Playground" subtitle="Palette × Style × Font 조합 실험">
      <LabSection title={sectionTitles.combinationMatrix} id="combination-matrix">
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 600,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: 'var(--ds-spacing-4)',
                    textAlign: 'left',
                    fontSize: 'var(--ds-text-sm)',
                    color: 'var(--ds-color-text-secondary)',
                    fontWeight: 'var(--ds-font-weight-medium)',
                    borderBottom: '1px solid var(--ds-color-border-subtle)',
                  }}
                >
                  Palette \ Style
                </th>
                {comparisonPresets.styles.map((styleName) => (
                  <th
                    key={styleName}
                    style={{
                      padding: 'var(--ds-spacing-4)',
                      fontSize: 'var(--ds-text-sm)',
                      color: 'var(--ds-color-text-secondary)',
                      fontWeight: 'var(--ds-font-weight-medium)',
                      borderBottom: '1px solid var(--ds-color-border-subtle)',
                    }}
                  >
                    {capitalize(styleName)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonPresets.palettes.map((paletteName) => (
                <tr key={paletteName}>
                  <td
                    style={{
                      padding: 'var(--ds-spacing-4)',
                      fontSize: 'var(--ds-text-sm)',
                      fontWeight: 'var(--ds-font-weight-medium)',
                      color: 'var(--ds-color-text-primary)',
                      borderBottom: '1px solid var(--ds-color-border-subtle)',
                      verticalAlign: 'top',
                    }}
                  >
                    {capitalize(paletteName)}
                  </td>
                  {comparisonPresets.styles.map((styleName) => (
                    <td
                      key={`${paletteName}-${styleName}`}
                      style={{
                        padding: 'var(--ds-spacing-4)',
                        borderBottom: '1px solid var(--ds-color-border-subtle)',
                        verticalAlign: 'top',
                      }}
                    >
                      <div
                        style={{
                          ...getThemeVariables(
                            paletteName as PaletteName,
                            styleName as StyleName
                          ),
                          padding: 'var(--ds-spacing-4)',
                          backgroundColor: 'var(--ds-color-bg-base)',
                          borderRadius: 'var(--ds-radius-lg)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--ds-spacing-3)',
                          minHeight: 120,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 'var(--ds-spacing-2)' }}>
                          <Button variant="primary">{buttonLabels.primary}</Button>
                          <Button variant="secondary">{buttonLabels.secondary}</Button>
                        </div>
                        <Input placeholder={inputPlaceholders.input} />
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
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LabSection>
    </LabLayout>
  );
}
