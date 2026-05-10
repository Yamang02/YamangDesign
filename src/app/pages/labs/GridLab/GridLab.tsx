/**
 * E20 P02: Grid Lab — 컬럼 그리드 / 거터 / 마진 / 브레이크포인트 시각화
 */
import { useState, type CSSProperties } from 'react';
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

type GridTrack = Readonly<{
  kind: 'column' | 'gutter';
  index: number;
}>;

function createGridTracks(columns: number): GridTrack[] {
  const tracks: GridTrack[] = [];
  for (let i = 0; i < columns; i++) {
    tracks.push({ kind: 'column', index: i });
    if (i < columns - 1) {
      tracks.push({ kind: 'gutter', index: i });
    }
  }
  return tracks;
}

function formatBreakpointRange(bp: GridBreakpoint, bpTokens: typeof breakpoints): string {
  if (bp === 'compact') return `< ${bpTokens.md}`;
  if (bp === 'tablet') return `${bpTokens.md} – ${bpTokens.lg}`;
  return `≥ ${bpTokens.lg}`;
}

function GridOverlay({
  tracks,
}: Readonly<{
  tracks: readonly GridTrack[];
}>) {
  return (
    <div className={styles.overlayWrapper}>
      <div className={styles.overlayFlex}>
        {tracks.map((track) =>
          track.kind === 'column' ? (
            <div key={`overlay-col-${track.index}`} className={styles.overlayColumn} />
          ) : (
            <div key={`overlay-gut-${track.index}`} className={styles.overlayGutter} aria-hidden="true" />
          )
        )}
      </div>
      <div className={styles.overlayMarginLeft} />
      <div className={styles.overlayMarginRight} />
    </div>
  );
}

export function GridLab() {
  const [activeBp, setActiveBp] = useState<GridBreakpoint>('desktop');

  const columns = gridColumns[activeBp];
  const gutter = gridGutter[activeBp];
  const margin = gridMargin[activeBp];
  const tracks = createGridTracks(columns);
  const previewCanvasStyle = {
    '--grid-gutter': gutter,
    '--grid-margin': margin,
  } as CSSProperties;

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
        <div className={styles.previewLegend} aria-label="Grid legend">
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchColumn}`} aria-hidden="true" />
            <span className={styles.legendText}>Column</span>
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchGutter}`} aria-hidden="true" />
            <span className={styles.legendText}>Gutter</span>
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchMargin}`} aria-hidden="true" />
            <span className={styles.legendText}>Margin</span>
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchContent}`} aria-hidden="true" />
            <span className={styles.legendText}>Content Block</span>
          </span>
        </div>

        <div className={styles.previewCanvas} style={previewCanvasStyle}>
          <GridOverlay tracks={tracks} />
          <div className={styles.canvasContent}>
            <div className={styles.contentFlex}>
              {tracks.map((track) =>
                track.kind === 'column' ? (
                  <div key={`content-col-${track.index}`} className={styles.contentColumn}>
                    <div className={styles.contentBlock}>{`C${track.index + 1}`}</div>
                  </div>
                ) : (
                  <div key={`content-gut-${track.index}`} className={styles.contentGutter} aria-hidden="true" />
                )
              )}
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
