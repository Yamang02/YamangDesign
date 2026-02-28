/**
 * E08: Font Lab - E05 Typography 시각화
 */
import { useState } from 'react';
import { LabLayout, LabSection, LabCard } from '../../../layouts';
import { DetailPanel } from '../../../components';
import { textStyles } from '../../../tokens/typography';
import { semanticText } from '../../../tokens/typography';
import { fontSize } from '../../../tokens/primitives/typography';
import { fontFamily } from '../../../tokens/primitives/typography';
import type { TextStyleName, SemanticTextRole } from '../../../tokens/typography';

const semanticRoles: SemanticTextRole[] = [
  'page-title',
  'section-title',
  'card-title',
  'button',
  'input',
  'input-label',
  'helper-text',
  'tooltip',
  'badge',
];

const textStyleNames = Object.keys(textStyles) as TextStyleName[];
const fontSizeKeys = Object.keys(fontSize) as (keyof typeof fontSize)[];

export function FontLab() {
  const [selectedStyle, setSelectedStyle] = useState<TextStyleName | null>(null);

  return (
    <>
      <LabLayout title="Font Lab" subtitle="Typography Explorer">
        <LabSection title="Text Styles" withDivider={false}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--ds-spacing-4)',
              width: '100%',
            }}
          >
            {textStyleNames.map((name) => {
              const vars = {
                fontSize: `var(--ds-text-${name}-size)`,
                lineHeight: `var(--ds-text-${name}-leading)`,
                fontWeight: `var(--ds-text-${name}-weight)`,
                ...(textStyles[name].letterSpacing && {
                  letterSpacing: `var(--ds-text-${name}-tracking)`,
                }),
                ...(textStyles[name].fontFamily && {
                  fontFamily: `var(--ds-text-${name}-font, var(--ds-font-mono))`,
                }),
              };
              return (
                <LabCard
                  key={name}
                  onClick={() => setSelectedStyle(name)}
                  selected={selectedStyle === name}
                >
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <p
                      style={{
                        ...vars,
                        color: 'var(--ds-color-text-primary)',
                        margin: 0,
                        marginBottom: 'var(--ds-spacing-1)',
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--ds-text-xs)',
                        color: 'var(--ds-color-text-secondary)',
                        margin: 0,
                      }}
                    >
                      {name} · {textStyles[name].fontSize} · {textStyles[name].fontWeight}
                      {textStyles[name].lineHeight !== 'normal'
                        ? ` · ${textStyles[name].lineHeight}`
                        : ''}
                    </p>
                  </div>
                </LabCard>
              );
            })}
          </div>
        </LabSection>

        <LabSection title="Semantic Mapping">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--ds-spacing-4)',
              width: '100%',
            }}
          >
            {semanticRoles.map((role) => {
              const styleName = semanticText[role];
              const vars = {
                fontSize: `var(--ds-text-${styleName}-size)`,
                lineHeight: `var(--ds-text-${styleName}-leading)`,
                fontWeight: `var(--ds-text-${styleName}-weight)`,
              };
              return (
                <LabCard key={role}>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <p
                      style={{
                        fontSize: 'var(--ds-text-xs)',
                        color: 'var(--ds-color-text-secondary)',
                        margin: '0 0 var(--ds-spacing-2) 0',
                      }}
                    >
                      {role} → {styleName}
                    </p>
                    <p
                      style={{
                        ...vars,
                        color: 'var(--ds-color-text-primary)',
                        margin: 0,
                      }}
                    >
                      {role === 'button' && '[ Button ]'}
                      {role === 'page-title' && 'Page Title'}
                      {role === 'section-title' && 'Section Title'}
                      {role === 'card-title' && 'Card Header'}
                      {role === 'input' && 'Input text'}
                      {role === 'input-label' && 'Label'}
                      {role === 'helper-text' && 'Helper text'}
                      {role === 'tooltip' && 'Tooltip content'}
                      {role === 'badge' && 'badge'}
                    </p>
                  </div>
                </LabCard>
              );
            })}
          </div>
        </LabSection>

        <LabSection title="Type Scale">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--ds-spacing-4)',
              alignItems: 'baseline',
              width: '100%',
            }}
          >
            {fontSizeKeys.map((key) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--ds-spacing-1)',
                }}
              >
                <span
                  style={{
                    fontSize: fontSize[key],
                    color: 'var(--ds-color-text-primary)',
                    fontFamily: 'var(--ds-font-sans)',
                  }}
                >
                  Aa
                </span>
                <span
                  style={{
                    fontSize: 'var(--ds-text-xs)',
                    color: 'var(--ds-color-text-secondary)',
                  }}
                >
                  {key} · {fontSize[key]}
                </span>
              </div>
            ))}
          </div>
        </LabSection>

        <LabSection title="Font Families">
          <div
            style={{
              display: 'flex',
              gap: 'var(--ds-spacing-6)',
              flexWrap: 'wrap',
            }}
          >
            <LabCard>
              <div>
                <p
                  style={{
                    fontSize: 'var(--ds-text-sm)',
                    color: 'var(--ds-color-text-secondary)',
                    margin: '0 0 var(--ds-spacing-2) 0',
                  }}
                >
                  Sans
                </p>
                <p
                  style={{
                    fontFamily: fontFamily.sans,
                    fontSize: 'var(--ds-text-lg)',
                    color: 'var(--ds-color-text-primary)',
                    margin: 0,
                  }}
                >
                  The quick brown fox
                </p>
              </div>
            </LabCard>
            <LabCard>
              <div>
                <p
                  style={{
                    fontSize: 'var(--ds-text-sm)',
                    color: 'var(--ds-color-text-secondary)',
                    margin: '0 0 var(--ds-spacing-2) 0',
                  }}
                >
                  Mono
                </p>
                <p
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 'var(--ds-text-lg)',
                    color: 'var(--ds-color-text-primary)',
                    margin: 0,
                  }}
                >
                  The quick brown fox
                </p>
              </div>
            </LabCard>
          </div>
        </LabSection>
      </LabLayout>

      <DetailPanel
        open={!!selectedStyle}
        onClose={() => setSelectedStyle(null)}
        title={selectedStyle ?? ''}
      >
        {selectedStyle && (
          <div>
            <p
              style={{
                fontSize: 'var(--ds-text-sm)',
                color: 'var(--ui-text-secondary)',
                marginBottom: 'var(--ds-spacing-4)',
              }}
            >
              {JSON.stringify(textStyles[selectedStyle], null, 2)}
            </p>
            <p
              style={{
                fontSize: 'var(--ds-text-body-md-size)',
                lineHeight: 'var(--ds-text-body-md-leading)',
                fontWeight: 'var(--ds-text-body-md-weight)',
                color: 'var(--ui-text-primary)',
              }}
            >
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
        )}
      </DetailPanel>
    </>
  );
}
