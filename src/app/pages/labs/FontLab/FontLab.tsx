/**
 * E08: Font Lab - E05 Typography 시각화
 * E01: lab-content 중앙화 적용
 * E05 P03: DetailPanel — JSON 출력 대신 구조화된 토큰 테이블 + 라이브 프리뷰
 */
import { useState } from 'react';
import { LabLayout, LabSection, LabOverview, LabCard, ComparisonCard, type TocItem } from '../../../layouts';
import { DetailPanel } from '../../../components';
import {
  sampleText,
  formatters,
  semanticPreviews,
  fontFamilyLabels,
  sectionTitles,
} from '@app/content/lab-content';
import { textStyles, semanticText } from '@domain/tokens/typography';
import { fontSize, fontFamily } from '@domain/tokens/global/typography';
import type { TextStyleName, SemanticTextRole } from '@domain/tokens/typography';
import { FontOverviewDiagram } from './FontOverviewDiagram';
import styles from './FontLab.module.css';

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

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'text-styles', label: sectionTitles.textStyles },
  { id: 'semantic-mapping', label: sectionTitles.semanticMapping },
  { id: 'type-scale', label: sectionTitles.typeScale },
  { id: 'font-families', label: sectionTitles.fontFamilies },
];
const fontSizeKeys = Object.keys(fontSize) as (keyof typeof fontSize)[];

/** E05 P03: 토큰 속성 테이블 + 라이브 프리뷰 */
function TextStyleDetail({ name }: { name: TextStyleName }) {
  const style = textStyles[name];
  const fields: { label: string; value: string; token?: string }[] = [
    { label: 'Font size', value: style.fontSize, token: `--ds-text-${name}-size` },
    { label: 'Font weight', value: String(style.fontWeight), token: `--ds-text-${name}-weight` },
    { label: 'Line height', value: String(style.lineHeight), token: `--ds-text-${name}-leading` },
    ...(style.letterSpacing ? [{ label: 'Letter spacing', value: style.letterSpacing, token: `--ds-text-${name}-tracking` }] : []),
    ...(style.fontFamily ? [{ label: 'Font family', value: style.fontFamily, token: `--ds-text-${name}-font` }] : []),
  ];
  return (
    <div>
      {fields.map(({ label, value, token }) => (
        <div key={label} className={styles.detailRow}>
          <span className={styles.detailLabel}>{label}</span>
          <div className={styles.detailValue}>
            {token != null && <code className={styles.detailToken}>{token}</code>}
            <span>{value}</span>
          </div>
        </div>
      ))}
      <p
        className={styles.detailPreview}
        style={{
          fontSize: `var(--ds-text-${name}-size)`,
          fontWeight: `var(--ds-text-${name}-weight)`,
          lineHeight: `var(--ds-text-${name}-leading)`,
          ...(style.letterSpacing && { letterSpacing: `var(--ds-text-${name}-tracking)` }),
          ...(style.fontFamily && { fontFamily: `var(--ds-text-${name}-font, var(--ds-font-mono))` }),
        }}
      >
        {sampleText.pangram.en}
      </p>
    </div>
  );
}

export function FontLab() {
  const [selectedStyle, setSelectedStyle] = useState<TextStyleName | null>(null);

  return (
    <>
      <LabLayout title="Font Lab" tocItems={tocItems}>
        <LabSection title="Overview" id="overview" card={false}>
          <LabOverview>
            <FontOverviewDiagram />
          </LabOverview>
        </LabSection>

        <LabSection title={sectionTitles.textStyles} id="text-styles">
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
                        color: 'var(--shell-text-primary)',
                        margin: 0,
                        marginBottom: 'var(--ds-spacing-1)',
                      }}
                    >
                      {sampleText.pangram.en}
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--ds-text-xs)',
                        color: 'var(--shell-text-secondary)',
                        margin: 0,
                      }}
                    >
                      {formatters.textStyleMeta(
                        name,
                        textStyles[name].fontSize,
                        textStyles[name].fontWeight,
                        textStyles[name].lineHeight
                      )}
                    </p>
                  </div>
                </LabCard>
              );
            })}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.semanticMapping} id="semantic-mapping">
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
                        color: 'var(--shell-text-secondary)',
                        margin: '0 0 var(--ds-spacing-2) 0',
                      }}
                    >
                      {role} → {styleName}
                    </p>
                    <p
                      style={{
                        ...vars,
                        color: 'var(--shell-text-primary)',
                        margin: 0,
                      }}
                    >
                      {semanticPreviews[role] ?? role}
                    </p>
                  </div>
                </LabCard>
              );
            })}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.typeScale} id="type-scale">
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
                    color: 'var(--shell-text-primary)',
                    fontFamily: 'var(--ds-font-sans)',
                  }}
                >
                  Aa
                </span>
                <span
                  style={{
                    fontSize: 'var(--ds-text-xs)',
                    color: 'var(--shell-text-secondary)',
                  }}
                >
                  {key} · {fontSize[key]}
                </span>
              </div>
            ))}
          </div>
        </LabSection>

        <LabSection title={sectionTitles.fontFamilies} id="font-families">
          <div
            style={{
              display: 'flex',
              gap: 'var(--ds-spacing-6)',
              flexWrap: 'wrap',
            }}
          >
            <ComparisonCard title={fontFamilyLabels.sans}>
              <p
                style={{
                  fontFamily: fontFamily.sans,
                  fontSize: 'var(--ds-text-lg)',
                  color: 'var(--shell-text-primary)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {sampleText.pangram.en}
              </p>
              <p
                style={{
                  fontFamily: fontFamily.sans,
                  fontSize: 'var(--ds-text-md)',
                  color: 'var(--shell-text-secondary)',
                  margin: 'var(--ds-spacing-2) 0 0 0',
                }}
              >
                {sampleText.numbers}
              </p>
              <p
                style={{
                  fontFamily: fontFamily.sans,
                  fontSize: 'var(--ds-text-sm)',
                  color: 'var(--shell-text-secondary)',
                  margin: 'var(--ds-spacing-1) 0 0 0',
                  letterSpacing: '0.05em',
                }}
              >
                {sampleText.alphabet}
              </p>
            </ComparisonCard>
            <ComparisonCard title={fontFamilyLabels.mono}>
              <p
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 'var(--ds-text-lg)',
                  color: 'var(--shell-text-primary)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {sampleText.pangram.en}
              </p>
              <p
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 'var(--ds-text-md)',
                  color: 'var(--shell-text-secondary)',
                  margin: 'var(--ds-spacing-2) 0 0 0',
                }}
              >
                {sampleText.numbers}
              </p>
              <p
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 'var(--ds-text-sm)',
                  color: 'var(--shell-text-secondary)',
                  margin: 'var(--ds-spacing-1) 0 0 0',
                  letterSpacing: '0.05em',
                }}
              >
                {sampleText.alphabet}
              </p>
            </ComparisonCard>
          </div>
        </LabSection>
      </LabLayout>

      <DetailPanel
        open={!!selectedStyle}
        onClose={() => setSelectedStyle(null)}
        title={selectedStyle ?? ''}
      >
        {selectedStyle && <TextStyleDetail name={selectedStyle} />}
      </DetailPanel>
    </>
  );
}
