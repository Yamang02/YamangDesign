/**
 * E20 P01: Spacing Lab — 4px 기반 스케일 시각화
 */
import { useState } from 'react';
import { LabLayout, LabSection, LabOverview, type TocItem } from '../../../layouts';
import { spacing } from '@domain/tokens/global/spacing';
import type { SpacingKey, SpacingValue } from '@domain/tokens/global/spacing';
import styles from './SpacingLab.module.css';

const spacingEntries = (Object.keys(spacing) as unknown as SpacingKey[]).map(
  (key) => [key, spacing[key]] as [SpacingKey, SpacingValue],
);
const maxPx = 96;

function keyToCssVar(key: SpacingKey): string {
  const keyStr = String(key);
  return `--ds-spacing-${keyStr.replace('.', '-')}`;
}

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'scale', label: 'Scale' },
  { id: 'diff', label: 'Diff' },
  { id: 'context', label: 'Context' },
];

type ContextMode = 'padding' | 'gap' | 'margin';

export function SpacingLab() {
  const [diffA, setDiffA] = useState<SpacingKey>(4);
  const [diffB, setDiffB] = useState<SpacingKey>(8);
  const [contextMode, setContextMode] = useState<ContextMode>('padding');

  const valueA = spacing[diffA] ?? '0px';
  const valueB = spacing[diffB] ?? '0px';
  const pxA = Number.parseInt(valueA, 10);
  const pxB = Number.parseInt(valueB, 10);
  const diffPx = Math.abs(pxB - pxA);

  const contextEntries = spacingEntries.filter(([key]) => {
    return key >= 1 && key <= 12 && Number.isInteger(key);
  });

  return (
    <LabLayout title="Spacing Lab" tocItems={tocItems}>
      <LabSection title="Overview" id="overview" card={false}>
        <LabOverview
          description="4px 기반 스케일. 모든 여백과 간격은 이 스케일에서 선택한다."
          items={[
            { label: '0 – 24', description: '토큰 키 범위' },
            { label: '0px – 96px', description: '실제 크기 범위' },
            { label: '4px', description: '기본 단위' },
          ]}
        />
      </LabSection>

      <LabSection title="Scale" id="scale">
        <div className={styles.scaleList}>
          {spacingEntries.map(([key, value]) => {
            const px = Number.parseInt(value, 10);
            const pct = (px / maxPx) * 100;
            return (
              <div key={key} className={styles.scaleRow}>
                <span className={styles.scaleKey}>{key}</span>
                <code className={styles.scaleVar}>{keyToCssVar(key)}</code>
                <span className={styles.scaleValue}>{value}</span>
                <div className={styles.barTrack}>
                  {px > 0 && (
                    <div className={styles.bar} style={{ width: `${pct}%` }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </LabSection>

      <LabSection title="Diff" id="diff">
        <div className={styles.diffLayout}>
          <div className={styles.diffVisual}>
            <div className={styles.diffBlocks}>
              <div className={styles.diffBlockA} style={{ height: pxA || 2 }} />
              <div className={styles.diffBlockB} style={{ height: pxB || 2 }} />
              {diffPx > 0 && (
                <div className={styles.diffBlockDelta} style={{ height: diffPx }} />
              )}
              {diffPx === 0 && (
                <span className={styles.diffEqual}>동일</span>
              )}
            </div>
            <div className={styles.diffLabels}>
              <span className={styles.diffBlockLabel}>A · {valueA}</span>
              <span className={styles.diffBlockLabel}>B · {valueB}</span>
              {diffPx > 0 && (
                <span className={styles.diffBlockLabel}>Δ {diffPx}px</span>
              )}
            </div>
          </div>

          <div className={styles.diffControls}>
            <label className={styles.diffLabel}>
              <span className={styles.diffLabelText}>A</span>
              <select
                value={diffA}
                onChange={(e) => setDiffA(Number(e.target.value) as SpacingKey)}
                className={styles.diffSelect}
              >
                {spacingEntries.map(([key, val]) => (
                  <option key={key} value={String(key)}>
                    {key} ({val})
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.diffLabel}>
              <span className={styles.diffLabelText}>B</span>
              <select
                value={diffB}
                onChange={(e) => setDiffB(Number(e.target.value) as SpacingKey)}
                className={styles.diffSelect}
              >
                {spacingEntries.map(([key, val]) => (
                  <option key={key} value={String(key)}>
                    {key} ({val})
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </LabSection>

      <LabSection title="Context" id="context">
        <div className={styles.contextTabs}>
          {(['padding', 'gap', 'margin'] as ContextMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`${styles.contextTab} ${contextMode === mode ? styles.contextTabActive : ''}`}
              onClick={() => setContextMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className={styles.contextGrid}>
          {contextEntries.map(([key, value]) => (
            <div key={key} className={styles.contextCard}>
              <span className={styles.contextLabel}>
                {key} · {value}
              </span>
              {contextMode === 'padding' && (
                <div className={styles.contextPaddingOuter}>
                  <div className={styles.contextPaddingInner} style={{ padding: value }}>
                    <div className={styles.contextContent} />
                  </div>
                </div>
              )}
              {contextMode === 'gap' && (
                <div className={styles.contextGapRow}>
                  <div className={styles.contextBlock} />
                  <div className={styles.contextGap} style={{ width: value, flexShrink: 0 }} />
                  <div className={styles.contextBlock} />
                  <div className={styles.contextGap} style={{ width: value, flexShrink: 0 }} />
                  <div className={styles.contextBlock} />
                </div>
              )}
              {contextMode === 'margin' && (
                <div className={styles.contextMarginOuter}>
                  <div className={styles.contextMarginBox} style={{ margin: value }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
