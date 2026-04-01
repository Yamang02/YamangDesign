/**
 * E20 P02: Grid Lab — 컬럼 그리드 / 거터 / 마진 / 브레이크포인트 시각화
 */
import { useState } from 'react';
import { LabLayout, LabSection, LabOverview, type TocItem } from '../../../layouts';
import { gridColumns, gridGutter, gridMargin, breakpoints } from '@domain/tokens/global/grid';
import type { GridBreakpoint, Breakpoint } from '@domain/tokens/global/grid';
import styles from './GridLab.module.css';

const breakpointKeys = Object.keys(gridColumns) as GridBreakpoint[];
const bpKeys = Object.keys(breakpoints) as Breakpoint[];

const tocItems: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'grid-overlay', label: 'Grid Overlay' },
  { id: 'breakpoints', label: 'Breakpoints' },
  { id: 'specs', label: 'Specs' },
];

const BP_LABELS: Record<GridBreakpoint, string> = {
  compact: 'Compact (Mobile)',
  tablet: 'Tablet',
  desktop: 'Desktop',
};

function formatBreakpointRange(bp: GridBreakpoint, bpTokens: typeof breakpoints): string {
  if (bp === 'compact') return `< ${bpTokens.md}`;
  if (bp === 'tablet') return `${bpTokens.md} – ${bpTokens.lg}`;
  return `≥ ${bpTokens.lg}`;
}

function GridOverlay({
  columns,
  gutter,
  margin,
}: Readonly<{
  columns: number;
  gutter: string;
  margin: string;
}>) {
  const items: React.ReactNode[] = [];
  for (let i = 0; i < columns; i++) {
    items.push(<div key={`col-${i}`} className={styles.overlayColumn} />);
    if (i < columns - 1) {
      items.push(
        <div key={`gut-${i}`} className={styles.overlayGutter} style={{ width: gutter, flexShrink: 0 }} />
      );
    }
  }

  return (
    <div className={styles.overlayWrapper} style={{ paddingLeft: margin, paddingRight: margin }}>
      <div className={styles.overlayFlex}>{items}</div>
      <div className={styles.overlayMarginLeft} style={{ width: margin }} />
      <div className={styles.overlayMarginRight} style={{ width: margin }} />
    </div>
  );
}

export function GridLab() {
  const [activeBp, setActiveBp] = useState<GridBreakpoint>('desktop');

  const columns = gridColumns[activeBp];
  const gutter = gridGutter[activeBp];
  const margin = gridMargin[activeBp];

  return (
    <LabLayout title="Grid Lab" tocItems={tocItems}>
      <LabSection title="Overview" id="overview" card={false}>
        <LabOverview
          description="컬럼 그리드 시스템. 브레이크포인트에 따라 컬럼 수, 거터, 마진이 달라진다."
          items={[
            { label: '4 / 8 / 12', description: '브레이크포인트별 컬럼 수' },
            { label: '16 / 24 / 32px', description: '거터(열 간격)' },
            { label: '16 / 32 / 64px', description: '좌우 마진' },
          ]}
        />
      </LabSection>

      <LabSection title="Grid Overlay" id="grid-overlay">
        <div className={styles.bpTabs}>
          {breakpointKeys.map((bp) => (
            <button
              key={bp}
              type="button"
              className={`${styles.bpTab} ${activeBp === bp ? styles.bpTabActive : ''}`}
              onClick={() => setActiveBp(bp)}
            >
              {BP_LABELS[bp]}
            </button>
          ))}
        </div>

        <div className={styles.previewMeta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Columns</span>
            <strong className={styles.metaValue}>{columns}</strong>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Gutter</span>
            <strong className={styles.metaValue}>{gutter}</strong>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Margin</span>
            <strong className={styles.metaValue}>{margin}</strong>
          </span>
        </div>

        <div className={styles.previewCanvas}>
          <GridOverlay columns={columns} gutter={gutter} margin={margin} />
          <div className={styles.canvasContent}>
            <div className={styles.contentFlex} style={{ paddingLeft: margin, paddingRight: margin }}>
              {Array.from({ length: columns }, (_, idx) => `col-${idx + 1}`).map((columnId, idx) => (
                <div key={columnId}>
                  <div className={styles.contentBlock} />
                  {idx < columns - 1 && (
                    <div style={{ width: gutter, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </LabSection>

      <LabSection title="Breakpoints" id="breakpoints">
        <div className={styles.bpTable}>
          <div className={styles.bpTableHeader}>
            <span>브레이크포인트</span>
            <span>시작 너비</span>
            <span>컬럼</span>
            <span>거터</span>
            <span>마진</span>
          </div>
          {bpKeys.map((bp) => (
            <div key={bp} className={styles.bpTableRow}>
              <code className={styles.bpName}>{bp}</code>
              <span className={styles.bpCell}>{breakpoints[bp]}</span>
              <span className={styles.bpCell}>—</span>
              <span className={styles.bpCell}>—</span>
              <span className={styles.bpCell}>—</span>
            </div>
          ))}
          {breakpointKeys.map((bp) => (
            <div key={bp} className={styles.bpTableRow}>
              <code className={styles.bpName}>{bp}</code>
              <span className={styles.bpCell}>
                {formatBreakpointRange(bp, breakpoints)}
              </span>
              <span className={styles.bpCell}>{gridColumns[bp]}</span>
              <span className={styles.bpCell}>{gridGutter[bp]}</span>
              <span className={styles.bpCell}>{gridMargin[bp]}</span>
            </div>
          ))}
        </div>
      </LabSection>

      <LabSection title="Specs" id="specs">
        <div className={styles.specsGrid}>
          {breakpointKeys.map((bp) => (
            <div key={bp} className={styles.specCard}>
              <h3 className={styles.specCardTitle}>{BP_LABELS[bp]}</h3>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Columns</span>
                <span className={styles.specValue}>{gridColumns[bp]}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Gutter</span>
                <span className={styles.specValue}>{gridGutter[bp]}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Margin</span>
                <span className={styles.specValue}>{gridMargin[bp]}</span>
              </div>
              <div className={styles.specMiniGrid}>
                {Array.from({ length: gridColumns[bp] }, (_, idx) => `${bp}-mini-${idx + 1}`).map((miniId) => (
                  <div key={miniId} className={styles.specMiniCol} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </LabSection>
    </LabLayout>
  );
}
