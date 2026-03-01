/**
 * P05: 전체 스케일×스텝 그리드 - 왼쪽에 고정 표시
 * 토큰 선택 후 원하는 셀 클릭으로 매핑
 */
import { Tooltip } from '../../../components';
import {
  getScaleRecommendation,
  type SemanticTokenPath,
} from '../../../palettes/mapping/recommendations';
import type { BgStrategy, ScaleReference } from '../../../palettes/types';
import type { GeneratedScales } from '../../../@types/tokens';
import { Icon } from '../../../components';
import styles from './ScaleStepGrid.module.css';

const SCALES: ScaleReference['scale'][] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'sub',
];

const SCALE_LABEL: Record<ScaleReference['scale'], string> = {
  primary: 'P',
  secondary: 'S',
  accent: 'A',
  neutral: 'N',
  sub: 'B',
};

const STEPS: ScaleReference['step'][] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export interface ScaleStepGridProps {
  scales: GeneratedScales;
  bgStrategy: BgStrategy;
  selectedToken: SemanticTokenPath | null;
  onSelect: (value: ScaleReference) => void;
}

export function ScaleStepGrid({
  scales,
  bgStrategy,
  selectedToken,
  onSelect,
}: ScaleStepGridProps) {
  const canSelect = !!selectedToken;

  return (
    <div className={styles.grid}>
      <p className={styles.hint}>
        {selectedToken ? '색상 클릭' : '토큰 클릭'}
      </p>
      <div className={styles.columns}>
        {SCALES.map((scale) => {
          const scaleData = scales[scale];
          if (!scaleData) return null;
          return (
            <div key={scale} className={styles.column}>
              <span className={styles.scaleLabel}>{SCALE_LABEL[scale]}</span>
              <div className={styles.stepGrid}>
                {STEPS.map((step) => {
                  const color = scaleData[step] ?? '#ccc';
                  const ref: ScaleReference = { scale, step };
                  const rec = selectedToken
                    ? getScaleRecommendation(selectedToken, scale, step, bgStrategy)
                    : null;
                  return (
                    <Tooltip
                      key={step}
                      content={`${scale}-${step}${rec?.message ? ` · ${rec.message}` : ''}`}
                      portal
                      position="right"
                    >
                      <button
                        type="button"
                        className={styles.cell}
                        disabled={!canSelect}
                        onClick={() => canSelect && onSelect(ref)}
                        style={{ backgroundColor: color }}
                        title={`${scale}-${step}`}
                        data-recommended={rec?.level === 'recommended' || undefined}
                        data-warning={rec?.level === 'warning' || undefined}
                      >
                        {rec?.level === 'recommended' && (
                          <span className={styles.cellIcon} aria-hidden>
                            <Icon name="check" size="sm" />
                          </span>
                        )}
                        {rec?.level === 'warning' && (
                          <span className={styles.cellIcon} aria-hidden>
                            <Icon name="warning" size="sm" />
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
